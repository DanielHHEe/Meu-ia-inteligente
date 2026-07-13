// ============================================================
// api.config.js
// Configuração central da API e função de chamada HTTP
// ============================================================

export const API_CONFIG = {
  model: 'gpt-4o', // ✅ CORRIGIDO: era gpt-4o-mini
};

export const isLocalDev =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const callAI = async (endpoint, body, forceDirect = false) => {
  const useDirect = isLocalDev || forceDirect;
  const url = useDirect ? 'https://api.openai.com/v1/chat/completions' : endpoint;
  const headers = useDirect
    ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` }
    : { 'Content-Type': 'application/json' };

  const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || err.error || 'Erro na API');
  }

  return response.json();
};