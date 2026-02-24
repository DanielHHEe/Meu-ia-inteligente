// API src/config/api.js
export const API_CONFIG = {
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo',
};

export const getContractPrompt = (contractType, answers) => {
  const questionsMap = {
    'prestacao-servicos': {
      title: 'Contrato de Prestação de Serviços',
      template: `
        CONTRATANTE: {contratante_nome}
        CPF/CNPJ: {contratante_cpf_cnpj}
        
        CONTRATADO: {contratado_nome}
        CPF/CNPJ: {contratado_cpf_cnpj}
        
        OBJETO: {descricao_servico}
        
        VALOR: {valor_total}
        FORMA DE PAGAMENTO: {forma_pagamento}
        PRAZO: {prazo_execucao} dias
        
        CIDADE: {cidade}
        ESTADO: {estado}
      `
    },
    'aluguel': {
      title: 'Contrato de Locação de Imóvel',
      template: `
        LOCADOR: {locador_nome}
        CPF/CNPJ: {locador_cpf_cnpj}
        
        LOCATÁRIO: {locatario_nome}
        CPF/CNPJ: {locatario_cpf_cnpj}
        
        IMÓVEL: {descricao_imovel}
        ENDEREÇO: {endereco_imovel}
        
        VALOR DO ALUGUEL: {valor_aluguel}
        PRAZO: {prazo_locacao}
        
        CIDADE: {cidade}
        ESTADO: {estado}
      `
    },
    'parceria': {
      title: 'Contrato de Parceria Comercial',
      template: `
        PARTE A: {parte_a_nome}
        CPF/CNPJ: {parte_a_cpf_cnpj}
        
        PARTE B: {parte_b_nome}
        CPF/CNPJ: {parte_b_cpf_cnpj}
        
        OBJETO DA PARCERIA: {objeto_parceria}
        
        CONTRIBUIÇÕES:
        - Parte A: {contribuicao_a}
        - Parte B: {contribuicao_b}
        
        PARTICIPAÇÃO NOS RESULTADOS: {participacao_resultados}
        
        PRAZO: {prazo_parceria}
        
        CIDADE: {cidade}
        ESTADO: {estado}
      `
    },
    'confidencialidade': {
      title: 'Acordo de Confidencialidade (NDA)',
      template: `
        PARTE REVELADORA: {revelador_nome}
        CPF/CNPJ: {revelador_cpf_cnpj}
        
        PARTE RECEPTORA: {receptor_nome}
        CPF/CNPJ: {receptor_cpf_cnpj}
        
        INFORMAÇÕES CONFIDENCIAIS: {informacoes_confidenciais}
        
        PRAZO DE CONFIDENCIALIDADE: {prazo_confidencialidade}
        
        CIDADE: {cidade}
        ESTADO: {estado}
      `
    },
    'trabalho-freelancer': {
      title: 'Contrato de Trabalho Freelancer',
      template: `
        CONTRATANTE: {contratante_nome}
        CPF/CNPJ: {contratante_cpf_cnpj}
        
        FREELANCER: {freelancer_nome}
        CPF: {freelancer_cpf}
        
        ESCOPO DO TRABALHO: {escopo_trabalho}
        
        VALOR DO PROJETO: {valor_projeto}
        FORMA DE PAGAMENTO: {forma_pagamento}
        PRAZO DE ENTREGA: {prazo_entrega}
        
        CIDADE: {cidade}
        ESTADO: {estado}
      `
    },
    'compra-venda': {
      title: 'Contrato de Compra e Venda',
      template: `
        VENDEDOR: {vendedor_nome}
        CPF/CNPJ: {vendedor_cpf_cnpj}
        
        COMPRADOR: {comprador_nome}
        CPF/CNPJ: {comprador_cpf_cnpj}
        
        BEM: {descricao_bem}
        
        VALOR DA VENDA: {valor_venda}
        FORMA DE PAGAMENTO: {forma_pagamento}
        
        CIDADE: {cidade}
        ESTADO: {estado}
      `
    }
  };

  const selectedTemplate = questionsMap[contractType] || questionsMap['prestacao-servicos'];
  
  let filledTemplate = selectedTemplate.template;
  Object.keys(answers).forEach(key => {
    const placeholder = new RegExp(`{${key}}`, 'g');
    filledTemplate = filledTemplate.replace(placeholder, answers[key] || '[A PREENCHER]');
  });

  return `Você é um advogado especialista em contratos brasileiros. Gere um contrato formal, completo e juridicamente válido seguindo as leis brasileiras.

Tipo de contrato: ${selectedTemplate.title}

Informações fornecidas:
${filledTemplate}

Por favor, gere o contrato completo com:
- Preâmbulo completo com qualificação das partes
- Cláusulas detalhadas (mínimo 10 cláusulas)
- Use a cidade: {cidade} e estado: {estado} fornecidos
- Local e data
- Espaço para assinaturas

Use linguagem técnica e formal. Inclua artigos do Código Civil quando aplicável.

IMPORTANTE: Substitua TODAS as variáveis pelos valores fornecidos. Não deixe {prazo_execucao} sem substituir.`;
};