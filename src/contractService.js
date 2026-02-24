// src/contractService.js
import { API_CONFIG, getContractPrompt } from './config/api';

export const generateContract = async (contractType, answers) => {
  if (!API_CONFIG.openaiApiKey) {
    return {
      success: false,
      error: 'Chave da API não configurada. Verifique o arquivo .env'
    };
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
        model: API_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: 'Você é um advogado especialista em contratos brasileiros. Gere contratos profissionais, completos e juridicamente válidos. SEMPRE substitua todas as variáveis pelos valores fornecidos.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro ao gerar contrato');
    }

    const data = await response.json();
    
    // Pós-processamento para garantir que todas as variáveis foram substituídas
    let contract = data.choices[0].message.content;
    
    // Substituir qualquer variável restante
    Object.keys(answers).forEach(key => {
      const placeholderPattern = new RegExp(`{${key}}`, 'gi');
      const placeholderPattern2 = new RegExp(`{${key.replace('_', '')}}`, 'gi');
      contract = contract.replace(placeholderPattern, answers[key] || '[INFORMADO]');
      contract = contract.replace(placeholderPattern2, answers[key] || '[INFORMADO]');
    });
    
    return {
      success: true,
      contract: contract,
    };
  } catch (error) {
    console.error('Erro na geração do contrato:', error);
    return {
      success: false,
      error: error.message || 'Erro ao gerar contrato. Tente novamente.',
    };
  }
};