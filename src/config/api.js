// ============================================================
// api.js  —  Ponto de entrada principal
// ============================================================

export { API_CONFIG, isLocalDev, callAI }                             from './api.config.js';
export { formatAnswers, formatMoneyField, extensoMonetario }           from './formatters.js';
export { CONTRACT_TEMPLATES, FIELD_ORDER_BY_CONTRACT }                 from './contract.templates.js';
export { SYSTEM_PROMPT, REQUIRED_FIELDS_INSTRUCTION, getInitialPrompt } from './contract.prompts.js';
export { CONTRACT_CLAUSES, LEGAL_REF, PARTY_NAME_FIELDS, preprocessContractText } from './contract.clauses.js';

import { API_CONFIG, isLocalDev, callAI } from './api.config.js';
import { formatAnswers, parseValor }       from './formatters.js';
import { CONTRACT_TEMPLATES, FIELD_ORDER_BY_CONTRACT } from './contract.templates.js';
import { SYSTEM_PROMPT, REQUIRED_FIELDS_INSTRUCTION }  from './contract.prompts.js';
import { CONTRACT_CLAUSES, LEGAL_REF, PARTY_NAME_FIELDS, preprocessContractText } from './contract.clauses.js';

// ============================================================
// stripMarkdown
// ============================================================
const stripMarkdown = (text) => text
  .replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')
  .replace(/__(.*?)__/g, '$1').replace(/_(.*?)_/g, '$1')
  .replace(/^#{1,6}\s+/gm, '')
  .replace(/`{1,3}[^`]*`{1,3}/gs, m => m.replace(/`/g, ''));

// ============================================================
// sendMessageToIA — conduz a entrevista
// ============================================================
export const sendMessageToIA = async (messages, contractType) => {
  const userResponses     = messages.filter(m => m.role === 'user').length;
  const totalFields       = (FIELD_ORDER_BY_CONTRACT[contractType] || []).length;
  const fieldsInstruction = REQUIRED_FIELDS_INSTRUCTION[contractType] || '';

  let progressNote = '';
  if (userResponses >= totalFields - 2) {
    progressNote = `\n\n⚠️ ATENÇÃO: Você já coletou ${userResponses} respostas de ${totalFields} campos. Verifique se TODOS foram coletados antes de encerrar.`;
  }

  const data = await callAI('/api/chat', {
    model: API_CONFIG.model,
    messages: [
      { role: 'system', content: `${SYSTEM_PROMPT}${progressNote}\n\nTipo de contrato: ${contractType}\n${fieldsInstruction}` },
      ...messages,
    ],
    temperature: 0.2,
    max_tokens: 500,
  });

  return stripMarkdown(data.choices[0].message.content);
};

// ============================================================
// validateAnswerRelevance — NOVO
//
// Validação contextual/semântica genérica, usada em TODAS as
// perguntas da entrevista (nome, endereço, descrição, matrícula,
// valores, prazos, etc — inclusive as que já têm validação local
// de formato, como CPF/CNPJ/telefone/email, como camada extra).
//
// Por que via IA e não regex: perguntas abertas (ex: "Qual é o
// número de matrícula do imóvel?") não têm um formato fixo que dê
// para validar com padrão — o problema real é semântico (o usuário
// repetiu a própria pergunta, mandou texto aleatório, ou respondeu
// algo sem nenhuma relação com o que foi perguntado). Só um modelo
// de linguagem consegue julgar isso de forma confiável em qualquer
// tipo de campo.
//
// Fail-safe: se a chamada falhar por qualquer motivo técnico
// (rede, parsing, etc.), a resposta é aceita por padrão — nunca
// travamos o usuário por causa de uma instabilidade da API.
// ============================================================
export const validateAnswerRelevance = async (question, answer, conversationContext = '') => {
  const contextBlock = conversationContext
    ? `\n\nCONTEXTO DA CONVERSA (perguntas e respostas anteriores da entrevista — use isso para identificar se a resposta do usuário é uma correção de algo já respondido antes, mesmo que não responda à pergunta atual):\n${conversationContext}\n`
    : '';

  const prompt = `Você é um validador de respostas em uma entrevista para coleta de dados de contrato.
${contextBlock}
PERGUNTA FEITA AO USUÁRIO AGORA:
"${question}"

RESPOSTA DO USUÁRIO:
"${answer}"

Analise se a RESPOSTA é uma interação válida nesse ponto da entrevista. Isso inclui três casos, todos válidos:
1. O usuário respondeu à pergunta feita.
2. O usuário fez uma pergunta de esclarecimento ou demonstrou dúvida sobre o que foi perguntado, em vez de responder (ex: "o que é isso?", "não entendi", "pode dar um exemplo?", "o que significa X?").
3. O usuário está corrigindo uma informação que ele mesmo deu anteriormente na conversa (use o CONTEXTO DA CONVERSA acima para checar isso) — mesmo que a correção não tenha nenhuma relação com a pergunta feita agora.

Considere INVÁLIDA a resposta somente se ela NÃO se encaixar em nenhum dos três casos acima — ou seja, se ela:
- For uma repetição literal ou quase literal da própria pergunta
- For um texto aleatório, sem relação com o que foi perguntado e sem relação com nada do que já foi dito na conversa
- Não fizer sentido nem como resposta à pergunta atual, nem como dúvida sobre ela, nem como correção de algo já respondido antes

Considere VÁLIDA a resposta se ela:
- For uma resposta plausível e coerente com o que foi perguntado, mesmo que resumida, informal, incompleta ou com erros de digitação
- Disser que não sabe, não tem ou não se aplica ("não sei", "não tenho", "não aplicável", "nenhum"), quando isso fizer sentido para o campo perguntado
- Quando a pergunta pedir um PRAZO ou DURAÇÃO, também considere válida uma resposta relativa/qualitativa que define claramente até quando algo vale, mesmo sem um número fixo (ex: "até o fim do contrato", "até o serviço acabar", "enquanto durar o contrato", "durante a vigência do contrato") — isso é uma forma legítima de responder a uma pergunta de prazo, não uma resposta fora do assunto
- Escolher uma das opções apresentadas na própria pergunta (ex: responder apenas "presencial", "remoto", "híbrido", "sim", "não") NÃO é repetição da pergunta — é uma seleção válida entre as opções oferecidas, e continua válida quando complementada com a informação extra pedida na mesma pergunta (ex: "presencial, no endereço X")
- For uma resposta elaborada ou detalhada, que descreve condições, prazos de tolerância/carência, forma de cálculo ou outras explicações junto com a informação central pedida (ex: percentual, valor, sim/não) — desde que a informação central pedida esteja presente em algum lugar da resposta, mesmo cercada de contexto adicional. Uma resposta mais longa e explicativa NÃO é, por si só, motivo de invalidação
- Quando a pergunta for sobre uma MULTA (fixa ou por atraso), também considere válida uma resposta que condiciona a multa a um prazo de tolerância antes de incidir (ex: "com tolerância de 3 dias, depois disso a multa é de 10%") — isso ainda é uma resposta sobre o valor/percentual da multa, não uma resposta fora do assunto
- For uma pergunta de esclarecimento/dúvida sobre o que foi perguntado (caso 2 acima)
- For uma correção de algo dito anteriormente na conversa (caso 3 acima), usando o CONTEXTO DA CONVERSA pra confirmar que aquele dado já apareceu antes

Retorne APENAS um JSON, sem texto adicional, sem markdown, no formato exato:
{"valido": true ou false, "motivo": "breve explicação em português, no máximo 15 palavras"}`;

  try {
    const data = await callAI('/api/chat', {
      model: API_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'Você é um validador rigoroso porém sensato de respostas de um formulário conversacional. Responda SOMENTE com JSON válido, sem nenhum texto fora do JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
      max_tokens: 150,
    });

    let raw = data.choices[0].message.content.trim()
      .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const result = JSON.parse(raw);

    return {
      valido: result.valido !== false,
      motivo: typeof result.motivo === 'string' ? result.motivo : '',
    };
  } catch (err) {
    console.error('[validateAnswerRelevance] Falha na validação semântica — aceitando resposta por segurança:', err);
    return { valido: true, motivo: '' };
  }
};

// ============================================================
// extractAnswersFromConversation
// IA semântica lê a conversa completa e pega o valor MAIS
// RECENTE de cada campo — inclusive quando o usuário corrigiu.
// ============================================================
export const extractAnswersFromConversation = async (messages, contractType) => {
  const fieldOrder = FIELD_ORDER_BY_CONTRACT[contractType] || [];

  const conversationText = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => `${m.role === 'assistant' ? 'ASSISTENTE' : 'USUÁRIO'}: ${m.content}`)
    .join('\n\n');

  const extractionPrompt = `Leia a conversa abaixo e extraia o valor MAIS RECENTE de cada campo.

REGRA CRÍTICA: Se o usuário corrigiu um valor durante a conversa, use SEMPRE o valor corrigido (o mais recente), não o original.

CAMPOS ESPERADOS:
${JSON.stringify(fieldOrder, null, 2)}

CONVERSA:
${conversationText}

REGRAS ABSOLUTAS:
1. Retorne SOMENTE JSON válido — sem texto, sem markdown
2. Para cada campo, use o ÚLTIMO valor mencionado pelo usuário (o mais recente prevalece)
3. Se um campo não foi respondido, use string vazia ""
4. NÃO invente, complete, deduza ou arredonde valores — use EXATAMENTE o que o usuário escreveu, caractere por caractere (isso vale especialmente para e-mail, telefone, CPF/CNPJ, valores monetários, datas e prazos)
5. "modalidade_assinatura": use "presencial" ou "online"
6. Se online: "cidade" e "estado" = "não aplicável"
7. Se presencial: extraia cidade e estado normalmente

Formato: {"campo1":"valor","campo2":"valor"}`;

  try {
    const data = await callAI('/api/chat', {
      model: API_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'Extrator de dados. Sempre use o valor MAIS RECENTE quando houver correções. Nunca invente, complete ou altere nenhum dado — copie exatamente o que o usuário informou. Retorne APENAS JSON válido.',
        },
        { role: 'user', content: extractionPrompt },
      ],
      temperature: 0,
      max_tokens: 2500,
    });

    let raw = data.choices[0].message.content.trim()
      .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    const answers = JSON.parse(raw);

    // Normaliza modalidade/cidade/estado
    const modal = (answers.modalidade_assinatura || '').toLowerCase();
    if (modal.includes('online') || modal.includes('digital')) {
      answers.modalidade_assinatura = 'online';
      answers.cidade = answers.cidade || 'não aplicável';
      answers.estado = answers.estado || 'não aplicável';
    } else if (modal.includes('presencial')) {
      answers.modalidade_assinatura = 'presencial';
    }

    return answers;

  } catch (err) {
    console.error('[extractAnswers] IA falhou, fallback posicional:', err);
    const answers = {};
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content);
    fieldOrder.forEach((field, index) => {
      if (index < userMessages.length) answers[field] = userMessages[index] || '';
    });
    return answers;
  }
};

// ============================================================
// callClauseAPI — gera UMA cláusula via API (sem stream)
// Cada chamada é pequena e focada — sem pressão de tokens.
// ============================================================
const callClauseAPI = async (systemMessages) => {
  if (isLocalDev) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: systemMessages,
        temperature: 0.3,
        max_tokens: 2000, // 2000 por cláusula — suficiente para qualquer cláusula em pt-BR
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(err.error?.message || err.error || 'Erro na API OpenAI');
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';

  } else {
    const res = await fetch('/api/generate-contract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: systemMessages,
        temperature: 0.3,
        max_tokens: 2000, // 2000 por cláusula — suficiente para qualquer cláusula em pt-BR
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(err.error || 'Erro ao gerar cláusula');
    }
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || data.content || data.text || '';
    }
    // SSE stream (caso o servidor retorne stream mesmo sem pedir)
    const reader = res.body.getReader();
    const dec    = new TextDecoder();
    let text = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const line of dec.decode(value, { stream: true }).split('\n')) {
        const t = line.trim();
        if (!t || t === 'data: [DONE]' || !t.startsWith('data: ')) continue;
        try {
          const d = JSON.parse(t.slice(6))?.choices?.[0]?.delta?.content;
          if (d) text += d;
        } catch (_e) {}
      }
    }
    return text;
  }
};

// ============================================================
// generateClause — gera uma única cláusula com retry próprio
// ============================================================
const generateClause = async (clausula, idx, numClausula, dataBlock, contractTitle, legalRef, dataAtual, foroInstrucao, isLastClause, toleranciaSentence, multaDiariaSentence, multaAtrasoLimiteSentence) => {

  const systemPrompt = `Você é um Advogado Sênior especialista em Direito Civil e Empresarial Brasileiro.
Escreva APENAS a cláusula solicitada — nada mais, nada antes, nada depois.

REGRAS ABSOLUTAS SOBRE OS DADOS:
- Use SOMENTE os dados fornecidos em "DADOS DO CONTRATO". Eles são a ÚNICA fonte de verdade.
- NUNCA invente, complete, assuma, deduza, arredonde ou altere qualquer nome, valor, data, prazo, percentual, e-mail, telefone, CPF/CNPJ ou qualquer outra informação que não esteja explicitamente presente em "DADOS DO CONTRATO".
- Se um dado necessário para a cláusula não constar em "DADOS DO CONTRATO", NÃO o invente e NÃO tente adivinhar — escreva a cláusula de forma genérica, sem citar esse dado específico.
- PRAZOS EM DIAS/MESES/ANOS/HORAS SÃO DADOS, NÃO DETALHES DE ESTILO: nunca crie um prazo específico (ex.: "notificação com 30 dias de antecedência", "resposta em até 5 dias úteis", "48 horas para responder") que não esteja em "DADOS DO CONTRATO". Se a cláusula normalmente precisaria de um prazo mas ele não foi informado, escreva de forma genérica ("mediante notificação prévia por escrito", "em prazo razoável", "tão logo possível"), sem inventar um número.
- O MOMENTO DE CUMPRIMENTO DE UMA OBRIGAÇÃO TAMBÉM É DADO, NÃO PRAXE DO CONTRATO: assim como um prazo em dias, o momento em que uma obrigação deve ocorrer (ex.: "no ato da assinatura", "à vista", "antes da entrega", "após a entrega", "em parcela única") é um dado — não um detalhe estilístico que pode ser preenchido com o que é mais comum nesse tipo de contrato. Se os DADOS DO CONTRATO não especificarem QUANDO uma obrigação (como o pagamento) deve ocorrer, NÃO invente esse momento, mesmo que pareça óbvio ou usual — redija a cláusula de forma genérica quanto a esse ponto específico, sem afirmar um momento que não foi informado.
- CONDIÇÕES E PRAZOS DE TOLERÂNCIA/CARÊNCIA VINCULADOS A UM DADO SÃO PARTE DELE, NUNCA OS OMITA: quando um dado em "DADOS DO CONTRATO" vier acompanhado de uma condição, prazo de tolerância/carência ou circunstância que define quando ou como ele se aplica (ex.: "multa de 2% apenas se o atraso passar de 3 dias após a entrega"), essa condição é parte inseparável do dado, tão importante quanto o valor numérico. NUNCA simplifique um dado removendo a condição e mantendo só o número — a cláusula deve reproduzir a condição junto com o valor, exatamente como foi informada pelo usuário.
- NÃO adicione obrigações, condições, direitos de oposição/veto, exigências de aviso prévio, reciprocidade de penalidades ou qualquer regra que não decorra EXPLICITAMENTE do que está em "DADOS DO CONTRATO". Elabore juridicamente apenas sobre o que foi informado — nunca crie uma nova obrigação, condição ou direito que o usuário não mencionou, mesmo que pareça juridicamente razoável ou usual em contratos desse tipo.
- Quando um dado em "DADOS DO CONTRATO" for um texto descritivo (ex.: endereço completo, descrição do serviço, forma de comunicação), reproduza esse texto INTEGRALMENTE na cláusula pertinente, sempre que a cláusula fizer referência a esse dado. NUNCA substitua um dado descritivo fornecido por uma referência vaga como "no endereço especificado" ou "conforme descrito" sem incluir o próprio dado.
- Reproduza e-mails, telefones e CPF/CNPJ EXATAMENTE como aparecem em "DADOS DO CONTRATO", caractere por caractere, sem adicionar, remover ou reposicionar espaços.
- Cálculos matemáticos simples (ex.: aplicar um percentual já informado sobre um valor já informado) são permitidos, mas o resultado deve ser exato e não pode ser apresentado como se fosse um novo dado fornecido pelo usuário.

REGRAS ABSOLUTAS DE REDAÇÃO:
- Verbos SEMPRE conjugados: deverá, poderá, será, estará, terá — NUNCA infinitivo (dever, poder, ser, estar, ter) quando forem o verbo principal da frase.
  Exemplos do que NÃO fazer (encontrados em gerações anteriores e que devem ser evitados):
    ERRADO: "Este foro ser exclusivo" → CERTO: "Este foro será exclusivo"
    ERRADO: "O CONTRATADO ser responsável" → CERTO: "O CONTRATADO será responsável"
    ERRADO: "O CONTRATADO não estar sujeito a multa" → CERTO: "O CONTRATADO não estará sujeito a multa"
    ERRADO: "A subcontratação não eximir o CONTRATADO" → CERTO: "A subcontratação não eximirá o CONTRATADO"
  Antes de finalizar cada frase, identifique o verbo principal e confirme que ele está conjugado (normalmente no futuro do presente: -á, -ão), nunca na forma de infinitivo.
- Palavras SEMPRE completas: CONTRATANTE, CONTRATADO, PAGAMENTO — nunca abrevie
- Nomes de partes com espaço: "pelo CONTRATANTE" — NUNCA "peloCONTRATANTE"
- Use os valores exatamente como estão nos dados — não recalcule nem reformate números, datas ou percentuais
- Mínimo 2 parágrafos (§1º e §2º), cada um com mínimo 3 frases completas
- Cláusulas de penalidade, rescisão e foro: mínimo 3 parágrafos
- Texto puro — zero asteriscos, zero markdown
- Revise mentalmente a frase antes de escrevê-la: sem palavras cortadas, sem palavras grudadas, sem erros de concordância verbal ou nominal, sem pontuação duplicada ou ausente`;

  const isForoClause = /FORO/i.test(clausula);
  const foroExtra    = isForoClause ? `\n\nINSTRUÇÃO DE FORO: ${foroInstrucao}` : '';

  const isObjetoClause = /DO OBJETO/i.test(clausula);
  const objetoExtra = isObjetoClause
    ? '\n\nINSTRUÇÃO DE OBJETO/ESCOPO: Se os DADOS DO CONTRATO contiverem alguma informação sobre o local, endereço ou modalidade de execução do serviço/objeto (ex.: remoto, presencial, endereço específico), inclua essa informação explicitamente e por extenso nesta cláusula, reproduzindo qualquer endereço fornecido exatamente como consta nos dados — nunca substitua um endereço fornecido por uma referência vaga como "no endereço especificado".'
    : '';

  const isInsumosClause = /INSUMOS|MATERIAIS/i.test(clausula);
  const insumosExtra = isInsumosClause
    ? '\n\nINSTRUÇÃO DE INSUMOS/MATERIAIS: Se os DADOS DO CONTRATO indicarem que não há compra de materiais ou insumos envolvida (ex.: resposta "não" ou "nenhum" para essa pergunta, sem detalhamento adicional), escreva esta cláusula de forma neutra e breve, apenas registrando que o serviço/objeto não envolve fornecimento ou compra de materiais ou insumos por nenhuma das partes. NÃO atribua responsabilidade por custos, despesas ou aquisição de materiais a nenhuma das partes além do que foi expressamente informado nos DADOS DO CONTRATO.'
    : '';

  // FIX: reforço direcionado pra cláusulas de multa/penalidade/pagamento —
  // a instrução genérica sobre "não omitir condições" (mais acima no
  // systemPrompt) não se mostrou suficiente na prática: em testes reais,
  // quando dois dados de multa tinham o MESMO valor numérico (ex.: multa
  // fixa de 2% condicionada a um prazo de tolerância, e multa diária
  // também de 2%), a IA os fundiu em uma única frase genérica, descartando
  // tanto a condição de tolerância quanto a distinção entre as duas
  // multas. Esta instrução usa um exemplo concreto e idêntico ao caso real
  // que falhou, para reduzir a chance de repetição do mesmo erro.
  const isMultaClause = /MULTA|PENALIDADE|MORA|PAGAMENTO/i.test(clausula);
  const multaExtra = isMultaClause
    ? `\n\nINSTRUÇÃO DE MULTAS/PENALIDADES: Se os DADOS DO CONTRATO contiverem MAIS DE UM dado sobre multa (ex.: uma multa fixa e uma multa por dia, ou uma multa por atraso e uma multa por rescisão), trate cada uma como uma OBRIGAÇÃO SEPARADA nesta cláusula — nunca funda duas multas diferentes em uma única frase, MESMO QUE o valor numérico das duas seja igual entre si (ex.: multa fixa de 2% e multa diária também de 2% são DUAS coisas diferentes, e ambas devem aparecer, cada uma explicada por completo). Se um dado de multa vier acompanhado de uma condição, prazo de carência/tolerância ou circunstância que define quando ela passa a incidir (ex.: "só incide após 3 dias de atraso contados da entrega"), essa condição é parte do dado e deve aparecer explicitamente no texto, junto com o valor — nunca escreva apenas o valor isolado, descartando a condição.
Exemplo do que fazer quando os DADOS DO CONTRATO tiverem algo como "multa fixa de 2%, aplicável somente após 3 dias de tolerância contados da entrega" E TAMBÉM "multa diária de 2% após esse mesmo prazo de tolerância": a cláusula deve mencionar as DUAS coisas de forma explícita e distinta — por exemplo, "em caso de atraso no pagamento superior a 3 (três) dias, contados da entrega do bem, o COMPRADOR incorrerá em multa fixa de 2% sobre o valor da venda, acrescida de multa diária de 2% sobre o valor da venda por cada dia de atraso adicional" — nunca apenas "incidirá multa de 2%" de forma genérica, sem a condição de prazo e sem diferenciar a multa fixa da multa diária.`
    : '';

  const lastExtra    = isLastClause
    ? '\n\nAPÓS esta cláusula, escreva EXATAMENTE esta linha:\nE, por estarem assim justas e contratadas, as partes firmam o presente instrumento.'
    : '';

  // FIX: em vez de confiar na IA para preservar corretamente uma condição
  // de tolerância/carência dentro do texto livre da multa (o que falhou
  // repetidamente em testes reais — a condição era omitida, ou pior,
  // contradita com frases como "independentemente do número de dias de
  // atraso"), a frase que descreve essa condição é montada de forma
  // determinística em código (ver extractToleranceDays, em
  // generateContractFromConversation) e passada aqui como texto
  // OBRIGATÓRIO e LITERAL — o mesmo mecanismo do "lastExtra" acima, que
  // em nenhum teste até hoje falhou em ser reproduzido exatamente.
  const toleranciaExtra = (isMultaClause && toleranciaSentence)
    ? `\n\nINSTRUÇÃO OBRIGATÓRIA DE PRAZO DE TOLERÂNCIA: Inclua nesta cláusula, literalmente e sem alterar nenhuma palavra, a seguinte frase: "${toleranciaSentence}" — e NÃO escreva, em nenhuma parte desta cláusula, algo que contradiga essa tolerância (ex.: "independentemente do número de dias de atraso", "desde o primeiro dia de atraso", "a partir do atraso" sem menção à tolerância, ou equivalentes).`
    : '';

  // FIX: a instrução solta "multaExtra" (mais acima), pedindo pra IA tratar
  // multa fixa e multa diária como obrigações separadas, se mostrou
  // insuficiente em testes reais — em mais de uma geração, a multa diária
  // foi simplesmente omitida da cláusula, mesmo com o dado correto
  // disponível. Por isso, quando existe uma multa diária nos dados, a
  // frase que a menciona também passa a ser IMPOSTA como texto literal
  // obrigatório — mesmo mecanismo comprovado da tolerância acima — em vez
  // de depender apenas da instrução solta.
  const multaDiariaExtra = (isMultaClause && multaDiariaSentence)
    ? `\n\nINSTRUÇÃO OBRIGATÓRIA DE MULTA DIÁRIA: Inclua nesta cláusula, literalmente e sem alterar nenhuma palavra, a seguinte frase: "${multaDiariaSentence}"`
    : '';

  // FIX: mesma proteção acima (multaDiariaExtra), adaptada para a pergunta
  // COMPOSTA de multa por atraso (taxa diária + limite máximo numa
  // pergunta só), usada em prestação de serviços e empreitada. Aplicada
  // por precaução, mesmo sem um caso real de falha registrado para essa
  // estrutura específica — segue o mesmo raciocínio das duas anteriores.
  const multaAtrasoLimiteExtra = (isMultaClause && multaAtrasoLimiteSentence)
    ? `\n\nINSTRUÇÃO OBRIGATÓRIA DE MULTA POR ATRASO COM LIMITE: Inclua nesta cláusula, literalmente e sem alterar nenhuma palavra, a seguinte frase: "${multaAtrasoLimiteSentence}"`
    : '';

  const userPrompt = `Contrato: ${contractTitle} — ${legalRef}
Data: ${dataAtual}

DADOS DO CONTRATO (fonte única e exclusiva de verdade — não use nenhum dado fora desta lista):
${dataBlock}

Redija a seguinte cláusula com profundidade jurídica completa:
${clausula}

Formato obrigatório:
${clausula}

§1º [mínimo 3 frases com verbos conjugados]

§2º [mínimo 3 frases com verbos conjugados]
${foroExtra}${objetoExtra}${insumosExtra}${multaExtra}${toleranciaExtra}${multaDiariaExtra}${multaAtrasoLimiteExtra}${lastExtra}`;


  // Tenta até 2 vezes por cláusula
  for (let attempt = 1; attempt <= 2; attempt++) {
    const text = await callClauseAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt   },
    ]);

    if (!text || text.trim().length < 100) {
      console.warn(`[Cláusula ${numClausula}] Tentativa ${attempt}: resposta muito curta, retentando...`);
      if (attempt === 2) throw new Error(`Cláusula ${numClausula} não foi gerada corretamente.`);
      continue;
    }

    // Verifica se a cláusula tem pelo menos um §
    if (!/§\d/i.test(text)) {
      console.warn(`[Cláusula ${numClausula}] Tentativa ${attempt}: sem parágrafos §, retentando...`);
      if (attempt === 2) return text; // entrega o que tiver
      continue;
    }

    return text.trim();
  }

  return '';
};

// ============================================================
// Helpers de validação de integridade dos dados
// ============================================================

// Extrai todos os e-mails presentes em um texto
const extractEmails = (text) =>
  (text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []);

// Extrai todos os valores monetários "R$ x.xxx,xx" de um texto, já
// normalizados para número (ex.: "R$ 5.000,00" → 5000)
const extractMoneyValues = (text) => {
  const matches = text.match(/R\$\s*[\d.,]+/g) || [];
  return matches
    .map(m => parseFloat(m.replace(/R\$\s*/, '').replace(/\./g, '').replace(',', '.')))
    .filter(n => !isNaN(n));
};

// Extrai todos os percentuais "10%" / "10,5%" de um texto
const extractPercentages = (text) => {
  const matches = text.match(/\d+(?:[.,]\d+)?\s*%/g) || [];
  return matches.map(m => parseFloat(m.replace(',', '.').replace('%', '').trim()));
};

// Extrai prazos ("10 dias", "3 meses", "48 horas", "2 anos", "5 dias úteis")
// de um texto, normalizando a unidade para permitir comparação exata.
//
// FIX: a regex original só reconhecia o número ANTES de um parênteses
// explicativo (ex.: "5 (cinco) dias"). Quando o usuário escreve o número
// DENTRO dos parênteses, antes da unidade (ex.: "(15) dias" — como em
// "será de (15) dias"), a versão antiga não capturava o prazo, fazendo
// o sistema "esquecer" que aquele prazo já tinha sido informado. Os
// trechos `\(?\s*` e `\s*\)?` abaixo cobrem esse formato adicional sem
// alterar o comportamento para o formato já suportado.
//
// FIX 2: em vez de listar manualmente cada palavra com e sem acento
// (ex.: "úteis"/"uteis", "mês"/"mes"), o texto é normalizado removendo
// TODOS os acentos via Unicode (NFD + remoção de diacríticos) antes de
// comparar. Isso corrige de uma vez só qualquer variação de acentuação
// em qualquer palavra — não só as que já tínhamos previsto — porque a
// resposta do usuário e o texto do contrato passam pelo mesmo processo
// de normalização antes de serem comparados.
const stripAccents = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const extractDeadlines = (text) => {
  const normalized = stripAccents(text.toLowerCase());
  const regex = /\(?\s*(\d+)\s*\)?(?:\s*\([^)]*\)\s*)?\s*(dias?\s*uteis|dias?|meses|mes|anos?|horas?)/gi;
  const results = [];
  let match;
  while ((match = regex.exec(normalized)) !== null) {
    const num = parseInt(match[1], 10);
    let unit  = match[2].replace(/\s+/g, ' ').trim();
    if (/uteis/.test(unit))          unit = 'dias uteis';
    else if (/^dia/.test(unit))      unit = 'dias';
    else if (/^mes/.test(unit))      unit = 'meses';
    else if (/^ano/.test(unit))      unit = 'anos';
    else if (/^hora/.test(unit))     unit = 'horas';
    results.push({ num, unit });
  }
  return results;
};

// ============================================================
// extractToleranceDays — detecta um prazo de tolerância/carência
// mencionado numa resposta livre do usuário (ex.: "3 dias de
// tolerância", "carência de 5 dias"), retornando o número de dias
// encontrado, ou null se não houver nenhum.
//
// Por quê: em testes reais, quando essa condição ficava embutida no meio
// de uma resposta longa sobre multa, a IA que redige a cláusula ora a
// omitia, ora chegava a contradizê-la (ex.: escrevendo "independentemente
// do número de dias de atraso"), mesmo com instruções reforçadas no
// prompt pedindo para preservá-la. Por isso, o prazo de tolerância passa
// a ser extraído aqui de forma determinística, e a frase que o descreve
// é montada em código (ver generateContractFromConversation) e imposta
// como texto literal obrigatório na cláusula de multas — nunca mais
// dependendo da IA "lembrar" de reproduzi-la corretamente.
// ============================================================
const extractToleranceDays = (text) => {
  if (!text || typeof text !== 'string') return null;
  const normalized = stripAccents(text.toLowerCase());
  let match = normalized.match(/(\d+)\s*dias?\s*(de\s*)?(tolerancia|carencia)/);
  if (match) return parseInt(match[1], 10);
  match = normalized.match(/(tolerancia|carencia)\s*(de\s*)?(\d+)\s*dias?/);
  if (match) return parseInt(match[3], 10);
  return null;
};

// ============================================================
// extractMultaFixaRawAnswers — captura, DIRETO da conversa (sem IA), a
// resposta literal do usuário a cada pergunta de "multa fixa" (todas as
// 5 perguntas desse tipo, em qualquer um dos 5 tipos de contrato que as
// têm, usam essa mesma frase-chave).
//
// Por quê: extractToleranceDays só encontra o prazo de tolerância se a
// palavra estiver presente no valor armazenado do campo. Esse valor vem
// de extractAnswersFromConversation, que é ELE MESMO uma chamada de IA —
// e em um teste real, essa extração devolveu a resposta sem a condição
// de tolerância, mesmo com instrução explícita para copiá-la literalmente.
// Como a pergunta de multa fixa é sempre identificável por texto fixo,
// não há necessidade de uma IA para achar a resposta a ela: a resposta é
// sempre a mensagem do usuário logo em seguida na conversa. Isso garante
// que extractToleranceDays sempre receba o texto exato digitado pelo
// usuário, independentemente de qualquer resumo ou paráfrase que a
// extração por IA possa ter feito.
// ============================================================
const extractMultaFixaRawAnswers = (conversationMessages) => {
  const results = [];
  for (let i = 0; i < conversationMessages.length - 1; i++) {
    const msg = conversationMessages[i];
    if (
      msg && msg.role === 'assistant' && typeof msg.content === 'string' &&
      msg.content.toLowerCase().includes('multa fixa')
    ) {
      const next = conversationMessages[i + 1];
      if (next && next.role === 'user' && typeof next.content === 'string') {
        results.push({ question: msg.content, answer: next.content });
      }
    }
  }
  return results;
};

// ============================================================
// extractMultaDiariaRawAnswers — mesmo mecanismo acima, mas para as
// perguntas de multa "por dia"/"ao dia" (sem limite/máximo — essas já
// têm sua própria pergunta composta e não sofrem deste problema). Mesma
// justificativa: garantir que o dado usado na cláusula seja o texto
// exato digitado pelo usuário, sem depender da extração por IA.
// ============================================================
const isMultaDiariaQuestion = (text) => {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return lower.includes('multa') && lower.includes('atraso') &&
    /por dia|ao dia/.test(lower) &&
    !/limite|m[áa]ximo/.test(lower);
};

const extractMultaDiariaRawAnswers = (conversationMessages) => {
  const results = [];
  for (let i = 0; i < conversationMessages.length - 1; i++) {
    const msg = conversationMessages[i];
    if (msg && msg.role === 'assistant' && isMultaDiariaQuestion(msg.content)) {
      const next = conversationMessages[i + 1];
      if (next && next.role === 'user' && typeof next.content === 'string') {
        results.push({ question: msg.content, answer: next.content });
      }
    }
  }
  return results;
};

// ============================================================
// extractMultaAtrasoLimiteRawAnswers — mesmo mecanismo acima, mas para a
// pergunta COMPOSTA de multa por atraso (taxa diária + limite máximo numa
// pergunta só), usada em prestação de serviços e empreitada. Mesma
// justificativa das duas funções anteriores.
// ============================================================
const isMultaAtrasoLimiteQuestion = (text) => {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return lower.includes('multa') && lower.includes('atraso') && /limite|m[áa]ximo/.test(lower);
};

const extractMultaAtrasoLimiteRawAnswers = (conversationMessages) => {
  const results = [];
  for (let i = 0; i < conversationMessages.length - 1; i++) {
    const msg = conversationMessages[i];
    if (msg && msg.role === 'assistant' && isMultaAtrasoLimiteQuestion(msg.content)) {
      const next = conversationMessages[i + 1];
      if (next && next.role === 'user' && typeof next.content === 'string') {
        results.push({ question: msg.content, answer: next.content });
      }
    }
  }
  return results;
};

// ============================================================
// fixBareFiniteVerbs — corrige automaticamente "ser"/"estar" usados
// no infinitivo como verbo principal da frase (erro recorrente do
// modelo), convertendo para a conjugação correta.
//
// Por que apenas "ser" e "estar": são os dois verbos onde o erro
// aparece de forma sistemática e previsível neste tipo de contrato,
// e a conjugação correta é sempre a mesma (será / está). Para outros
// verbos (eximir, ensejar, gerar etc.) a conjugação certa depende
// do tempo verbal pretendido, então uma correção automática às
// cegas arriscaria trocar um erro por outro — por isso esses casos
// apenas geram um aviso (ver validateContract) para revisão manual.
//
// A correção só é aplicada quando a palavra NÃO é antecedida por um
// verbo/partícula que legitimamente introduz um infinitivo (ex.:
// "deverá ser", "poderá estar", "a ser", "de ser"), para não quebrar
// construções corretas.
// ============================================================
const FINITE_VERB_FIX = { ser: 'será', estar: 'está' };
const EXCLUDE_BEFORE_INFINITIVE = new Set([
  'a', 'de', 'para', 'por', 'sem', 'vir', 'ir',
  'dever', 'deve', 'deverá', 'deverão', 'deveria', 'deveriam',
  'poder', 'pode', 'poderá', 'poderão', 'poderia', 'poderiam',
  'devendo', 'podendo', 'possa', 'possam', 'venha', 'venham',
]);

const fixBareFiniteVerbs = (text) => {
  const tokens = text.split(/(\s+)/); // preserva os espaços originais
  for (let i = 0; i < tokens.length; i++) {
    const raw = tokens[i];
    const cleaned = raw.replace(/^[.,;:!?()"'“”]+|[.,;:!?()"'“”]+$/g, '');
    const lower = cleaned.toLowerCase();
    if (lower !== 'ser' && lower !== 'estar') continue;

    // Encontra a palavra anterior não-espaço
    let j = i - 1;
    while (j >= 0 && /^\s+$/.test(tokens[j])) j--;
    const prevClean = j >= 0
      ? tokens[j].replace(/^[.,;:!?()"'“”]+|[.,;:!?()"'“”]+$/g, '').toLowerCase()
      : '';
    if (EXCLUDE_BEFORE_INFINITIVE.has(prevClean)) continue;

    const conjugated = FINITE_VERB_FIX[lower];
    const finalWord = cleaned[0] === cleaned[0].toUpperCase()
      ? conjugated.charAt(0).toUpperCase() + conjugated.slice(1)
      : conjugated;

    const leadingPunct  = (raw.match(/^[.,;:!?()"'“”]+/) || [''])[0];
    const trailingPunct = (raw.match(/[.,;:!?()"'“”]+$/) || [''])[0];
    tokens[i] = leadingPunct + finalWord + trailingPunct;
  }
  return tokens.join('');
};

// ============================================================
// validateContract — valida o contrato montado
//
// Retorna dois tipos de problema:
// - errors: avisos de qualidade (não bloqueiam a entrega)
// - criticalErrors: inconsistências de DADOS (e-mail, valores
//   monetários inventados/alterados) — BLOQUEIAM a entrega,
//   pois representam exatamente o tipo de erro que este contrato
//   nunca pode conter: informação fictícia ou modificada.
// ============================================================
const validateContract = (contractText, answers, contractType, conversationMessages = []) => {
  const errors = [];
  const criticalErrors = [];

  // ── 1. Presença de todas as cláusulas esperadas ─────────────
  const expectedClauses = CONTRACT_CLAUSES[contractType] || [];
  expectedClauses.forEach((_, idx) => {
    const num   = idx + 1;
    const regex = new RegExp(`CL[ÁA]USULA\\s+${num}[ªa°]`, 'i');
    if (!regex.test(contractText)) {
      errors.push(`Cláusula ${num} ausente`);
    }
  });

  // ── 2. Encerramento adequado ─────────────────────────────────
  const lastChars = contractText.trim().slice(-300);
  if (!/firmam o presente instrumento/i.test(lastChars) &&
      !/assim justas e contratadas/i.test(lastChars)) {
    errors.push('Sem encerramento adequado');
  }

  // ── 3. Tamanho mínimo ─────────────────────────────────────────
  const minChars = expectedClauses.length * 150;
  if (contractText.length < minChars) {
    errors.push(`Contrato muito curto (${contractText.length} chars)`);
  }

  // ── 4. CRÍTICO — Integridade de e-mails ──────────────────────
  // Nenhum e-mail no contrato final pode ser diferente dos e-mails
  // informados pelo usuário durante a entrevista.
  const providedEmails = new Set(
    Object.entries(answers)
      .filter(([k, v]) => k.toLowerCase().includes('email') && typeof v === 'string' && v.trim() !== '')
      .map(([, v]) => v.trim().toLowerCase())
  );
  const foundEmails = extractEmails(contractText).map(e => e.trim().toLowerCase());
  const invalidEmails = [...new Set(foundEmails.filter(e => !providedEmails.has(e)))];
  invalidEmails.forEach(email => {
    criticalErrors.push(`E-mail "${email}" encontrado no contrato não corresponde a nenhum e-mail informado pelo usuário — possível dado corrompido ou inventado.`);
  });

  // ── 5. CRÍTICO — Integridade de valores monetários ───────────
  // Todo valor "R$ X" no contrato deve corresponder exatamente a um
  // valor informado pelo usuário, ou a um percentual informado
  // aplicado sobre um valor informado (ex.: cálculo de multa).
  const providedMoneyValuesFromText = Object.values(answers)
    .filter(v => typeof v === 'string' && /R\$\s*[\d.,]+/.test(v))
    .flatMap(v => extractMoneyValues(v));

  // FIX: alguns campos monetários (que existem em VÁRIOS tipos de
  // contrato, não só aluguel) podem ter sido respondidos pelo usuário
  // sem o prefixo "R$" (ex.: usuário digita apenas "500" para o campo
  // de arras/sinal). Sem o "R$" literal, a extração acima não reconhece
  // esse valor como "informado" — e quando a cláusula o escreve
  // corretamente formatado como "R$ 500,00", o validador acusava
  // (erroneamente) invenção de dado. Para os campos abaixo — que são
  // tipicamente monetários em algum tipo de contrato — também tentamos
  // extrair o número diretamente, com ou sem "R$". Campos que não
  // contiverem um número (ex.: uma resposta descritiva) são
  // simplesmente ignorados aqui (parseValor retorna NaN e é filtrado).
  const MONETARY_HINT_FIELDS = [
    'valor_total', 'valor_aluguel', 'valor_projeto', 'valor_venda',
    'capital_social', 'aporte_inicial', 'multa_violacao',
    'arras', 'pro_labore', 'multa_dano', 'meta_minima',
    'contribuicao_a', 'contribuicao_b', 'despesas_transferencia', 'indenizacao_rescisao',
  ];
  const providedMoneyValuesFromFields = MONETARY_HINT_FIELDS
    .map(f => answers[f])
    .filter(v => typeof v === 'string' && v.trim() !== '')
    .map(v => parseValor(v))
    .filter(n => Number.isFinite(n) && n > 0);

  const providedMoneyValues = [...providedMoneyValuesFromText, ...providedMoneyValuesFromFields];

  const providedPercentagesFromText = Object.values(answers)
    .filter(v => typeof v === 'string' && /%/.test(v))
    .flatMap(v => extractPercentages(v));

  // FIX: mesmo raciocínio acima, mas para campos percentuais (ex.:
  // usuário responde "10" em vez de "10%" para a multa por atraso).
  // Presente em prestação de serviços, aluguel, parceria, freelancer,
  // compra e venda, empreitada, representação comercial e comodato.
  const PERCENTAGE_HINT_FIELDS = [
    'multa_atraso', 'multa_atraso_contratado', 'multa_atraso_entrega', 'multa_atraso_pagamento',
    'multa_atraso_devolucao', 'multa_limite', 'multa_rescisao', 'multa_descumprimento',
    'multa_desistencia', 'juros_atraso', 'percentual_comissao',
    'multa_atraso_fixa', 'multa_atraso_fixa_contratado', 'multa_atraso_fixa_entrega',
    'multa_atraso_fixa_pagamento', 'multa_atraso_fixa_devolucao',
  ];
  const providedPercentagesFromFields = PERCENTAGE_HINT_FIELDS
    .map(f => answers[f])
    .filter(v => typeof v === 'string' && v.trim() !== '' && !/%/.test(v))
    .map(v => parseValor(v))
    .filter(n => Number.isFinite(n) && n > 0);

  const providedPercentages = [...providedPercentagesFromText, ...providedPercentagesFromFields];

  const TOLERANCE = 0.02; // tolerância de arredondamento (centavos)
  // FIX: além de bater exatamente com um valor informado ou com um percentual
  // aplicado sobre um valor informado, agora também reconhece MÚLTIPLOS
  // INTEIROS simples de um valor informado (ex.: caução de "3 meses de
  // aluguel" = valor do aluguel × 3). Esse tipo de cálculo é comum em
  // cláusulas de garantia/caução e é uma conta legítima a partir do dado
  // fornecido — não uma invenção. O limite de 12x cobre os múltiplos usuais
  // (mensal a anual) sem abrir espaço para valores realmente arbitrários.
  const MAX_KNOWN_MULTIPLIER = 12;
  const isKnownAmount = (amount) => {
    if (providedMoneyValues.some(v => Math.abs(v - amount) <= TOLERANCE)) return true;
    const isKnownPercentage = providedMoneyValues.some(base =>
      providedPercentages.some(pct => Math.abs((base * pct / 100) - amount) <= TOLERANCE)
    );
    if (isKnownPercentage) return true;
    return providedMoneyValues.some(base => {
      if (base <= 0) return false;
      for (let n = 1; n <= MAX_KNOWN_MULTIPLIER; n++) {
        if (Math.abs(base * n - amount) <= TOLERANCE) return true;
      }
      return false;
    });
  };

  if (providedMoneyValues.length > 0) {
    const foundAmounts = extractMoneyValues(contractText);
    const invalidAmounts = [...new Set(foundAmounts.filter(a => !isKnownAmount(a)))];
    invalidAmounts.forEach(amount => {
      criticalErrors.push(`Valor "R$ ${amount.toFixed(2)}" encontrado no contrato não corresponde a nenhum valor informado pelo usuário nem é calculável a partir dos dados fornecidos.`);
    });
  }

  // ── 5b. CRÍTICO — Integridade de prazos (dias/meses/anos/horas) ──
  // Qualquer prazo numérico mencionado no contrato (ex.: "10 dias",
  // "30 dias", "48 horas") deve corresponder exatamente a um prazo que
  // o usuário informou em algum momento da entrevista. Prazos que a IA
  // "preenche" por conta própria para soar mais completo (prazo de
  // notificação de rescisão, prazo de resposta a vícios, prazo de
  // aviso prévio etc.) são exatamente o tipo de dado fictício que não
  // pode aparecer no contrato final.
  const providedDeadlines = Object.values(answers)
    .filter(v => typeof v === 'string')
    .flatMap(v => extractDeadlines(v));

  // FIX: cláusulas padrão do próprio template (ex.: "DO REAJUSTE ANUAL", que
  // existe em todo contrato de aluguel independentemente do que o usuário
  // respondeu) fazem a IA traduzir palavras de periodicidade — "anual",
  // "semestral", "mensal" etc. — em um número de meses/dias. Isso é uma
  // tradução linguística padrão e inequívoca, não uma invenção de dado
  // (assim como "3 meses de aluguel" acima). Por isso, se a palavra de
  // periodicidade correspondente aparecer em algum lugar das respostas do
  // usuário OU da conversa completa, o prazo derivado dela é considerado
  // legítimo, mesmo que o número em si não tenha sido digitado literalmente.
  const PERIODICITY_TO_DEADLINE = [
    { words: ['anual', 'anualmente'], num: 12, unit: 'meses' },
    { words: ['semestral', 'semestralmente'], num: 6, unit: 'meses' },
    { words: ['trimestral', 'trimestralmente'], num: 3, unit: 'meses' },
    { words: ['bimestral', 'bimestralmente'], num: 2, unit: 'meses' },
    { words: ['mensal', 'mensalmente'], num: 1, unit: 'meses' },
    { words: ['quinzenal', 'quinzenalmente'], num: 15, unit: 'dias' },
    { words: ['semanal', 'semanalmente'], num: 7, unit: 'dias' },
  ];
  const answersText = Object.values(answers)
    .filter(v => typeof v === 'string')
    .join(' ')
    .toLowerCase();
  const conversationText = (conversationMessages || [])
    .filter(m => m && typeof m.content === 'string')
    .map(m => m.content)
    .join(' ')
    .toLowerCase();
  const allKnownText = `${answersText} ${conversationText}`;

  const isKnownDeadline = (num, unit) => {
    if (providedDeadlines.some(d => d.num === num && d.unit === unit)) return true;
    return PERIODICITY_TO_DEADLINE.some(({ words, num: n, unit: u }) =>
      n === num && u === unit && words.some(w => allKnownText.includes(w))
    );
  };

  if (providedDeadlines.length > 0) {
    const foundDeadlines = extractDeadlines(contractText);
    const seen = new Set();
    foundDeadlines.forEach(({ num, unit }) => {
      const key = `${num}|${unit}`;
      if (seen.has(key)) return;
      seen.add(key);
      if (!isKnownDeadline(num, unit)) {
        criticalErrors.push(`Prazo "${num} ${unit}" encontrado no contrato não corresponde a nenhum prazo informado pelo usuário — possível prazo inventado pela IA.`);
      }
    });
  }

  // ── 6. Aviso — possível verbo em infinitivo não conjugado ────
  // "ser" e "estar" já são corrigidos automaticamente (fixBareFiniteVerbs),
  // então, se aparecerem aqui, é porque escaparam da correção — o que
  // ainda assim vale registrar. Para os demais verbos (eximir, ensejar,
  // gerar etc.) não há correção automática segura, então apenas avisamos.
  const SUSPECT_INFINITIVES = /\b(dever|poder|ser|estar|ter|eximir|ensejar|gerar)\b/gi;
  const foundInfinitives = [...new Set((contractText.match(SUSPECT_INFINITIVES) || []).map(w => w.toLowerCase()))];
  if (foundInfinitives.length > 0) {
    errors.push(`Possíveis verbos não conjugados (infinitivo) encontrados: ${foundInfinitives.join(', ')} — revisar conjugação.`);
  }

  // ── 7. Aviso — possível palavra colada (minúscula+maiúscula sem espaço) ──
  const textoSemTermos = contractText.replace(/CONTRATANTE|CONTRATADO|CLÁUSULA|LGPD|PIX|CPF|CNPJ/g, '');
  if (/[a-záéíóúâêîôûãõç]{2,}[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ]{2,}/.test(textoSemTermos)) {
    errors.push('Possível palavra colada (letra minúscula seguida de maiúscula sem espaço) — revisar formatação.');
  }

  // ── 8. Aviso — espaços duplos ─────────────────────────────────
  if (/[^\S\n]{2,}/.test(contractText)) {
    errors.push('Espaços duplos encontrados no texto — revisar formatação.');
  }

  return { errors, criticalErrors };
};

// ============================================================
// generateContractFromConversation
//
// NOVA ARQUITETURA: Geração cláusula por cláusula
//
// Por que resolve as palavras cortadas/embaralhadas:
// - Cada chamada tem contexto pequeno (~500 tokens de input)
// - A IA foca em 1 cláusula — sem "cansaço" do contexto longo
// - Se uma cláusula falhar, só ela é regenerada, não o contrato todo
// - Progresso visível: callback onProgress(atual, total, nomeCláusula)
//
// VALIDAÇÃO OBRIGATÓRIA ANTES DA ENTREGA:
// Ao final, o contrato passa por validateContract(). Se qualquer
// inconsistência CRÍTICA de dados for encontrada (e-mail ou valor
// monetário que não corresponde ao que o usuário informou), a
// função lança um erro e o contrato NÃO é entregue ao usuário.
// ============================================================
export const generateContractFromConversation = async (messages, contractType, onProgress) => {

  // 1. Extrai respostas (IA semântica — pega correções do usuário)
  if (onProgress) onProgress(0, 100, 'Extraindo dados da conversa...');
  const rawAnswers = await extractAnswersFromConversation(messages, contractType);
  const answers    = formatAnswers(rawAnswers);

  // FIX: sobrescreve os campos multa_atraso_fixa* com a resposta capturada
  // DIRETO da conversa (ver extractMultaFixaRawAnswers acima), em vez de
  // confiar no que a extração por IA (extractAnswersFromConversation)
  // guardou para eles. Isso garante que a condição de tolerância, quando
  // mencionada pelo usuário, nunca se perca entre a conversa e o dado
  // usado para montar a cláusula — mesmo que a extração por IA tenha
  // resumido ou reformulado a resposta original.
  const multaFixaRaw    = extractMultaFixaRawAnswers(messages);
  const multaFixaFields = (FIELD_ORDER_BY_CONTRACT[contractType] || []).filter(f => /^multa_atraso_fixa/.test(f));
  multaFixaRaw.forEach(({ question, answer }) => {
    if (multaFixaFields.length === 1) {
      answers[multaFixaFields[0]] = answer;
    } else if (multaFixaFields.length > 1) {
      const qLower = question.toLowerCase();
      const matchedField =
        multaFixaFields.find(f => qLower.includes('entrega') && f.includes('entrega')) ||
        multaFixaFields.find(f => qLower.includes('pagamento') && f.includes('pagamento')) ||
        multaFixaFields.find(f => qLower.includes('devolu') && f.includes('devolu'));
      if (matchedField) answers[matchedField] = answer;
    }
  });

  const multaDiariaRaw    = extractMultaDiariaRawAnswers(messages);
  const multaDiariaFields = (FIELD_ORDER_BY_CONTRACT[contractType] || []).filter(f => /^multa_atraso_(entrega|pagamento|devolucao)$/.test(f));
  multaDiariaRaw.forEach(({ question, answer }) => {
    if (multaDiariaFields.length === 1) {
      answers[multaDiariaFields[0]] = answer;
    } else if (multaDiariaFields.length > 1) {
      const qLower = question.toLowerCase();
      const matchedField =
        multaDiariaFields.find(f => qLower.includes('entrega') && f.includes('entrega')) ||
        multaDiariaFields.find(f => qLower.includes('pagamento') && f.includes('pagamento')) ||
        multaDiariaFields.find(f => qLower.includes('devolu') && f.includes('devolu'));
      if (matchedField) answers[matchedField] = answer;
    }
  });

  // FIX: mesma sobrescrita determinística acima, agora para a resposta da
  // pergunta COMPOSTA de multa por atraso (taxa diária + limite máximo
  // numa pergunta só), usada em prestação de serviços ('multa_atraso_contratado')
  // e empreitada ('multa_atraso'). A resposta bruta é guardada num campo
  // interno auxiliar (não faz parte do template) só para alimentar a frase
  // determinística montada mais abaixo — os campos multa_atraso_contratado/
  // multa_atraso/multa_limite usados no template continuam vindo da
  // extração por IA normalmente.
  const multaAtrasoLimiteRaw = extractMultaAtrasoLimiteRawAnswers(messages);
  const multaAtrasoLimiteRawAnswer = multaAtrasoLimiteRaw.length > 0 ? multaAtrasoLimiteRaw[0].answer : '';

  // 2. Monta metadados
  const selectedTemplate = CONTRACT_TEMPLATES[contractType] || CONTRACT_TEMPLATES['prestacao-servicos'];
  const contractTitle    = selectedTemplate.title.toUpperCase();
  const legalRef         = LEGAL_REF[contractType] || 'segundo o Código Civil Brasileiro';
  const hoje             = new Date();
  const dataAtual        = hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const isOnline         = answers.modalidade_assinatura?.toLowerCase().includes('online');

  const dataBlock = Object.entries(answers)
    .filter(([, v]) => v && v.trim() !== '')
    .map(([k, v]) => `• ${k}: ${v}`)
    .join('\n');

  const foroInstrucao = isOnline
    ? 'Assinatura ONLINE/DIGITAL. Na cláusula de foro, as partes elegem o foro do domicílio do réu.'
    : `Assinatura PRESENCIAL na cidade de ${answers.cidade || ''}, estado ${answers.estado || ''}. Use exatamente esses dados na cláusula de foro.`;

  // FIX: monta de forma determinística (sem IA) a frase que descreve um
  // prazo de tolerância/carência de multa, quando o usuário mencionou um
  // em qualquer campo de multa fixa (multa_atraso_fixa*, presente em
  // prestação de serviços, empreitada, freelancer, compra e venda e
  // comodato). Essa frase é imposta como texto literal obrigatório na
  // cláusula de multas (ver generateClause) — ver extractToleranceDays
  // para o porquê disso não ficar a cargo da IA.
  let multaToleranciaSentence = '';
  for (const [field, value] of Object.entries(answers)) {
    if (/^multa_atraso_fixa/.test(field) && typeof value === 'string') {
      const days = extractToleranceDays(value);
      if (days) {
        multaToleranciaSentence = `A multa fixa mencionada nesta cláusula somente será exigível caso o atraso ultrapasse ${days} dias, contados a partir do evento que originou a obrigação (ex.: a entrega do bem ou do serviço); durante esse prazo de tolerância, nenhuma penalidade incidirá.`;
        break;
      }
    }
  }

  // FIX: assim como a tolerância acima, a instrução solta pedindo pra IA
  // tratar multa fixa e multa diária como obrigações separadas
  // (multaExtra, em generateClause) se mostrou insuficiente em testes
  // reais — a multa diária foi omitida por completo em mais de uma
  // geração, mesmo com o dado correto disponível em "DADOS DO CONTRATO".
  // Por isso, quando existe uma multa diária (extraída deterministicamente
  // da conversa — ver extractMultaDiariaRawAnswers), a frase que a
  // menciona também é montada aqui em código e imposta como texto literal
  // obrigatório na cláusula de multas.
  const NEGATIVE_MULTA_PATTERN = /(n[ãa]o\s*(h[áa]|haver[áa]|tem|existe))|sem\s*multa|nenhuma?/i;
  let multaDiariaSentence = '';
  for (const [field, value] of Object.entries(answers)) {
    if (/^multa_atraso_(entrega|pagamento|devolucao)$/.test(field) && typeof value === 'string') {
      if (NEGATIVE_MULTA_PATTERN.test(value)) continue;
      const percentMatch = value.match(/\d+(?:[.,]\d+)?\s*%/);
      const moneyMatch    = value.match(/R\$\s*[\d.,]+/i);
      const valorExtraido = (percentMatch && percentMatch[0]) || (moneyMatch && moneyMatch[0]);
      if (valorExtraido) {
        multaDiariaSentence = `Além da multa fixa mencionada nesta cláusula, incidirá também uma multa diária de ${valorExtraido} sobre o valor da venda, por cada dia de atraso${multaToleranciaSentence ? ', contada a partir do término do prazo de tolerância aqui estabelecido' : ''}.`;
        break;
      }
    }
  }

  // FIX: mesma lógica das duas frases anteriores, agora para a pergunta
  // composta de prestação de serviços e empreitada (taxa diária + limite
  // máximo numa resposta só). Aplicada por precaução — essa estrutura
  // nunca mostrou o mesmo bug em testes reais, mas segue o mesmo
  // raciocínio: não depender só da instrução solta no prompt.
  let multaAtrasoLimiteSentence = '';
  if (multaAtrasoLimiteRawAnswer && !NEGATIVE_MULTA_PATTERN.test(multaAtrasoLimiteRawAnswer)) {
    const percentuais = multaAtrasoLimiteRawAnswer.match(/\d+(?:[.,]\d+)?\s*%/g) || [];
    if (percentuais.length >= 2) {
      multaAtrasoLimiteSentence = `Incidirá multa por atraso de ${percentuais[0]} ao dia, limitada a um total de ${percentuais[1]} sobre o valor do contrato.`;
    } else if (percentuais.length === 1) {
      multaAtrasoLimiteSentence = `Incidirá multa por atraso de ${percentuais[0]} ao dia.`;
    }
  }

  const clauses    = CONTRACT_CLAUSES[contractType] || [];
  const totalSteps = clauses.length + 2; // +2: extração e montagem final

  // 3. Monta o cabeçalho do contrato (determinístico — sem IA)
  const header = buildHeader(contractTitle, answers, selectedTemplate, dataAtual);

  // 4. Gera cada cláusula individualmente
  const clauseTexts = [];
  for (let i = 0; i < clauses.length; i++) {
    const clausula    = clauses[i];
    const numClausula = i + 1;
    const isLast      = i === clauses.length - 1;

    if (onProgress) {
      const pct = Math.round(((i + 1) / totalSteps) * 90);
      onProgress(pct, 100, `Gerando ${clausula.split('—')[0].trim()}...`);
    }

    console.log(`[generateContract] Gerando cláusula ${numClausula}/${clauses.length}: ${clausula}`);

    try {
      const clauseText = await generateClause(
        clausula, i, numClausula,
        dataBlock, contractTitle, legalRef, dataAtual,
        foroInstrucao, isLast, multaToleranciaSentence, multaDiariaSentence, multaAtrasoLimiteSentence
      );
      clauseTexts.push(clauseText);
    } catch (err) {
      console.error(`[generateContract] Cláusula ${numClausula} falhou:`, err.message);
      // Insere placeholder para não quebrar a numeração
      clauseTexts.push(`${clausula}\n\n§1º Esta cláusula será complementada conforme acordado entre as partes.\n\n§2º As disposições gerais do presente instrumento se aplicam integralmente.`);
    }
  }

  if (onProgress) onProgress(95, 100, 'Montando contrato final...');

  // 5. Monta o contrato completo
  let fullContract = header + '\n\n' + clauseTexts.join('\n\n');

  // 6. Pós-processamento
  fullContract = fullContract.replace(/\[[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ\s_]+\]/gi, '');
  fullContract = fullContract.replace(/\{[^}]+\}/g, '');
  fullContract = preprocessContractText(fullContract);
  // Corrige automaticamente "ser"/"estar" usados no infinitivo como
  // verbo principal (ex.: "Este foro ser exclusivo" → "...será exclusivo")
  fullContract = fixBareFiniteVerbs(fullContract);

  // 7. Validação final — OBRIGATÓRIA antes da entrega
  const { errors: validationErrors, criticalErrors } = validateContract(fullContract, answers, contractType, messages);
  if (validationErrors.length > 0) {
    console.warn('[generateContract] Avisos de validação:', validationErrors);
  }
  if (criticalErrors.length > 0) {
    console.error('[generateContract] Erros críticos de integridade — entrega bloqueada:', criticalErrors);
    throw new Error(
      'O contrato não pôde ser entregue porque foram encontradas inconsistências nos dados ' +
      '(informações diferentes das fornecidas por você):\n- ' + criticalErrors.join('\n- ') +
      '\n\nPor favor, tente gerar o contrato novamente.'
    );
  }

  // 8. Signatários
  const fields      = PARTY_NAME_FIELDS[contractType] || ['contratante_nome', 'contratado_nome'];
  const signerNames = fields.map(f => answers[f] || '').filter(Boolean);

  if (onProgress) onProgress(100, 100, 'Contrato pronto!');

  return { contract: fullContract, signerNames, validationErrors };
};

// ============================================================
// buildHeader — monta o cabeçalho do contrato em código puro
// Usa APENAS campos de identificação das partes (nome, CPF,
// telefone, email) — NÃO inclui o template completo para não
// contaminar o contexto da IA com dados que ela vai repetir.
// ============================================================
const buildHeader = (contractTitle, answers, selectedTemplate, dataAtual) => {
  // Campos que identificam as partes — sempre vão no cabeçalho
  const IDENTITY_FIELDS = [
    'contratante_nome', 'contratante_cpf_cnpj', 'contratante_telefone', 'contratante_email',
    'contratado_nome',  'contratado_cpf_cnpj',  'contratado_telefone',  'contratado_email',
    'locador_nome',     'locador_cpf_cnpj',     'locador_telefone',     'locador_email',     'locador_estado_civil',
    'locatario_nome',   'locatario_cpf_cnpj',   'locatario_telefone',   'locatario_email',   'locatario_estado_civil',
    'parte_a_nome',     'parte_a_cpf_cnpj',     'parte_a_telefone',     'parte_a_email',
    'parte_b_nome',     'parte_b_cpf_cnpj',     'parte_b_telefone',     'parte_b_email',
    'revelador_nome',   'revelador_cpf_cnpj',   'revelador_telefone',   'revelador_email',
    'receptor_nome',    'receptor_cpf_cnpj',    'receptor_telefone',    'receptor_email',
    'freelancer_nome',  'freelancer_cpf',        'freelancer_telefone',  'freelancer_email',
    'vendedor_nome',    'vendedor_cpf_cnpj',    'vendedor_telefone',    'vendedor_email',
    'comprador_nome',   'comprador_cpf_cnpj',   'comprador_telefone',   'comprador_email',
    'empreiteiro_nome', 'empreiteiro_cpf_cnpj', 'empreiteiro_telefone', 'empreiteiro_email',
    'socio_a_nome',     'socio_a_cpf',          'socio_a_telefone',     'socio_a_email',
    'socio_b_nome',     'socio_b_cpf',          'socio_b_telefone',     'socio_b_email',
    'representada_nome','representada_cnpj',     'representada_telefone','representada_email',
    'representante_nome','representante_cpf_cnpj','representante_telefone','representante_email',
    'comodante_nome',   'comodante_cpf_cnpj',   'comodante_telefone',   'comodante_email',
    'comodatario_nome', 'comodatario_cpf_cnpj', 'comodatario_telefone', 'comodatario_email',
  ];

  // Monta as linhas do cabeçalho apenas com campos de identidade
  const lines = IDENTITY_FIELDS
    .filter(field => answers[field] && answers[field].trim() !== '')
    .map(field => {
      // Converte o nome do campo para label legível
      const label = field
        .replace(/_nome$/, '')
        .replace(/_cpf_cnpj$/, ' CPF/CNPJ')
        .replace(/_cpf$/, ' CPF')
        .replace(/_cnpj$/, ' CNPJ')
        .replace(/_telefone$/, ' TELEFONE')
        .replace(/_email$/, ' EMAIL')
        .replace(/_estado_civil$/, ' ESTADO CIVIL')
        .replace(/_/g, ' ')
        .toUpperCase()
        .trim();
      return `${label}: ${answers[field]}`;
    });

  return `${contractTitle}\n\nDATA DE ASSINATURA: ${dataAtual}\n\n${lines.join('\n')}`;
};