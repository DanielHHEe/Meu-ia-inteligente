// api/subscription-webhook.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'webhook ativo' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    if (type !== 'payment') {
      return res.status(200).json({ received: true });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return res.status(200).json({ received: true });
    }

    // Consulta o pagamento no Mercado Pago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    const payment = await response.json();
    console.log(`Webhook assinatura — Payment ${paymentId}: ${payment.status}`);

    if (payment.status === 'approved') {
      const externalReference = payment.external_reference;

      // Inicializa Supabase
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Busca a assinatura pela external_reference
      const { data: subscription, error: findError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('external_reference', externalReference)
        .single();

      if (findError || !subscription) {
        console.error('Assinatura não encontrada:', externalReference);
        return res.status(200).json({ received: true });
      }

      // Calcula datas de início e fim (30 dias)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      // Atualiza a assinatura para ativa
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          payment_status: 'approved',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        })
        .eq('id', subscription.id);

      if (updateError) {
        console.error('Erro ao atualizar assinatura:', updateError);
      } else {
        console.log(`Assinatura ativada para usuário ${subscription.user_id} até ${endDate.toISOString()}`);
      }

      // Opcional: Salva no Vercel KV para cache rápido
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await fetch(`${process.env.KV_REST_API_URL}/set/subscription:${subscription.user_id}/active/ex/2592000`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
          },
        });
      }
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(200).json({ received: true });
  }
}