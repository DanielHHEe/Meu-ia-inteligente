// api/create-payment.js
// Cria um pagamento Pix no Mercado Pago e retorna o QR Code

export default async function handler(req, res) {
  // Permite apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS — permite seu frontend chamar esta API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { contractType, paymentId: existingId } = req.body;

    // Gera um ID único para este pagamento (usado para rastrear depois)
    const externalReference = existingId || `contrato-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const body = {
      transaction_amount: 19.90,
      description: `Contrato: ${contractType || 'Documento'}`,
      payment_method_id: 'pix',
      payer: {
        email: 'cliente@contrate-me.com.br', // Email genérico — Mercado Pago exige
        first_name: 'Cliente',
        last_name: 'Contrate-me',
        identification: {
          type: 'CPF',
          number: '00000000000', // CPF genérico — obrigatório pela API
        },
      },
      external_reference: externalReference,
      notification_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`,
      date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // Expira em 30 min
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': externalReference,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Mercado Pago error:', data);
      return res.status(400).json({
        error: 'Erro ao criar pagamento',
        details: data.message || 'Erro desconhecido',
      });
    }

    // Retorna apenas o necessário para o frontend
    return res.status(200).json({
      paymentId: data.id,
      externalReference,
      qrCode: data.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: data.point_of_interaction?.transaction_data?.qr_code_base64,
      status: data.status,
      expiresAt: body.date_of_expiration,
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}