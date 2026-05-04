// api/create-payment.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.MP_ACCESS_TOKEN;

  // ✅ DEBUG — retorna quais variáveis MP existem no ambiente
  if (!token) {
    return res.status(500).json({
      error: 'MP_ACCESS_TOKEN ausente',
      mp_vars_encontradas: Object.keys(process.env).filter(k => k.startsWith('MP') || k.includes('MERCADO') || k.includes('ACCESS')),
      todas_vars: Object.keys(process.env),
    });
  }

  try {
    const { contractType, paymentId: existingId } = req.body;

    const externalReference =
      existingId ||
      `contrato-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const body = {
      transaction_amount: 29.90,
      description: `Contrato: ${contractType || 'Documento'}`,
      payment_method_id: 'pix',
      payer: {
        email: 'cliente@contrate-me.com.br',
        first_name: 'Cliente',
        last_name: 'Contrateme',
        identification: {
          type: 'CPF',
          number: '00000000000',
        },
      },
      external_reference: externalReference,
      notification_url: `${
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NEXT_PUBLIC_BASE_URL
      }/api/webhook`,
      date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };

    console.log('📤 Enviando para Mercado Pago:', JSON.stringify(body, null, 2));

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Idempotency-Key': externalReference,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('📥 Resposta Mercado Pago (status', response.status, '):', JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(400).json({
        error: 'Erro ao criar pagamento',
        details: data.message || 'Erro desconhecido',
        mp_error: data,
      });
    }

    return res.status(200).json({
      paymentId: data.id,
      externalReference,
      qrCode: data.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: data.point_of_interaction?.transaction_data?.qr_code_base64,
      status: data.status,
      expiresAt: body.date_of_expiration,
    });

  } catch (error) {
    console.error('💥 Server error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
}