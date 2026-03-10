// api/create-subscription-payment.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    console.error('❌ MP_ACCESS_TOKEN não configurado!');
    return res.status(500).json({ error: 'Configuração ausente' });
  }

  try {
    const { userId, userEmail, userName } = req.body;

    if (!userId || !userEmail) {
      return res.status(400).json({ error: 'Dados do usuário são obrigatórios' });
    }

    // Inicializa Supabase
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Gera referência externa única
    const externalReference = `sub-${userId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Cria registro da assinatura no banco
    const { data: subscription, error: dbError } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: userId,
          status: 'pending',
          payment_status: 'pending',
          external_reference: externalReference,
          amount: 79.90,
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao criar assinatura no banco:', dbError);
      return res.status(500).json({ error: 'Erro ao criar assinatura' });
    }

    // Cria pagamento no Mercado Pago
    const paymentBody = {
      transaction_amount: 79.90,
      description: 'Assinatura Mensal - Contratos Ilimitados',
      payment_method_id: 'pix',
      payer: {
        email: userEmail,
        first_name: userName?.split(' ')[0] || 'Cliente',
        last_name: userName?.split(' ').slice(1).join(' ') || 'Contrateme',
        identification: {
          type: 'CPF',
          number: '00000000000', // Idealmente coletar do usuário
        },
      },
      external_reference: externalReference,
      notification_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}/api/subscription-webhook`,
      date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Idempotency-Key': externalReference,
      },
      body: JSON.stringify(paymentBody),
    });

    const paymentData = await response.json();

    if (!response.ok) {
      // Se falhou, remove a assinatura do banco
      await supabase.from('subscriptions').delete().eq('id', subscription.id);
      
      return res.status(400).json({
        error: 'Erro ao criar pagamento',
        details: paymentData.message || 'Erro desconhecido',
      });
    }

    // Atualiza a assinatura com o ID do pagamento
    await supabase
      .from('subscriptions')
      .update({ payment_id: paymentData.id.toString() })
      .eq('id', subscription.id);

    return res.status(200).json({
      subscriptionId: subscription.id,
      paymentId: paymentData.id,
      externalReference,
      qrCode: paymentData.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64,
      status: paymentData.status,
      expiresAt: paymentBody.date_of_expiration,
    });

  } catch (error) {
    console.error('💥 Server error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
}