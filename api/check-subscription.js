// api/check-subscription.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId é obrigatório' });
  }

  try {
    // Inicializa Supabase
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Busca assinatura ativa do usuário
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .eq('payment_status', 'approved')
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = nenhum resultado
      console.error('Erro ao buscar assinatura:', error);
      return res.status(500).json({ error: 'Erro ao verificar assinatura' });
    }

    // Verifica no cache do Vercel KV (opcional)
    let isActiveFromCache = false;
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const kvResponse = await fetch(`${process.env.KV_REST_API_URL}/get/subscription:${userId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
          },
        });
        const kvData = await kvResponse.json();
        isActiveFromCache = kvData.result === 'active';
      } catch (e) {
        console.error('Erro ao verificar cache:', e);
      }
    }

    const hasActiveSubscription = !!subscription;
    const daysRemaining = subscription?.end_date 
      ? Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24))
      : 0;

    return res.status(200).json({
      hasActiveSubscription: hasActiveSubscription || isActiveFromCache,
      subscription: subscription || null,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      expiresAt: subscription?.end_date || null,
    });

  } catch (error) {
    console.error('Check subscription error:', error);
    return res.status(500).json({ error: 'Erro ao verificar assinatura' });
  }
}