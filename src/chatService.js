import {
  sendMessageToIA,
  getInitialPrompt,
  generateContractFromConversation,
  FIELD_ORDER_BY_CONTRACT,
  validateAnswerRelevance
} from './config/api';

// ============================================================
// Validação local — mais confiável que deixar a IA contar
// ============================================================
const getLastAssistantMessage = (messages) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'assistant') return messages[i].content.toLowerCase();
  }
  return '';
};

const detectFieldType = (lastAssistantMsg) => {
  if (lastAssistantMsg.includes('cpf ou cnpj') || lastAssistantMsg.includes('cpf/cnpj')) return 'cpf_cnpj';
  if (lastAssistantMsg.includes('cnpj') && !lastAssistantMsg.includes('cpf')) return 'cnpj';
  if (lastAssistantMsg.includes('cpf') && !lastAssistantMsg.includes('cnpj')) return 'cpf';

  const isAskingForEmail = (
    /qual.{0,20}(o |seu |o seu )?e?-?mail/i.test(lastAssistantMsg) ||
    /informe.{0,20}(o |seu )?e?-?mail/i.test(lastAssistantMsg) ||
    /e?-?mail.*(do |da |de )?(contratante|contratado|locador|locatário|parte|vendedor|comprador|freelancer|revelador|receptor|comodante|comodatário|empreiteiro|representad|representante|sócio)/i.test(lastAssistantMsg)
  );
  if (isAskingForEmail) return 'email';

  const isAskingForPhone = (
    /qual.{0,20}(o |seu |o seu )?telefone/i.test(lastAssistantMsg) ||
    /n[úu]mero.{0,10}(de )?telefone/i.test(lastAssistantMsg) ||
    /telefone.*(do |da |de )?(contratante|contratado|locador|locatário|parte|vendedor|comprador|freelancer|revelador|receptor|comodante|comodatário|empreiteiro|representad|representante|sócio)/i.test(lastAssistantMsg)
  );
  if (isAskingForPhone) return 'telefone';

  // FIX: as três checagens abaixo cobrem perguntas compostas em que a
  // segunda parte (condicional) pode ficar sem resposta mesmo quando o
  // usuário responde algo — ex.: dizer "presencial" sem informar o
  // endereço. Antes, isso dependia inteiramente da validação semântica
  // por IA (validateAnswerRelevance), que já se mostrou inconsistente.
  // Agora essas checagens são locais e determinísticas, como CPF/telefone.
  const isAskingLocalExecucao = (
    /remot[ao].*presencial.*h[íi]brid/i.test(lastAssistantMsg) ||
    (lastAssistantMsg.includes('presencial') && lastAssistantMsg.includes('endereço completo'))
  );
  if (isAskingLocalExecucao) return 'local_execucao';

  // FIX: as 5 perguntas de "multa fixa (valor único) por atraso" adicionadas
  // recentemente usam sempre a mesma frase-chave ("multa fixa"). A validação
  // semântica por IA se mostrou inconsistente com respostas mais elaboradas
  // pra esse campo (ex.: multa condicionada a um prazo de tolerância) —
  // por isso este campo passa a ter checagem local determinística, como
  // CPF/telefone/email, em vez de depender do julgamento da IA.
  const isAskingMultaFixa = lastAssistantMsg.includes('multa fixa');
  if (isAskingMultaFixa) return 'multa_fixa';

  const isAskingMultaAtrasoLimite = (
    lastAssistantMsg.includes('multa') && lastAssistantMsg.includes('atraso') && /limite|m[áa]ximo/i.test(lastAssistantMsg)
  );
  if (isAskingMultaAtrasoLimite) return 'multa_atraso_limite';

  // FIX: perguntas de multa "por dia"/"ao dia" (sem limite/máximo — essas já
  // caem no caso acima) e de juros "ao mês" já estabelecem a unidade de
  // tempo na própria pergunta. Exigir que o usuário repita "por dia" ou
  // "ao mês" na resposta é redundante e gerava rejeições indevidas pela
  // validação semântica (ex.: "2% do valor da venda" sendo rejeitado numa
  // pergunta que já diz "por dia", enquanto "por dia é 2%..." era aceito).
  // Como o contexto já é inequívoco, esse campo passa a ter checagem local
  // determinística, aceitando qualquer percentual ou valor monetário.
  const isAskingMultaDiaria = (
    lastAssistantMsg.includes('multa') && lastAssistantMsg.includes('atraso') &&
    /por dia|ao dia/i.test(lastAssistantMsg) &&
    !/limite|m[áa]ximo/i.test(lastAssistantMsg)
  );
  if (isAskingMultaDiaria) return 'multa_diaria';

  const isAskingJurosAtraso = (
    lastAssistantMsg.includes('juros') && /ao m[êe]s/i.test(lastAssistantMsg)
  );
  if (isAskingJurosAtraso) return 'juros_atraso';

  const isAskingMetaVendas = (
    lastAssistantMsg.includes('meta') && lastAssistantMsg.includes('vendas') && lastAssistantMsg.includes('atingid')
  );
  if (isAskingMetaVendas) return 'meta_vendas';

  return null;
};

const validateUserInput = (userMessage, fieldType) => {
  const trimmed = userMessage.trim();
  const digits = trimmed.replace(/\D/g, '');
  const field = fieldType;

  if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (trimmed.length > 0 && !emailRegex.test(trimmed)) {
      return `Esse e-mail parece estar em um formato inválido. Por favor, informe um e-mail válido (ex: nome@dominio.com).`;
    }
    return null;
  }

  if (field === 'cpf_cnpj' && digits.length > 0 && digits.length !== 11 && digits.length !== 14) {
    return `Esse CPF ou CNPJ está incorreto. CPF tem 11 dígitos e CNPJ tem 14. Você informou ${digits.length} dígito(s). Por favor, informe o CPF ou CNPJ novamente.`;
  }

  if (field === 'cpf' && digits.length > 0 && digits.length !== 11) {
    return `Esse CPF parece incorreto — um CPF tem exatamente 11 dígitos e você informou ${digits.length}. Por favor, informe novamente.`;
  }

  if (field === 'cnpj' && digits.length > 0 && digits.length !== 14) {
    return `Esse CNPJ parece incorreto — um CNPJ tem exatamente 14 dígitos e você informou ${digits.length}. Por favor, informe novamente.`;
  }

  if (field === 'telefone' && digits.length > 0 && digits.length < 10) {
    return `Esse telefone parece incompleto — telefone tem 10 ou 11 dígitos com DDD. Você informou ${digits.length}. Por favor, informe novamente.`;
  }

  // FIX: checagens locais para as três perguntas compostas (ver nota em
  // detectFieldType). Padrão negativo genérico usado pra reconhecer quando
  // o usuário já disse que a condição não se aplica (ex.: "não há multa
  // diária"), caso em que a segunda parte da pergunta não é exigida.
  const NEGATIVE_PATTERN = /(n[ãa]o\s*(h[áa]|haver[áa]|tem|existe))|sem\s*multa|nenhuma?/i;

  if (field === 'local_execucao') {
    const mentionsPresencialOuHibrido = /presencial|h[íi]brid/i.test(trimmed);
    if (mentionsPresencialOuHibrido) {
      const hasNumber = /\d/.test(trimmed);
      const hasAddressWord = /\b(rua|avenida|av\.|alameda|travessa|rodovia|bairro|endereço|numero|número|nº|n°)\b/i.test(trimmed);
      if (!hasNumber && !hasAddressWord) {
        return 'Você informou que o serviço será presencial ou híbrido, mas não incluiu o endereço. Por favor, informe o endereço completo (rua, número, bairro e cidade) onde o serviço será realizado.';
      }
    }
    return null;
  }

  if (field === 'multa_atraso_limite') {
    if (!NEGATIVE_PATTERN.test(trimmed)) {
      const percentMatches = trimmed.match(/\d+(?:[.,]\d+)?\s*%/g) || [];
      const mentionsLimite = /limite|m[áa]ximo|teto/i.test(trimmed);
      if (percentMatches.length < 2 && !mentionsLimite) {
        return 'Você informou o percentual de multa por atraso, mas não o limite máximo dessa multa. Por favor, informe também o limite máximo (ex: 10% do valor total).';
      }
    }
    return null;
  }

  if (field === 'multa_fixa') {
    if (!NEGATIVE_PATTERN.test(trimmed)) {
      const hasPercent = /\d+(?:[.,]\d+)?\s*%/.test(trimmed);
      const hasMoney = /r\$\s*[\d.,]+/i.test(trimmed);
      const hasNumericValue = /\d+(?:[.,]\d+)?/.test(trimmed);
      if (!hasPercent && !hasMoney && !hasNumericValue) {
        return 'Você indicou que há multa fixa por atraso, mas não informou o valor ou percentual dela. Por favor, informe o valor ou percentual dessa multa.';
      }
    }
    return null;
  }

  if (field === 'multa_diaria') {
    if (!NEGATIVE_PATTERN.test(trimmed)) {
      const hasPercent = /\d+(?:[.,]\d+)?\s*%/.test(trimmed);
      const hasMoney = /r\$\s*[\d.,]+/i.test(trimmed);
      const hasNumericValue = /\d+(?:[.,]\d+)?/.test(trimmed);
      if (!hasPercent && !hasMoney && !hasNumericValue) {
        return 'Você indicou que há multa por atraso, mas não informou o valor ou percentual diário dela. Por favor, informe o valor ou percentual dessa multa por dia.';
      }
    }
    return null;
  }

  if (field === 'juros_atraso') {
    if (!NEGATIVE_PATTERN.test(trimmed)) {
      const hasPercent = /\d+(?:[.,]\d+)?\s*%/.test(trimmed);
      const hasNumericValue = /\d+(?:[.,]\d+)?/.test(trimmed);
      if (!hasPercent && !hasNumericValue) {
        return 'Você indicou que há juros por atraso, mas não informou o percentual mensal deles. Por favor, informe o percentual desses juros ao mês.';
      }
    }
    return null;
  }

  if (field === 'meta_vendas') {
    if (!NEGATIVE_PATTERN.test(trimmed)) {
      const mentionsConsequencia = /consequ|acontece|penalidade|revis[ãa]o|advert[êe]ncia|resultado|reduz|corte|desconto|rescis/i.test(trimmed);
      if (!mentionsConsequencia) {
        return 'Você informou que haverá meta mínima de vendas, mas não o que acontece se ela não for atingida. Por favor, informe também essa consequência.';
      }
    }
    return null;
  }

  return null;
};

// ============================================================
// NOVO — isMetaMessage
//
// Detecta quando a mensagem do usuário NÃO é uma tentativa de
// resposta ao campo perguntado, e sim:
//  (a) uma dúvida/pedido de esclarecimento sobre a própria pergunta
//      (ex.: "o que é isso?", "não entendi", "pode dar um exemplo?")
//  (b) uma correção de uma resposta dada anteriormente na conversa
//      (ex.: "eu errei na resposta anterior, meu e-mail é...")
//
// Por que isso é necessário: as validações abaixo (local de formato
// e semântica por IA) foram desenhadas para bloquear respostas que
// não correspondem ao campo pedido — o que é correto quando o
// usuário de fato tentou responder e errou o assunto, mas incorreto
// quando o usuário nem estava tentando responder, e sim interagindo
// naturalmente com a entrevista (pedindo explicação ou corrigindo
// algo). Nesses dois casos, a mensagem deve ir direto para a IA
// conversacional (sendMessageToIA), que agora tem instruções
// explícitas no SYSTEM_PROMPT para explicar/esclarecer ou reconhecer
// a correção e, em seguida, retomar exatamente a pergunta pendente.
// ============================================================
const CLARIFICATION_PATTERNS = /(o que (é|significa|quer dizer)\b|n[ãa]o entendi\b|pode explicar\b|explica(r)?(-me)?\b.*\?|d[êe](-me)? um exemplo|n[ãa]o sei o que (é|significa)|como assim\b|\?\s*$)/i;

const CORRECTION_PATTERNS = /(eu errei\b|me enganei\b|errei (a|na) resposta|corrigir a resposta|corrig(ir|indo) (a resposta|isso)|na resposta anterior|na pergunta anterior|quis dizer (na verdade )?que|o (certo|correto) (é|seria)|(na verdade|na real|na realidade)[,]?\s*(o|a|meu|minha)?\s*.*(é|era)(\s|$))/i;

const isMetaMessage = (userMessage) => {
  const trimmed = (userMessage || '').trim();
  if (!trimmed) return false;
  return CLARIFICATION_PATTERNS.test(trimmed) || CORRECTION_PATTERNS.test(trimmed);
};

const buildMessagesWithHint = (messages, fieldType) => {
  if (!fieldType) return messages;

  const hints = {
    cpf: 'O CPF informado pelo usuário foi validado localmente e possui exatamente 11 dígitos. Aceite-o como correto e passe para a próxima pergunta.',
    cnpj: 'O CNPJ informado pelo usuário foi validado localmente e possui exatamente 14 dígitos. Aceite-o como correto e passe para a próxima pergunta.',
    cpf_cnpj: 'O CPF/CNPJ informado pelo usuário foi validado localmente e possui a quantidade correta de dígitos. Aceite-o como correto e passe para a próxima pergunta.',
    telefone: 'O telefone informado pelo usuário foi validado localmente. Aceite-o como correto e passe para a próxima pergunta.',
    email: 'O email informado pelo usuário foi validado localmente. Aceite-o como correto e passe para a próxima pergunta.',
  };

  const hint = hints[fieldType];
  if (!hint) return messages;

  const copy = [...messages];
  const lastUserIndex = copy.map(m => m.role).lastIndexOf('user');
  if (lastUserIndex >= 0) {
    copy.splice(lastUserIndex, 0, {
      role: 'system',
      content: hint,
    });
  }
  return copy;
};

export class ChatService {
  constructor(contractType) {
    this.contractType = contractType;
    this.messages = [];
    this.isComplete = false;
    this.askedForExtras = false;
    this.confirmedData = false;
    this.currentFieldType = null;
    // FIX: trava de segurança contra loop infinito de rejeição —
    // ver nota detalhada em sendUserMessage, no bloco de validação
    // semântica.
    this.lastRejectedQuestion = null;
    this.rejectionCount = 0;
    // FIX: substitui a antiga detecção de "pergunta real" por busca de
    // frases de erro no texto (getLastRealQuestion). Essa busca por texto
    // quebrava sempre que a PRÓPRIA pergunta legítima da IA continha uma
    // das frases usadas para reconhecer erros — ex.: "...por favor,
    // informe o endereço completo..." era confundida com uma mensagem de
    // rejeição e descartada, fazendo o sistema comparar a resposta do
    // usuário com uma pergunta antiga e errada. Agora a pergunta real é
    // rastreada diretamente neste campo, atualizado apenas quando a IA
    // efetivamente avança para uma nova pergunta — nunca quando uma
    // resposta é rejeitada — eliminando essa ambiguidade por completo.
    this.lastRealQuestion = '';
  }

  async startChat() {
    const initialMessage = {
      role: 'assistant',
      content: getInitialPrompt(this.contractType)
    };
    this.messages.push(initialMessage);
    this.lastRealQuestion = initialMessage.content.toLowerCase();
    return initialMessage.content;
  }

  getLastRealQuestion() {
    return this.lastRealQuestion;
  }

  async sendUserMessage(userMessage) {
    const realQuestion = this.getLastRealQuestion();
    const detectedFieldType = detectFieldType(realQuestion);

    if (this.currentFieldType) {
      if (!detectedFieldType || this.currentFieldType !== detectedFieldType) {
        this.currentFieldType = null;
      }
    }

    const fieldType = this.currentFieldType || detectedFieldType;

    // FIX: se a mensagem for uma dúvida/pedido de esclarecimento ou uma
    // correção de resposta anterior, pula TANTO a validação local de
    // formato QUANTO a validação semântica abaixo — em nenhum dos dois
    // casos o usuário está tentando responder ao campo atual, então não
    // faz sentido validar a mensagem contra ele. A mensagem vai direto
    // para a IA conversacional, que tem instruções específicas no
    // SYSTEM_PROMPT (regras 13 e 14) para lidar com cada caso.
    const isMeta = isMetaMessage(userMessage);

    if (!isMeta) {
      const validationError = validateUserInput(userMessage, fieldType);

      if (validationError) {
        this.currentFieldType = fieldType;
        this.messages.push({ role: 'assistant', content: validationError });
        return {
          message: validationError,
          isComplete: false,
          isValidationError: true,
        };
      }
    }

    // ============================================================
    // NOVO — Validação contextual/semântica
    //
    // Roda em TODA pergunta (inclusive as que já passaram pela
    // validação local de formato acima), para pegar exatamente o
    // caso relatado: o usuário responde repetindo a própria pergunta,
    // manda um texto aleatório, ou algo sem nenhuma relação com o que
    // foi perguntado (ex.: pergunta pede o número de matrícula do
    // imóvel e o usuário devolve a própria pergunta como resposta).
    //
    // A IA analisa a pergunta real (realQuestion) e a resposta do
    // usuário e decide se faz sentido como resposta. Se não fizer,
    // bloqueia o avanço e pede a informação novamente — mesmo padrão
    // de UX das validações locais já existentes.
    //
    // Fail-safe: se a chamada de validação falhar tecnicamente, a
    // resposta é aceita (ver validateAnswerRelevance em api.js), então
    // o fluxo nunca trava por causa de uma instabilidade de rede.
    //
    // FIX — trava contra loop infinito de rejeição: a validação
    // semântica é uma chamada de IA e, por isso, pode ocasionalmente
    // rejeitar uma resposta que na verdade é válida (falso positivo).
    // Antes desta correção, isso podia travar o usuário indefinidamente
    // na mesma pergunta, sem nenhum limite de tentativas — já que uma
    // resposta rejeitada nunca é adicionada ao histórico (this.messages),
    // a próxima tentativa é validada do zero, sujeita ao mesmo risco de
    // falso positivo outra vez. Agora, se a MESMA pergunta (realQuestion)
    // já rejeitou uma resposta anteriormente, a validação semântica é
    // pulada na tentativa seguinte e a resposta é aceita diretamente —
    // garantindo no máximo uma rejeição semântica por pergunta. A
    // validação local de formato (CPF/CNPJ/telefone, acima) continua
    // valendo normalmente e não é afetada por esta trava.
    // ============================================================
    const alreadyRejectedThisQuestion = this.lastRejectedQuestion === realQuestion && this.rejectionCount >= 1;

    // FIX: campos que já passam por uma checagem local determinística
    // (CPF/CNPJ, telefone, e os três campos compostos adicionados
    // recentemente) não precisam também da validação semântica por IA —
    // rodar as duas em sequência é redundante e criava falsos positivos
    // (ex.: telefone com 11 dígitos sem espaço sendo rejeitado pela IA,
    // enquanto o mesmo número com espaço era aceito). A validação local
    // já é suficiente e mais confiável para esses campos.
    const LOCALLY_VALIDATED_FIELDS = ['cpf', 'cnpj', 'cpf_cnpj', 'telefone', 'email', 'local_execucao', 'multa_atraso_limite', 'meta_vendas', 'multa_fixa', 'multa_diaria', 'juros_atraso'];
    const skipSemanticValidation = LOCALLY_VALIDATED_FIELDS.includes(fieldType);

    if (!isMeta && realQuestion && !alreadyRejectedThisQuestion && !skipSemanticValidation) {
      // FIX: passamos as últimas mensagens da conversa como contexto para o
      // validador semântico. Sem isso, a IA validadora só via a pergunta
      // atual e a resposta atual — fisicamente incapaz de reconhecer que o
      // usuário estava corrigindo um dado de perguntas anteriores, porque
      // não sabia que esse dado existia. Com o contexto, a própria IA passa
      // a identificar correções e pedidos de esclarecimento de forma
      // genérica (ver prompt em validateAnswerRelevance, em api.js),
      // em vez de depender de uma lista fixa de frases em regex.
      const recentContext = this.messages
        .slice(-10)
        .map(m => `${m.role === 'assistant' ? 'IA' : 'USUÁRIO'}: ${m.content}`)
        .join('\n');
      const { valido } = await validateAnswerRelevance(realQuestion, userMessage, recentContext);
      if (!valido) {
        const rejectionMessage = 'Essa resposta não parece corresponder à pergunta feita. Por favor, informe o dado solicitado corretamente para que possamos continuar.';
        this.currentFieldType = fieldType;
        this.lastRejectedQuestion = realQuestion;
        this.rejectionCount += 1;
        this.messages.push({ role: 'assistant', content: rejectionMessage });
        return {
          message: rejectionMessage,
          isComplete: false,
          isValidationError: true,
        };
      }
    }

    this.lastRejectedQuestion = null;
    this.rejectionCount = 0;

    const validatedFieldType = this.currentFieldType || fieldType;
    this.currentFieldType = null;
    this.messages.push({ role: 'user', content: userMessage });

    try {
      const messagesForIA = buildMessagesWithHint(this.messages, validatedFieldType);
      const nextQuestion = await sendMessageToIA(messagesForIA, this.contractType);
      this.messages.push({ role: 'assistant', content: nextQuestion });
      this.lastRealQuestion = nextQuestion.toLowerCase();

      if (!this.confirmedData && this.checkAskedConfirmation(nextQuestion)) {
        this.confirmedData = true;
      }

      if (!this.askedForExtras && this.checkAskedForExtras(nextQuestion)) {
        this.askedForExtras = true;
      }

      if (this.checkIfComplete(nextQuestion)) {
        this.isComplete = true;
      }

      return {
        message: nextQuestion,
        isComplete: this.isComplete
      };
    } catch (error) {
      console.error('Erro no chat:', error);
      throw error;
    }
  }

  checkAskedConfirmation(aiMessage) {
    const indicators = [
      'esses dados estão corretos',
      'os dados estão corretos',
      'posso confirmar e prosseguir',
      'confirma os dados',
      'dados estão certos',
      'está tudo correto',
    ];
    const lower = aiMessage.toLowerCase();
    return indicators.some(i => lower.includes(i));
  }

  checkAskedForExtras(aiMessage) {
    const indicators = [
      'deseja adicionar',
      'quer adicionar',
      'alguma informação adicional',
      'mais alguma informação',
      'mais alguma coisa',
      'gostaria de adicionar',
      'tem mais alguma',
      'há mais alguma',
      'algo a mais',
      'adicionar algo',
    ];
    const lower = aiMessage.toLowerCase();
    return indicators.some(i => lower.includes(i));
  }

  checkIfComplete(aiMessage) {
    const indicators = [
      'vou gerar seu contrato agora',
      'vou gerar o contrato agora',
      'gerando seu contrato',
      'vou gerar seu contrato',
      'vou gerar o contrato',
      'perfeito! vou gerar',
      'ótimo! vou gerar',
      'pronto! vou gerar',
      'perfeito! vou gerar seu contrato',
    ];
    const lower = aiMessage.toLowerCase();
    return indicators.some(i => lower.includes(i));
  }

  // ✅ CORRIGIDO: passa onProgress para generateContractFromConversation
  // Isso conecta a barra de progresso do Chat.jsx com a geração cláusula a cláusula
  async generateContract(onProgress) {
    if (!this.isComplete) {
      throw new Error('Ainda não temos todas as informações necessárias');
    }

    try {
      const messagesForExtraction = this.getMessagesForExtraction();
      const contract = await generateContractFromConversation(
        messagesForExtraction,
        this.contractType,
        onProgress   // ← ÚNICA mudança: passa o callback de progresso
      );
      return contract;
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
      throw error;
    }
  }

  getMessagesForExtraction() {
    const msgs = [...this.messages];
    let extrasIndex = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'assistant' && this.checkAskedForExtras(msgs[i].content)) {
        extrasIndex = i;
        break;
      }
    }
    if (extrasIndex !== -1) return msgs.slice(0, extrasIndex);
    return msgs;
  }

  getMessages() {
    return this.messages;
  }
}