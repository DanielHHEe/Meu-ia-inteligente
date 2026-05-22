import {
  sendMessageToIA,
  getInitialPrompt,
  generateContractFromConversation,
  FIELD_ORDER_BY_CONTRACT
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
  // CPF/CNPJ — detecta perguntas específicas sobre documentos
  if (lastAssistantMsg.includes('cpf ou cnpj') || lastAssistantMsg.includes('cpf/cnpj')) return 'cpf_cnpj';
  if (lastAssistantMsg.includes('cnpj') && !lastAssistantMsg.includes('cpf')) return 'cnpj';
  if (lastAssistantMsg.includes('cpf') && !lastAssistantMsg.includes('cnpj')) return 'cpf';

  // Email — só detecta se a pergunta for ESPECIFICAMENTE sobre email
  // Ignora perguntas que citam "email" apenas como exemplo (ex: email, WhatsApp)
  const isAskingForEmail = (
    /qual.*(o |seu |o seu )?e?-?mail/i.test(lastAssistantMsg) ||
    /informe.*(o |seu )?e?-?mail/i.test(lastAssistantMsg) ||
    /e?-?mail.*(do |da |de )?(contratante|contratado|locador|locatário|parte|vendedor|comprador|freelancer|revelador|receptor|comodante|comodatário|empreiteiro|representad|sócio)/i.test(lastAssistantMsg)
  );
  if (isAskingForEmail) return 'email';

  // Telefone — só detecta se for pergunta específica sobre telefone
  const isAskingForPhone = (
    /qual.*(o |seu |o seu )?telefone/i.test(lastAssistantMsg) ||
    /n[úu]mero.*(de )?telefone/i.test(lastAssistantMsg) ||
    /telefone.*(do |da |de )?(contratante|contratado|locador|locatário|parte|vendedor|comprador|freelancer|revelador|receptor|comodante|comodatário|empreiteiro|representad|sócio)/i.test(lastAssistantMsg)
  );
  if (isAskingForPhone) return 'telefone';

  return null;
};

const validateUserInput = (userMessage, fieldType) => {
  const trimmed = userMessage.trim();
  const digits = trimmed.replace(/\D/g, '');
  const field = fieldType;

  // Validação de email removida do frontend — a IA já aceita qualquer resposta
  // para campos de email sem revalidar (corrigido no api.js)
  if (field === 'email') return null;

  // Validação de CPF ou CNPJ (campo misto)
  if (field === 'cpf_cnpj' && digits.length > 0 && digits.length !== 11 && digits.length !== 14) {
    return `Esse CPF ou CNPJ está incorreto. CPF tem 11 dígitos e CNPJ tem 14. Você informou ${digits.length} dígito(s). Por favor, informe o CPF ou CNPJ novamente.`;
  }

  // Validação de CPF puro — valida se diferente de 11
  if (field === 'cpf' && digits.length > 0 && digits.length !== 11) {
    return `Esse CPF parece incorreto — um CPF tem exatamente 11 dígitos e você informou ${digits.length}. Por favor, informe novamente.`;
  }

  // Validação de CNPJ puro — valida se diferente de 14
  if (field === 'cnpj' && digits.length > 0 && digits.length !== 14) {
    return `Esse CNPJ parece incorreto — um CNPJ tem exatamente 14 dígitos e você informou ${digits.length}. Por favor, informe novamente.`;
  }

  // Validação de telefone
  if (field === 'telefone' && digits.length > 0 && digits.length < 10) {
    return `Esse telefone parece incompleto — telefone tem 10 ou 11 dígitos com DDD. Você informou ${digits.length}. Por favor, informe novamente.`;
  }

  return null;
};

// Injeta instrução no histórico para a IA NÃO revalidar campo já validado localmente
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

  // Insere uma instrução de sistema antes da última mensagem do usuário
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
  }

  async startChat() {
    const initialMessage = {
      role: 'assistant',
      content: getInitialPrompt(this.contractType)
    };
    this.messages.push(initialMessage);
    return initialMessage.content;
  }

  getLastRealQuestion() {
    const errorPhrases = ['parece incompleto', 'parece inválido', 'está incorreto', 'por favor, informe', 'parece incorreto'];
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const msg = this.messages[i];
      if (msg.role === 'assistant') {
        const lower = msg.content.toLowerCase();
        const isError = errorPhrases.some(p => lower.includes(p));
        if (!isError) return lower;
      }
    }
    return '';
  }

  async sendUserMessage(userMessage) {
    const realQuestion = this.getLastRealQuestion();
    // Detecta o campo sempre pela última pergunta real da IA
    // NÃO reutiliza currentFieldType de validações anteriores de outro campo
    const detectedFieldType = detectFieldType(realQuestion);
    
    // Se a pergunta real mudou de campo OU não é mais um campo validável,
    // reseta currentFieldType para evitar validar campos errados
    if (this.currentFieldType) {
      if (!detectedFieldType || this.currentFieldType !== detectedFieldType) {
        this.currentFieldType = null;
      }
    }

    const fieldType = this.currentFieldType || detectedFieldType;
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

    // Validação passou — limpa o campo atual
    const validatedFieldType = this.currentFieldType || fieldType;
    this.currentFieldType = null;
    this.messages.push({ role: 'user', content: userMessage });

    try {
      // Se o campo foi validado localmente, injeta hint para a IA não revalidar
      const messagesForIA = buildMessagesWithHint(this.messages, validatedFieldType);

      const nextQuestion = await sendMessageToIA(messagesForIA, this.contractType);
      this.messages.push({ role: 'assistant', content: nextQuestion });

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

  async generateContract() {
    if (!this.isComplete) {
      throw new Error('Ainda não temos todas as informações necessárias');
    }

    try {
      const messagesForExtraction = this.getMessagesForExtraction();
      const contract = await generateContractFromConversation(
        messagesForExtraction,
        this.contractType
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