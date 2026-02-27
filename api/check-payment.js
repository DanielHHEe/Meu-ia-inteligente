// api/check-payment.js
// Frontend chama esta rota a cada 3s para saber se o pagamento foi aprovado

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { ref } = req.query;

  if (!ref) {
    return res.status(400).json({ error: 'Referência não informada' });
  }

  try {
    // Estratégia 1: verifica no Vercel KV (mais rápido, salvo pelo webhook)
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const kvResponse = await fetch(`${process.env.KV_REST_API_URL}/get/paid:${ref}`, {
        headers: {
          'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      });

      const kvData = await kvResponse.json();

      if (kvData.result === '1') {
        return res.status(200).json({ paid: true, method: 'kv' });
      }
    }

    // Estratégia 2: consulta diretamente na API do Mercado Pago como fallback
    // Busca pagamentos por external_reference
    const searchResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/search?external_reference=${encodeURIComponent(ref)}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const searchData = await searchResponse.json();
    const payments = searchData.results || [];

    const approved = payments.some(p => p.status === 'approved');

    return res.status(200).json({ paid: approved, method: 'api' });

  } catch (error) {
    console.error('Check payment error:', error);
    return res.status(500).json({ paid: false, error: 'Erro ao verificar pagamento' });
  }
}