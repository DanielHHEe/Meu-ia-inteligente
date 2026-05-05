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

// Detecta o TIPO de campo da pergunta, ignorando mensagens de erro anteriores
const detectFieldType = (lastAssistantMsg) => {
  // Se for mensagem de erro nossa, identificar pelo conteúdo
  if (lastAssistantMsg.includes('cpf ou cnpj') || lastAssistantMsg.includes('cpf/cnpj')) return 'cpf_cnpj';
  if (lastAssistantMsg.includes('cnpj') && !lastAssistantMsg.includes('cpf')) return 'cnpj';
  if (lastAssistantMsg.includes('cpf') && !lastAssistantMsg.includes('cnpj')) return 'cpf';
  if (lastAssistantMsg.includes('email') || lastAssistantMsg.includes('e-mail')) return 'email';
  if (lastAssistantMsg.includes('telefone')) return 'telefone';
  return null;
};

const validateUserInput = (userMessage, fieldType) => {
  const digits = userMessage.replace(/\D/g, '');
  const field = fieldType;

  // Validação de email
  if (
    field === 'email' &&
    !userMessage.includes('@') &&
    userMessage.length > 3 &&
    !/^(sim|não|nao|ok|s|n)$/i.test(userMessage.trim())
  ) {
    return 'Esse email parece inválido pois não contém @. Por favor, informe um email válido (exemplo: nome@email.com)';
  }

  // Validação de CPF ou CNPJ (campo misto)
  if (field === 'cpf_cnpj' && digits.length > 0 && digits.length !== 11 && digits.length !== 14) {
    return `Esse CPF ou CNPJ está incorreto. CPF tem 11 dígitos e CNPJ tem 14. Você informou ${digits.length} dígito(s). Por favor, informe o CPF ou CNPJ novamente.`;
  }

  // Validação de CPF puro
  if (field === 'cpf' && digits.length > 0 && digits.length < 11) {
    return `Esse CPF parece incompleto — um CPF tem 11 dígitos e você informou ${digits.length}. Por favor, informe novamente.`;
  }

  // Validação de CNPJ puro
  if (field === 'cnpj' && digits.length > 0 && digits.length < 14) {
    return `Esse CNPJ parece incompleto — um CNPJ tem 14 dígitos e você informou ${digits.length}. Por favor, informe novamente.`;
  }

  // Validação de telefone
  if (field === 'telefone' && digits.length > 0 && digits.length < 10) {
    return `Esse telefone parece incompleto — telefone tem 10 ou 11 dígitos com DDD. Você informou ${digits.length}. Por favor, informe novamente.`;
  }

  return null;
};

export class ChatService {
  constructor(contractType) {
    this.contractType = contractType;
    this.messages = [];
    this.isComplete = false;
    this.askedForExtras = false;
    this.confirmedData = false;
    this.currentFieldType = null; // guarda o tipo do campo sendo validado
  }

  async startChat() {
    const initialMessage = {
      role: 'assistant',
      content: getInitialPrompt(this.contractType)
    };
    this.messages.push(initialMessage);
    return initialMessage.content;
  }

  async sendUserMessage(userMessage) {
    // Detecta o campo atual — usa o guardado (se em correção) ou detecta do último msg
    const lastMsg = getLastAssistantMessage(this.messages);
    const fieldType = this.currentFieldType || detectFieldType(lastMsg);
    const validationError = validateUserInput(userMessage, fieldType);

    if (validationError) {
      // Guarda o tipo do campo para a próxima tentativa
      this.currentFieldType = fieldType;
      this.messages.push({ role: 'assistant', content: validationError });
      return {
        message: validationError,
        isComplete: false,
        isValidationError: true,
      };
    }

    // Passou na validação — limpa o campo guardado
    this.currentFieldType = null;
    this.messages.push({ role: 'user', content: userMessage });

    try {
      const nextQuestion = await sendMessageToIA(this.messages, this.contractType);
      this.messages.push({ role: 'assistant', content: nextQuestion });

      // Detecta confirmação de dados ("Esses dados estão corretos?")
      if (!this.confirmedData && this.checkAskedConfirmation(nextQuestion)) {
        this.confirmedData = true;
      }

      // Detecta pergunta "deseja adicionar mais?"
      if (!this.askedForExtras && this.checkAskedForExtras(nextQuestion)) {
        this.askedForExtras = true;
      }

      // Conclui quando a IA diz que vai gerar
      // Não exige mais hasMinimumAnswers — a IA já validou durante a coleta
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

  // Detecta se a IA pediu confirmação dos dados
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

  // Detecta se a IA perguntou "deseja adicionar mais?"
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

  // Encerra quando a IA diz explicitamente que vai gerar
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

  // Remove a troca "deseja adicionar mais?" + resposta final
  // para não poluir a extração de dados com ruído
  getMessagesForExtraction() {
    const msgs = [...this.messages];

    let extrasIndex = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'assistant' && this.checkAskedForExtras(msgs[i].content)) {
        extrasIndex = i;
        break;
      }
    }

    if (extrasIndex !== -1) {
      return msgs.slice(0, extrasIndex);
    }

    return msgs;
  }

  getMessages() {
    return this.messages;
  }
}