import { API_CONFIG, getContractPrompt } from './config/api';

/**
 * Gera um contrato utilizando a API da OpenAI e realiza o pós-processamento 
 * para garantir que nenhum placeholder (como {nome} ou xqwxqwx) permaneça no texto.
 */
export const generateContract = async (contractType, answers) => {
  // 1. Validação da Chave (IMPORTANTE: Configure no Vercel ou no seu .env)
  if (!API_CONFIG.openaiApiKey || API_CONFIG.openaiApiKey.includes('sk-proj-')) {
    // Nota: A validação acima assume que se a chave está hardcoded, ela deve ser movida para variáveis de ambiente
    if (!process.env.VITE_OPENAI_API_KEY && !API_CONFIG.openaiApiKey) {
      return {
        success: false,
        error: 'Chave da API não configurada. Verifique as variáveis de ambiente (Vercel/Local).'
      };
    }
  }

  try {
    const prompt = getContractPrompt(contractType, answers);
    
    const response = await fetch(API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model || "gpt-3.5-turbo",
        messages: [
          {
            role: 'system',
            content: `Você é um advogado especialista em direito civil brasileiro. 
            Gere contratos profissionais e juridicamente válidos. 
            USE OS DADOS FORNECIDOS: ${JSON.stringify(answers)}.
            NUNCA use placeholders como 'xqwxqwx' ou '[preencher]'. Se uma informação não foi dada, deixe uma linha sólida (________).`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5, // Menor temperatura = menos "criatividade" e mais precisão nos dados
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro na comunicação com a OpenAI');
    }

    const data = await response.json();
    let contract = data.choices[0].message.content;
    
    // --- PÓS-PROCESSAMENTO ROBUSTO ---
    
    // 1. Substitui variáveis mapeadas (ex: {nome}, [estado], etc)
    Object.entries(answers).forEach(([key, value]) => {
      // Cria regex para pegar variações como {nome}, [nome], {{nome}}
      const placeholderPattern = new RegExp(`[\\{\\[]{1,2}${key}[\\}\\]]{1,2}`, 'gi');
      contract = contract.replace(placeholderPattern, value || '__________');
    });

    // 2. Limpa resíduos comuns que a IA costuma "alucinar" quando esquece campos
    // Isso remove padrões como xqwxqwx, [NOME], {ESTADO} que não foram mapeados
    const genericPlaceholders = [
      /xqwxqwx/gi,
      /\{.*?\}/g, 
      /\[.*?\]/g,
      /_{3,}/g // Mantém linhas longas, mas padroniza
    ];

    genericPlaceholders.forEach(pattern => {
      // Se ainda houver campos não preenchidos, garantimos que fiquem como linhas para preenchimento manual
      if (pattern.source !== "_{3,}") {
         contract = contract.replace(pattern, "__________");
      }
    });
    
    return {
      success: true,
      contract: contract.trim(),
    };

  } catch (error) {
    console.error('Erro crítico na geração:', error);
    return {
      success: false,
      error: `Falha ao gerar documento: ${error.message}`,
    };
  }
};