import {
  sendMessageToIA,
  getInitialPrompt,
  generateContractFromConversation,
  FIELD_ORDER_BY_CONTRACT
} from './config/api';

export class ChatService {
  constructor(contractType) {
    this.contractType = contractType;
    this.messages = [];
    this.isComplete = false;
    this.askedForExtras = false;
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
    this.messages.push({ role: 'user', content: userMessage });

    try {
      const nextQuestion = await sendMessageToIA(this.messages, this.contractType);
      this.messages.push({ role: 'assistant', content: nextQuestion });

      // Marca se a IA perguntou sobre adicionar mais
      if (!this.askedForExtras && this.checkAskedForExtras(nextQuestion)) {
        this.askedForExtras = true;
      }

      // Só conclui se:
      // 1. A IA já perguntou "deseja adicionar mais?" (askedForExtras = true)
      // 2. E a resposta atual da IA confirma que vai gerar
      // 3. E o número mínimo de respostas do usuário foi atingido
      if (this.askedForExtras && this.checkIfComplete(nextQuestion) && this.hasMinimumAnswers()) {
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

  // Verifica se o usuário deu respostas suficientes (pelo menos 80% dos campos)
  hasMinimumAnswers() {
    const totalFields = (FIELD_ORDER_BY_CONTRACT[this.contractType] || []).length;
    const userAnswers = this.messages.filter(m => m.role === 'user').length;
    // Subtrai 1 para descontar a resposta "não" ao "deseja adicionar mais?"
    const dataAnswers = userAnswers - 1;
    return dataAnswers >= Math.floor(totalFields * 0.8);
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
    ];
    const lower = aiMessage.toLowerCase();
    return indicators.some(i => lower.includes(i));
  }

  // Só encerra quando a IA diz explicitamente que vai gerar
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

  // Remove a troca "deseja adicionar mais?" + resposta final do usuário
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