export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, model = 'gpt-4o-mini', temperature = 0.2, max_tokens = 8000 } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages é obrigatório' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model, messages, temperature, max_tokens }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'Erro na OpenAI' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro na geração:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}