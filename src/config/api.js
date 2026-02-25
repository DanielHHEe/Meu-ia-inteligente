export const API_CONFIG = {
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo-16k',
};

// ============================================================
// TEMPLATES — espelham exatamente todos os campos coletados
// ============================================================
export const CONTRACT_TEMPLATES = {
  'prestacao-servicos': {
    title: 'Contrato de Prestação de Serviços',
    template: `
      CONTRATANTE: {contratante_nome}
      CPF/CNPJ: {contratante_cpf_cnpj}

      CONTRATADO: {contratado_nome}
      CPF/CNPJ: {contratado_cpf_cnpj}

      OBJETO: {descricao_servico}

      VALOR TOTAL: R$ {valor_total}
      FORMA DE PAGAMENTO: {forma_pagamento}
      PRAZO DE EXECUÇÃO: {prazo_execucao}

      MULTA POR ATRASO (CONTRATADO): {multa_atraso_contratado}% ao dia, limitado a {multa_limite}%
      MULTA POR RESCISÃO: {multa_rescisao}%
      REAJUSTE ANUAL: {reajuste_anual}

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

      VALOR DO ALUGUEL: R$ {valor_aluguel}
      DIA DE VENCIMENTO: {dia_vencimento}
      DATA DE INÍCIO: {data_inicio}
      PRAZO DA LOCAÇÃO: {prazo_locacao} meses

      MULTA POR ATRASO: {multa_atraso}%
      JUROS POR ATRASO: {juros_atraso}% ao mês
      CORREÇÃO MONETÁRIA: {correcao_monetaria}
      PRAZO DE TOLERÂNCIA: {prazo_tolerancia} dias

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

      CONTRIBUIÇÕES DA PARTE A: {contribuicao_a}
      CONTRIBUIÇÕES DA PARTE B: {contribuicao_b}

      PARTICIPAÇÃO NOS RESULTADOS: {participacao_resultados}
      PRAZO DA PARCERIA: {prazo_parceria}

      MULTA POR DESCUMPRIMENTO: {multa_descumprimento}%
      MULTA POR RESCISÃO ANTECIPADA: {multa_rescisao}%

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

      MULTA POR VIOLAÇÃO: R$ {multa_violacao}
      PERDAS E DANOS: {perdas_danos}

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

      VALOR DO PROJETO: R$ {valor_projeto}
      FORMA DE PAGAMENTO: {forma_pagamento}
      PRAZO DE ENTREGA: {prazo_entrega}

      MULTA POR ATRASO NA ENTREGA: {multa_atraso_entrega}% ao dia
      MULTA POR ATRASO NO PAGAMENTO: {multa_atraso_pagamento}% ao dia
      MULTA POR RESCISÃO: {multa_rescisao}%

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

      VALOR DA VENDA: R$ {valor_venda}
      FORMA DE PAGAMENTO: {forma_pagamento}
      PRAZO DE ENTREGA DO BEM: {prazo_entrega_bem}

      MULTA POR ATRASO NO PAGAMENTO: {multa_atraso_pagamento}% ao dia
      MULTA POR DESISTÊNCIA: {multa_desistencia}%

      CIDADE: {cidade}
      ESTADO: {estado}
    `
  }
};

// ============================================================
// CAMPOS OBRIGATÓRIOS POR CONTRATO
// Deve ser idêntico às questions do Chat.jsx
// ============================================================
export const FIELD_ORDER_BY_CONTRACT = {

  // 13 campos
  'prestacao-servicos': [
    'contratante_nome',
    'contratante_cpf_cnpj',
    'contratado_nome',
    'contratado_cpf_cnpj',
    'descricao_servico',
    'valor_total',
    'forma_pagamento',
    'prazo_execucao',
    'multa_atraso_contratado',
    'multa_limite',
    'multa_rescisao',
    'cidade',
    'estado'
  ],

  // 16 campos
  'aluguel': [
    'locador_nome',
    'locador_cpf_cnpj',
    'locatario_nome',
    'locatario_cpf_cnpj',
    'descricao_imovel',
    'endereco_imovel',
    'valor_aluguel',
    'dia_vencimento',
    'data_inicio',
    'prazo_locacao',
    'multa_atraso',
    'juros_atraso',
    'correcao_monetaria',
    'prazo_tolerancia',
    'cidade',
    'estado'
  ],

  // 13 campos
  'parceria': [
    'parte_a_nome',
    'parte_a_cpf_cnpj',
    'parte_b_nome',
    'parte_b_cpf_cnpj',
    'objeto_parceria',
    'contribuicao_a',
    'contribuicao_b',
    'participacao_resultados',
    'prazo_parceria',
    'multa_descumprimento',
    'multa_rescisao',
    'cidade',
    'estado'
  ],

  // 10 campos
  'confidencialidade': [
    'revelador_nome',
    'revelador_cpf_cnpj',
    'receptor_nome',
    'receptor_cpf_cnpj',
    'informacoes_confidenciais',
    'prazo_confidencialidade',
    'multa_violacao',
    'perdas_danos',
    'cidade',
    'estado'
  ],

  // 13 campos
  'trabalho-freelancer': [
    'contratante_nome',
    'contratante_cpf_cnpj',
    'freelancer_nome',
    'freelancer_cpf',
    'escopo_trabalho',
    'valor_projeto',
    'forma_pagamento',
    'prazo_entrega',
    'multa_atraso_entrega',
    'multa_atraso_pagamento',
    'multa_rescisao',
    'cidade',
    'estado'
  ],

  // 12 campos
  'compra-venda': [
    'vendedor_nome',
    'vendedor_cpf_cnpj',
    'comprador_nome',
    'comprador_cpf_cnpj',
    'descricao_bem',
    'valor_venda',
    'forma_pagamento',
    'prazo_entrega_bem',
    'multa_atraso_pagamento',
    'multa_desistencia',
    'cidade',
    'estado'
  ]
};

// ============================================================
// LISTA DE CAMPOS PARA O SYSTEM PROMPT DE COLETA
// ============================================================
const REQUIRED_FIELDS_INSTRUCTION = {
  'prestacao-servicos': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do CONTRATANTE (quem paga pelo serviço)
2. CPF ou CNPJ do CONTRATANTE
3. Nome completo do CONTRATADO (quem presta o serviço)
4. CPF ou CNPJ do CONTRATADO
5. Descrição detalhada do serviço a ser prestado
6. Valor total do serviço (ex: R$ 5.000,00)
7. Forma de pagamento (ex: PIX, boleto, transferência, parcelado)
8. Prazo de execução (ex: 30 dias, 3 meses)
9. Percentual de multa por atraso na entrega pelo CONTRATADO, por dia (ex: 0,5% ao dia)
10. Limite máximo da multa por atraso (ex: 10% do valor total)
11. Percentual de multa por rescisão antecipada (ex: 20% do valor total)
12. Cidade onde o contrato será assinado
13. Estado (UF)`,

  'aluguel': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do LOCADOR (proprietário)
2. CPF ou CNPJ do LOCADOR
3. Nome completo do LOCATÁRIO (inquilino)
4. CPF ou CNPJ do LOCATÁRIO
5. Descrição do imóvel (tipo, características)
6. Endereço completo do imóvel
7. Valor mensal do aluguel
8. Dia do mês para vencimento (ex: dia 10)
9. Data de início da locação
10. Prazo da locação em meses
11. Percentual de multa por atraso no pagamento (ex: 10%)
12. Percentual de juros ao mês por atraso (ex: 1% ao mês)
13. Índice de correção monetária anual (ex: IGPM, IPCA)
14. Prazo de tolerância para pagamento em dias (ex: 5 dias)
15. Cidade onde o contrato será assinado
16. Estado (UF)`,

  'parceria': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo da PARTE A
2. CPF/CNPJ da PARTE A
3. Nome completo da PARTE B
4. CPF/CNPJ da PARTE B
5. Objeto da parceria (o que será feito em conjunto)
6. Contribuição da PARTE A (o que ela entra com)
7. Contribuição da PARTE B (o que ela entra com)
8. Divisão dos resultados (ex: 50%/50%)
9. Prazo da parceria (ex: 12 meses, 2 anos, indeterminado)
10. Percentual de multa por descumprimento das obrigações (ex: 10%)
11. Percentual de multa por rescisão antecipada (ex: 15%)
12. Cidade onde o contrato será assinado
13. Estado (UF)`,

  'confidencialidade': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo da parte REVELADORA
2. CPF/CNPJ da parte REVELADORA
3. Nome completo da parte RECEPTORA
4. CPF/CNPJ da parte RECEPTORA
5. Descrição das informações confidenciais que serão compartilhadas
6. Prazo de confidencialidade (ex: 2 anos, 5 anos)
7. Valor da multa por violação da confidencialidade (ex: R$ 50.000,00)
8. As perdas e danos também serão cobradas além da multa? (sim ou não)
9. Cidade onde o contrato será assinado
10. Estado (UF)`,

  'trabalho-freelancer': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do CONTRATANTE (cliente)
2. CPF/CNPJ do CONTRATANTE
3. Nome completo do FREELANCER
4. CPF do FREELANCER
5. Escopo detalhado do trabalho (o que será entregue)
6. Valor do projeto (ex: R$ 3.000,00)
7. Forma de pagamento (ex: 50% na assinatura e 50% na entrega)
8. Prazo de entrega (ex: 30 dias após assinatura)
9. Percentual de multa por atraso na entrega, por dia (ex: 0,5% ao dia)
10. Percentual de multa por atraso no pagamento pelo contratante, por dia (ex: 0,5% ao dia)
11. Percentual de multa por rescisão antecipada (ex: 20%)
12. Cidade onde o contrato será assinado
13. Estado (UF)`,

  'compra-venda': `
CAMPOS OBRIGATÓRIOS — colete TODOS nesta ordem, um por vez:
1. Nome completo do VENDEDOR
2. CPF/CNPJ do VENDEDOR
3. Nome completo do COMPRADOR
4. CPF/CNPJ do COMPRADOR
5. Descrição detalhada do bem (o que está sendo vendido)
6. Valor total da venda
7. Forma de pagamento
8. Prazo para entrega do bem (ex: na assinatura, 7 dias, 30 dias)
9. Percentual de multa por atraso no pagamento, por dia (ex: 0,5% ao dia)
10. Percentual de multa por desistência/rescisão (ex: 20% do valor)
11. Cidade onde o contrato será assinado
12. Estado (UF)`
};

// ============================================================
// CLÁUSULAS POR CONTRATO
// ============================================================
const CONTRACT_CLAUSES = {
  'prestacao-servicos': [
    'CLÁUSULA 1: DO OBJETO',
    'CLÁUSULA 2: DAS OBRIGAÇÕES DO CONTRATADO',
    'CLÁUSULA 3: DAS OBRIGAÇÕES DO CONTRATANTE',
    'CLÁUSULA 4: DO VALOR E FORMA DE PAGAMENTO',
    'CLÁUSULA 5: DO PRAZO DE EXECUÇÃO',
    'CLÁUSULA 6: DAS PENALIDADES E MULTAS',
    'CLÁUSULA 7: DA RESCISÃO',
    'CLÁUSULA 8: DA PROPRIEDADE INTELECTUAL',
    'CLÁUSULA 9: DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 10: DO FORO'
  ],
  'aluguel': [
    'CLÁUSULA 1: DO OBJETO',
    'CLÁUSULA 2: DAS OBRIGAÇÕES DAS PARTES',
    'CLÁUSULA 3: DO VALOR E FORMA DE PAGAMENTO',
    'CLÁUSULA 4: DO PRAZO E VIGÊNCIA',
    'CLÁUSULA 5: DAS PENALIDADES E MULTAS POR ATRASO',
    'CLÁUSULA 6: DA CORREÇÃO MONETÁRIA',
    'CLÁUSULA 7: DAS RESPONSABILIDADES DO LOCATÁRIO',
    'CLÁUSULA 8: DAS RESPONSABILIDADES DO LOCADOR',
    'CLÁUSULA 9: DA RESCISÃO',
    'CLÁUSULA 10: DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 11: DO FORO'
  ],
  'parceria': [
    'CLÁUSULA 1: DO OBJETO DA PARCERIA',
    'CLÁUSULA 2: DAS CONTRIBUIÇÕES DAS PARTES',
    'CLÁUSULA 3: DA PARTICIPAÇÃO NOS RESULTADOS',
    'CLÁUSULA 4: DAS OBRIGAÇÕES DAS PARTES',
    'CLÁUSULA 5: DO PRAZO',
    'CLÁUSULA 6: DAS PENALIDADES E MULTAS',
    'CLÁUSULA 7: DA CONFIDENCIALIDADE',
    'CLÁUSULA 8: DA RESCISÃO',
    'CLÁUSULA 9: DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 10: DO FORO'
  ],
  'confidencialidade': [
    'CLÁUSULA 1: DO OBJETO',
    'CLÁUSULA 2: DAS INFORMAÇÕES CONFIDENCIAIS',
    'CLÁUSULA 3: DAS OBRIGAÇÕES DA PARTE RECEPTORA',
    'CLÁUSULA 4: DAS EXCEÇÕES À CONFIDENCIALIDADE',
    'CLÁUSULA 5: DO PRAZO',
    'CLÁUSULA 6: DAS PENALIDADES E MULTAS',
    'CLÁUSULA 7: DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 8: DO FORO'
  ],
  'trabalho-freelancer': [
    'CLÁUSULA 1: DO OBJETO',
    'CLÁUSULA 2: DO ESCOPO DO TRABALHO',
    'CLÁUSULA 3: DO VALOR E FORMA DE PAGAMENTO',
    'CLÁUSULA 4: DO PRAZO DE ENTREGA',
    'CLÁUSULA 5: DAS REVISÕES E ALTERAÇÕES',
    'CLÁUSULA 6: DAS PENALIDADES E MULTAS',
    'CLÁUSULA 7: DA PROPRIEDADE INTELECTUAL',
    'CLÁUSULA 8: DA RESCISÃO',
    'CLÁUSULA 9: DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 10: DO FORO'
  ],
  'compra-venda': [
    'CLÁUSULA 1: DO OBJETO',
    'CLÁUSULA 2: DO VALOR E FORMA DE PAGAMENTO',
    'CLÁUSULA 3: DA ENTREGA E TRANSFERÊNCIA DE POSSE',
    'CLÁUSULA 4: DAS GARANTIAS',
    'CLÁUSULA 5: DAS PENALIDADES E MULTAS',
    'CLÁUSULA 6: DA RESCISÃO',
    'CLÁUSULA 7: DAS DISPOSIÇÕES GERAIS',
    'CLÁUSULA 8: DO FORO'
  ]
};

const LEGAL_REF = {
  'prestacao-servicos': 'segundo o Código Civil Brasileiro (arts. 593 a 609)',
  'aluguel': 'segundo a Lei 8.245/91 (Lei do Inquilinato) e o Código Civil',
  'parceria': 'segundo o Código Civil Brasileiro',
  'confidencialidade': 'segundo o Código Civil e a Lei de Propriedade Industrial',
  'trabalho-freelancer': 'segundo a Lei 11.196/05, LC 128/08 e o Código Civil',
  'compra-venda': 'segundo o Código Civil Brasileiro (arts. 481 a 532)'
};

// ============================================================
// SYSTEM PROMPT — coleta de dados
// ============================================================
const SYSTEM_PROMPT = `Você é um assistente jurídico especialista em contratos brasileiros.
Conduza uma entrevista profissional e amigável para coletar TODAS as informações necessárias.

REGRAS ABSOLUTAS — NUNCA VIOLE:
1. Faça APENAS UMA pergunta por vez
2. Siga RIGOROSAMENTE a lista de campos obrigatórios fornecida — não pule NENHUM campo
3. NÃO gere o contrato durante a entrevista
4. NÃO antecipe respostas nem invente valores
5. Somente após coletar TODOS os campos da lista, pergunte: "**Deseja adicionar mais alguma informação ao contrato?**"
6. Aguarde a resposta. Se o usuário disser "não" ou "nada", responda EXATAMENTE: "**Perfeito! Vou gerar seu contrato agora.**"
7. Se o usuário disser que quer adicionar algo, colete essa informação e repita a pergunta do passo 5
8. NUNCA encerre sem ter coletado todos os campos da lista`;

// ============================================================
// PROMPT INICIAL
// ============================================================
export const getInitialPrompt = (contractType) => {
  const prompts = {
    'prestacao-servicos': `Ótimo! Você escolheu **Contrato de Prestação de Serviços**. Vou fazer algumas perguntas para montar seu contrato completo.

**Qual o nome completo do CONTRATANTE (quem vai pagar pelo serviço)?**`,

    'aluguel': `Ótimo! Você escolheu **Contrato de Aluguel**. Vou fazer algumas perguntas para montar seu contrato completo.

**Qual o nome completo do LOCADOR (proprietário do imóvel)?**`,

    'compra-venda': `Ótimo! Você escolheu **Contrato de Compra e Venda**. Vou fazer algumas perguntas para montar seu contrato completo.

**Qual o nome completo do VENDEDOR?**`,

    'parceria': `Ótimo! Você escolheu **Contrato de Parceria**. Vou fazer algumas perguntas para montar seu contrato completo.

**Qual o nome completo da PARTE A?**`,

    'confidencialidade': `Ótimo! Você escolheu **Termo de Confidencialidade (NDA)**. Vou fazer algumas perguntas para montar seu contrato completo.

**Qual o nome completo da parte REVELADORA?**`,

    'trabalho-freelancer': `Ótimo! Você escolheu **Contrato Freelancer**. Vou fazer algumas perguntas para montar seu contrato completo.

**Qual o nome completo do CONTRATANTE (o cliente que vai pagar)?**`
  };

  return prompts[contractType] || `Ótimo! Vamos montar seu contrato.\n\n**Qual o nome completo da parte contratante?**`;
};

// ============================================================
// ENVIO DE MENSAGEM PARA A IA (coleta)
// ============================================================
export const sendMessageToIA = async (messages, contractType) => {
  if (!API_CONFIG.openaiApiKey) {
    throw new Error('Chave da API não configurada. Verifique o arquivo .env');
  }

  const userResponses = messages.filter(m => m.role === 'user').length;
  const totalFields = (FIELD_ORDER_BY_CONTRACT[contractType] || []).length;
  const fieldsInstruction = REQUIRED_FIELDS_INSTRUCTION[contractType] || '';

  // Aviso de progresso — injeta quando perto do fim
  let progressNote = '';
  if (userResponses >= totalFields - 1) {
    progressNote = `\n\n⚠️ ATENÇÃO: Você já recebeu ${userResponses} respostas. O total de campos é ${totalFields}. Verifique se TODOS foram coletados antes de perguntar sobre informações adicionais. NÃO encerre antes de coletar todos.`;
  }

  try {
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
            content: `${SYSTEM_PROMPT}${progressNote}\n\nTipo de contrato: ${contractType}\n${fieldsInstruction}`
          },
          ...messages
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro ao comunicar com a IA');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erro na IA:', error);
    throw error;
  }
};

// ============================================================
// EXTRAÇÃO DE DADOS VIA IA (JSON estruturado)
// Lê o contexto das perguntas + respostas — não depende de posição
// ============================================================
export const extractAnswersFromConversation = async (messages, contractType) => {
  const fieldOrder = FIELD_ORDER_BY_CONTRACT[contractType] || [];

  const conversationText = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => `${m.role === 'assistant' ? 'ASSISTENTE' : 'USUÁRIO'}: ${m.content}`)
    .join('\n\n');

  const extractionPrompt = `Leia a conversa abaixo entre um assistente jurídico e um usuário.
Extraia EXATAMENTE os valores fornecidos pelo usuário para cada campo listado.

CAMPOS ESPERADOS:
${JSON.stringify(fieldOrder, null, 2)}

CONVERSA:
${conversationText}

REGRAS ABSOLUTAS:
1. Retorne SOMENTE um objeto JSON válido — sem texto, sem markdown, sem blocos de código
2. Para cada campo, use o contexto da pergunta do assistente para identificar a qual campo pertence a resposta do usuário
3. Se um campo não foi respondido, use string vazia ""
4. NÃO invente valores — use apenas exatamente o que o usuário disse
5. Os campos "cidade" e "estado" são SOMENTE para eleição de foro — não confunda com endereço do imóvel ou outros campos

Formato de saída esperado (exemplo):
{"campo1":"valor respondido","campo2":"outro valor","campo3":""}`;

  try {
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
            content: 'Você é um extrator de dados preciso. Leia conversas e extraia valores para campos específicos. Retorne APENAS JSON válido, sem nenhum texto adicional, sem markdown.'
          },
          { role: 'user', content: extractionPrompt }
        ],
        temperature: 0,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) throw new Error('Erro na extração de dados');

    const data = await response.json();
    let raw = data.choices[0].message.content.trim();

    // Remove blocos de código markdown se presentes
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    const answers = JSON.parse(raw);
    console.log('[extractAnswers] answers:', answers);
    return answers;

  } catch (err) {
    console.error('[extractAnswers] Falha na extração via IA — fallback por posição:', err);

    // Fallback por posição
    const answers = {};
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
    fieldOrder.forEach((field, index) => {
      if (index < userMessages.length) answers[field] = userMessages[index];
    });
    return answers;
  }
};

// ============================================================
// GERAÇÃO DO CONTRATO FINAL
// ============================================================
export const generateContractFromConversation = async (messages, contractType) => {
  if (!API_CONFIG.openaiApiKey) throw new Error('Chave da API não configurada');

  const answers = await extractAnswersFromConversation(messages, contractType);
  const selectedTemplate = CONTRACT_TEMPLATES[contractType] || CONTRACT_TEMPLATES['prestacao-servicos'];
  const contractTitle = selectedTemplate.title.toUpperCase();
  const legalRef = LEGAL_REF[contractType] || 'segundo o Código Civil Brasileiro';

  // Preenche o template com os valores reais
  let filledTemplate = selectedTemplate.template;
  Object.keys(answers).forEach(key => {
    filledTemplate = filledTemplate.replace(new RegExp(`{${key}}`, 'g'), answers[key] || '');
  });
  filledTemplate = filledTemplate.replace(/{[^}]+}/g, '');

  // Bloco de dados explícito para o prompt
  const dataBlock = Object.entries(answers)
    .filter(([, v]) => v && v.trim() !== '')
    .map(([k, v]) => `• ${k}: ${v}`)
    .join('\n');

  // Cláusulas com valores interpolados
  const clausulasList = (CONTRACT_CLAUSES[contractType] || [])
    .map(c => `   - ${c}`)
    .join('\n');

  const prompt = `Com base nas informações abaixo, gere um ${contractTitle} completo e juridicamente válido ${legalRef}.

═══════════════════════════════════════════════════
DADOS DO CONTRATO (USE EXATAMENTE ESTES VALORES)
═══════════════════════════════════════════════════
${dataBlock}

═══════════════════════════════════════════════════
TEMPLATE DE REFERÊNCIA
═══════════════════════════════════════════════════
${filledTemplate}

═══════════════════════════════════════════════════
INSTRUÇÕES OBRIGATÓRIAS
═══════════════════════════════════════════════════
1. Use SOMENTE os dados fornecidos acima — NUNCA invente valores
2. NÃO use placeholders — substitua TUDO pelos valores reais
3. NUNCA coloque CPF/CNPJ no campo de nome, nem endereço no campo de cidade
4. "cidade" e "estado" são APENAS para a cláusula de foro — não confunda com outros campos
5. As cláusulas de multas e penalidades DEVEM usar os valores de multa informados acima
6. Cada cláusula deve ser detalhada e juridicamente robusta
7. NÃO inclua seção de assinaturas ou testemunhas (ela é adicionada separadamente)

ESTRUTURA OBRIGATÓRIA:
${clausulasList}

GERE O CONTRATO COMPLETO AGORA.`;

  try {
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
            content: 'Você é um advogado especialista em contratos brasileiros. Gere contratos profissionais e juridicamente válidos. NUNCA use placeholders. NUNCA invente dados. NUNCA troque campos (ex: não coloque CPF no lugar de nome, não coloque endereço no lugar de cidade).'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) throw new Error('Erro ao gerar contrato');

    const data = await response.json();
    let contract = data.choices[0].message.content;

    // Remove placeholders residuais
    contract = contract.replace(/\[[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ\s_]+\]/gi, '');
    contract = contract.replace(/\{[^}]+\}/g, '');

    // Substitui variáveis remanescentes
    Object.keys(answers).forEach(key => {
      const value = answers[key] || '';
      [
        new RegExp(`{${key}}`, 'gi'),
        new RegExp(`\\[${key}\\]`, 'gi'),
        new RegExp(`\\[${key.replace(/_/g, ' ')}\\]`, 'gi'),
      ].forEach(p => { contract = contract.replace(p, value); });
    });

    return contract;
  } catch (error) {
    console.error('Erro na geração:', error);
    throw error;
  }
};