// api/renew-subscription.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { subscriptionId } = req.body;

  if (!subscriptionId) {
    return res.status(400).json({ error: 'subscriptionId é obrigatório' });
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Busca a assinatura
    const { data: subscription, error: findError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (findError || !subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    // Calcula nova data de expiração (30 dias a partir de agora)
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + 30);

    // Atualiza a assinatura
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        start_date: new Date().toISOString(),
        end_date: newEndDate.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId);

    if (updateError) {
      console.error('Erro ao renovar assinatura:', updateError);
      return res.status(500).json({ error: 'Erro ao renovar assinatura' });
    }

    // Atualiza cache no Vercel KV
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await fetch(`${process.env.KV_REST_API_URL}/set/subscription:${subscription.user_id}/active/ex/2592000`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Assinatura renovada com sucesso',
      endDate: newEndDate.toISOString(),
    });

  } catch (error) {
    console.error('Renew subscription error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}