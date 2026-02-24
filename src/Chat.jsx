
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  Send,
  ArrowLeft,
  Bot,
  User,
  Sparkles,
  Loader2,
  FileCheck,
  Building2,
  Users,
  Briefcase,
  Home,
  Shield,
  FileSignature,
  ChevronRight,
  CheckCircle2,
  Clock,
  CreditCard,
} from "lucide-react";
import { generateContract } from './contractService';
import ContractViewer from './ContractViewer';

// ==================== CONTRACT TYPES de todos ====================
const contractTypes = [
  {
    id: "prestacao-servicos",
    name: "Prestação de Serviços",
    icon: Briefcase,
    description: "Ideal para freelancers e prestadores de serviço",
    popular: true,
    questions: [
      { id: "contratante_nome", question: "Nome completo do CONTRATANTE (quem vai pagar)?", type: "text" },
      { id: "contratante_cpf_cnpj", question: "CPF ou CNPJ do CONTRATANTE?", type: "text" },
      { id: "contratado_nome", question: "Nome completo do CONTRATADO (prestador)?", type: "text" },
      { id: "contratado_cpf_cnpj", question: "CPF ou CNPJ do CONTRATADO?", type: "text" },
      { id: "descricao_servico", question: "Descreva detalhadamente o serviço:", type: "textarea" },
      { id: "valor_total", question: "Valor total do serviço? (Ex: R$ 5.000,00)", type: "text" },
      { id: "forma_pagamento", question: "Forma de pagamento?", type: "text" },
      { id: "prazo_execucao", question: "Prazo para execução? (Ex: 30 dias)", type: "text" },
      { id: "cidade", question: "Cidade onde o contrato será assinado?", type: "text" },
      { id: "estado", question: "Estado (UF)?", type: "text" },
    ],
  },
  {
    id: "aluguel",
    name: "Contrato de Aluguel",
    icon: Home,
    description: "Para locação de imóveis",
    popular: true,
    questions: [
      { id: "locador_nome", question: "Nome completo do LOCADOR (proprietário)?", type: "text" },
      { id: "locador_cpf_cnpj", question: "CPF ou CNPJ do LOCADOR?", type: "text" },
      { id: "locatario_nome", question: "Nome completo do LOCATÁRIO (inquilino)?", type: "text" },
      { id: "locatario_cpf_cnpj", question: "CPF ou CNPJ do LOCATÁRIO?", type: "text" },
      { id: "descricao_imovel", question: "Descreva o imóvel:", type: "textarea" },
      { id: "endereco_imovel", question: "Endereço completo do imóvel?", type: "text" },
      { id: "valor_aluguel", question: "Valor mensal do aluguel?", type: "text" },
      { id: "prazo_locacao", question: "Prazo da locação? (Ex: 12 meses)", type: "text" },
      { id: "cidade", question: "Cidade onde o contrato será assinado?", type: "text" },
      { id: "estado", question: "Estado (UF)?", type: "text" },
    ],
  },
  {
    id: "parceria",
    name: "Acordo de Parceria",
    icon: Users,
    description: "Para parcerias comerciais",
    popular: false,
    questions: [
      { id: "parte_a_nome", question: "Nome completo da PARTE A?", type: "text" },
      { id: "parte_a_cpf_cnpj", question: "CPF/CNPJ da PARTE A?", type: "text" },
      { id: "parte_b_nome", question: "Nome completo da PARTE B?", type: "text" },
      { id: "parte_b_cpf_cnpj", question: "CPF/CNPJ da PARTE B?", type: "text" },
      { id: "objeto_parceria", question: "Objeto da parceria:", type: "textarea" },
      { id: "contribuicao_a", question: "Contribuição da PARTE A?", type: "text" },
      { id: "contribuicao_b", question: "Contribuição da PARTE B?", type: "text" },
      { id: "participacao_resultados", question: "Divisão dos resultados? (ex: 50%/50%)", type: "text" },
      { id: "prazo_parceria", question: "Prazo da parceria?", type: "text" },
      { id: "cidade", question: "Cidade onde o contrato será assinado?", type: "text" },
      { id: "estado", question: "Estado (UF)?", type: "text" },
    ],
  },
  {
    id: "confidencialidade",
    name: "Termo de Confidencialidade",
    icon: Shield,
    description: "Proteção de informações sigilosas",
    popular: true,
    questions: [
      { id: "revelador_nome", question: "Nome da parte REVELADORA?", type: "text" },
      { id: "revelador_cpf_cnpj", question: "CPF/CNPJ da parte REVELADORA?", type: "text" },
      { id: "receptor_nome", question: "Nome da parte RECEPTORA?", type: "text" },
      { id: "receptor_cpf_cnpj", question: "CPF/CNPJ da parte RECEPTORA?", type: "text" },
      { id: "informacoes_confidenciais", question: "Informações confidenciais?", type: "textarea" },
      { id: "prazo_confidencialidade", question: "Prazo de confidencialidade? (ex: 5 anos)", type: "text" },
      { id: "cidade", question: "Cidade onde o contrato será assinado?", type: "text" },
      { id: "estado", question: "Estado (UF)?", type: "text" },
    ],
  },
  {
    id: "trabalho-freelancer",
    name: "Contrato Freelancer",
    icon: FileSignature,
    description: "Para profissionais autônomos",
    popular: false,
    questions: [
      { id: "contratante_nome", question: "Nome do CONTRATANTE (cliente)?", type: "text" },
      { id: "contratante_cpf_cnpj", question: "CPF/CNPJ do CONTRATANTE?", type: "text" },
      { id: "freelancer_nome", question: "Nome do FREELANCER?", type: "text" },
      { id: "freelancer_cpf", question: "CPF do FREELANCER?", type: "text" },
      { id: "escopo_trabalho", question: "Escopo do trabalho:", type: "textarea" },
      { id: "valor_projeto", question: "Valor do projeto?", type: "text" },
      { id: "forma_pagamento", question: "Forma de pagamento?", type: "text" },
      { id: "prazo_entrega", question: "Prazo de entrega?", type: "text" },
      { id: "cidade", question: "Cidade onde o contrato será assinado?", type: "text" },
      { id: "estado", question: "Estado (UF)?", type: "text" },
    ],
  },
  {
    id: "compra-venda",
    name: "Compra e Venda",
    icon: Building2,
    description: "Para transações de bens",
    popular: false,
    questions: [
      { id: "vendedor_nome", question: "Nome do VENDEDOR?", type: "text" },
      { id: "vendedor_cpf_cnpj", question: "CPF/CNPJ do VENDEDOR?", type: "text" },
      { id: "comprador_nome", question: "Nome do COMPRADOR?", type: "text" },
      { id: "comprador_cpf_cnpj", question: "CPF/CNPJ do COMPRADOR?", type: "text" },
      { id: "descricao_bem", question: "Descrição do bem:", type: "textarea" },
      { id: "valor_venda", question: "Valor da venda?", type: "text" },
      { id: "forma_pagamento", question: "Forma de pagamento?", type: "text" },
      { id: "cidade", question: "Cidade onde o contrato será assinado?", type: "text" },
      { id: "estado", question: "Estado (UF)?", type: "text" },
    ],
  },
];

// ==================== CHAT HEADER ====================
const ChatHeader = ({ onBack }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 h-14 safe-top">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Contrate-me</span>
        </div>
        <div className="w-5" />
      </div>
    </header>
  );
};

// ==================== CONTRACT TYPE SELECTOR ====================
const ContractTypeSelector = ({ onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Passo 1 de 3
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Qual contrato você precisa?
        </h2>
        <p className="text-gray-600">
          Selecione o modelo ideal para sua necessidade
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {contractTypes.map((type, index) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(type)}
            className="relative p-4 rounded-xl border-2 border-gray-100 bg-white hover:border-emerald-200 hover:shadow-lg transition-all text-left group"
          >
            {type.popular && (
              <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                Popular
              </div>
            )}
            <div className="flex items-start gap-3 pr-8">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors flex items-center justify-center flex-shrink-0">
                <type.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{type.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{type.description}</p>
              </div>
            </div>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ==================== MESSAGE BUBBLE ====================
const MessageBubble = ({ message, isBot }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-[75%] p-3 rounded-2xl ${
          isBot
            ? 'bg-gray-100 text-gray-800 rounded-tl-none'
            : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-tr-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
};

// ==================== TYPING INDICATOR ====================
const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
        </div>
      </div>
    </motion.div>
  );
};

// ==================== CHAT INPUT ====================
const ChatInput = ({ value, onChange, onSend, disabled, placeholder }) => {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  return (
    <div className="border-t border-gray-200 bg-white p-3 pb-safe-bottom">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-end gap-2 bg-gray-50 rounded-xl p-2 border border-gray-200">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Digite sua resposta..."}
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent px-3 py-2 text-gray-900 resize-none outline-none min-h-[40px] max-h-[120px] text-base disabled:opacity-50"
          />
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== PROGRESS SIDEBAR ====================
const ProgressSidebar = ({ currentStep, contractType }) => {
  const steps = [
    { id: 1, name: "Tipo", icon: FileCheck },
    { id: 2, name: "Dados", icon: Users },
    { id: 3, name: "Contrato", icon: FileText },
  ];

  if (currentStep === 4) return null;

  return (
    <div className="hidden lg:block w-72 fixed left-0 top-14 bottom-0 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Seu Contrato</h3>
        {contractType ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
            <contractType.icon className="w-5 h-5 text-emerald-400" />
            <span className="text-sm truncate">{contractType.name}</span>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Selecione um tipo</p>
        )}
      </div>

      <div>
        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Progresso</h4>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep > step.id
                    ? 'bg-emerald-500'
                    : currentStep === step.id
                    ? 'bg-emerald-500/20 ring-2 ring-emerald-500'
                    : 'bg-white/10'
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <step.icon className={`w-5 h-5 ${currentStep === step.id ? 'text-emerald-400' : 'text-gray-400'}`} />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-white' : 'text-gray-400'}`}>
                  {step.name}
                </p>
                {currentStep === step.id && (
                  <p className="text-xs text-emerald-400">Em andamento</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 text-emerald-400 mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Tempo estimado</span>
        </div>
        <p className="text-2xl font-bold">~2 min</p>
      </div>
    </div>
  );
};

// ==================== CHAT INTERFACE ====================
const ChatInterface = ({ contractType, messages, isTyping, inputValue, setInputValue, onSendMessage }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const currentQuestion = contractType.questions[messages.filter(m => !m.isBot).length];

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header Info */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 p-3 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
            <contractType.icon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{contractType.name}</h3>
            <p className="text-xs text-gray-500">
              Pergunta {messages.filter(m => !m.isBot).length + 1} de {contractType.questions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 pb-20"
      >
        <div className="max-w-2xl mx-auto space-y-3">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg.text} isBot={msg.isBot} />
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={onSendMessage}
        disabled={isTyping}
        placeholder={currentQuestion?.question}
      />
    </div>
  );
};

// ==================== LOADING SCREEN ====================
const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="w-6 h-6 text-emerald-600 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-600 font-medium">Gerando seu contrato</p>
        <p className="text-sm text-gray-400 mt-1">Aguarde um momento...</p>
      </div>
    </div>
  );
};

// ==================== MAIN CHAT PAGE ====================
const Chat = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedContract, setSelectedContract] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [generatedContract, setGeneratedContract] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  // Fix for mobile viewport
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const handleGenerateContract = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setCurrentStep(3);
    
    const answersObject = {};
    const questions = selectedContract.questions;
    answers.forEach((answer, index) => {
      if (questions[index]) {
        answersObject[questions[index].id] = answer;
      }
    });
    
    const result = await generateContract(selectedContract.id, answersObject);
    
    if (result.success) {
      setGeneratedContract(result.contract);
      setCurrentStep(4);
    } else {
      setGenerationError(result.error);
      setCurrentStep(2);
      setMessages((prev) => [
        ...prev,
        {
          text: `❌ Erro: ${result.error}. Tente novamente.`,
          isBot: true,
        },
      ]);
    }
    setIsGenerating(false);
  };

  const handleSelectContract = (type) => {
    setSelectedContract(type);
    setCurrentStep(2);
    setTimeout(() => {
      setMessages([
        {
          text: `Ótima escolha! Vou ajudar com seu ${type.name}.\n\nVou fazer algumas perguntas para personalizar seu contrato.`,
          isBot: true,
        },
      ]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { text: type.questions[0].question, isBot: true },
        ]);
      }, 1500);
    }, 500);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setAnswers((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    const questions = selectedContract.questions;
    const nextIndex = answers.length + 1;
    
    setTimeout(async () => {
      setIsTyping(false);
      if (nextIndex < questions.length) {
        setMessages((prev) => [
          ...prev,
          { text: questions[nextIndex].question, isBot: true },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: `✅ Todas as informações foram coletadas!\n\nGerando seu contrato...`,
            isBot: true,
          },
        ]);
        await handleGenerateContract();
      }
    }, 1000);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      window.location.href = "/";
    } else {
      setCurrentStep(1);
      setSelectedContract(null);
      setMessages([]);
      setAnswers([]);
      setCurrentQuestionIndex(0);
      setGeneratedContract(null);
      setGenerationError(null);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-gray-50">
      <ChatHeader onBack={handleBack} />
      <ProgressSidebar currentStep={currentStep} contractType={selectedContract} />

      <main className="flex-1 pt-14 lg:pl-72 flex flex-col min-h-0 overflow-hidden">
        {currentStep === 1 && (
          <div className="flex-1 overflow-y-auto">
            <ContractTypeSelector onSelect={handleSelectContract} />
          </div>
        )}

        {currentStep === 2 && selectedContract && (
          <ChatInterface
            contractType={selectedContract}
            messages={messages}
            isTyping={isTyping}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
          />
        )}

        {currentStep === 3 && <LoadingScreen />}

        {currentStep === 4 && generatedContract && (
          <ContractViewer
            contract={generatedContract}
            contractType={selectedContract}
            onBack={handleBack}
            onDownload={(format) => {
              console.log(`Download ${format}:`, generatedContract);
              alert(`Download em ${format} será implementado em breve!`);
            }}
          />
        )}

        {generationError && currentStep === 2 && (
          <div className="fixed bottom-20 left-4 right-4 lg:left-80 lg:right-4 z-50">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto shadow-lg">
              <p className="text-sm text-red-800">{generationError}</p>
              <button
                onClick={() => setGenerationError(null)}
                className="mt-2 text-sm text-red-600 underline"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;