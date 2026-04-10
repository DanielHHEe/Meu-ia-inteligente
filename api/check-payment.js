// api/check-payment.js
// Verifica se um pagamento foi aprovado consultando diretamente o Mercado Pago
// Sem dependência de KV/Redis — funciona sempre

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

  if (!process.env.MP_ACCESS_TOKEN) {
    console.error('❌ MP_ACCESS_TOKEN não configurado');
    return res.status(500).json({ paid: false, error: 'MP_ACCESS_TOKEN ausente' });
  }

  try {
    // Consulta pagamentos pelo external_reference no Mercado Pago
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/search?external_reference=${encodeURIComponent(ref)}&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na busca MP:', errorData);
      return res.status(200).json({ paid: false, error: 'Erro ao consultar Mercado Pago' });
    }

    const data = await response.json();
    const payments = data.results || [];

    // Considera pago se qualquer pagamento com essa referência foi aprovado
    const approved = payments.some(p => p.status === 'approved');

    console.log(`Check payment ref=${ref} → ${approved ? '✅ aprovado' : '⏳ pendente'} (${payments.length} pagamento(s) encontrado(s))`);

    return res.status(200).json({ paid: approved });

  } catch (error) {
    console.error('Check payment error:', error);
    return res.status(500).json({ paid: false, error: 'Erro interno ao verificar pagamento' });
  }
}