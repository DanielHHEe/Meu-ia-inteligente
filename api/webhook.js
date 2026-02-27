// api/webhook.js
// Recebe notificações do Mercado Pago quando um pagamento é confirmado
// Mercado Pago envia um POST aqui assim que o Pix é pago

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Mercado Pago envia GET para validar a URL na primeira configuração
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'webhook ativo' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    // Só processa notificações de pagamento
    if (type !== 'payment') {
      return res.status(200).json({ received: true });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return res.status(200).json({ received: true });
    }

    // Consulta o pagamento na API do Mercado Pago para confirmar status
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    const payment = await response.json();

    console.log(`Webhook recebido — Payment ${paymentId}: ${payment.status}`);

    // Se o pagamento foi aprovado, salva no KV store do Vercel
    if (payment.status === 'approved') {
      const externalReference = payment.external_reference;

      // Usa Vercel KV (Redis) para armazenar pagamentos aprovados
      // Expira em 24h — tempo suficiente para o cliente baixar
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await fetch(`${process.env.KV_REST_API_URL}/set/paid:${externalReference}/1/ex/86400`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
          },
        });

        console.log(`Pagamento aprovado e salvo: ${externalReference}`);
      }
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    // Sempre retorna 200 para o Mercado Pago não retentar infinitamente
    return res.status(200).json({ received: true });
  }
}