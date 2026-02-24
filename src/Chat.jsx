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
// ==================== CONTRACT TYPES ====================
const contractTypes = [
  {
    id: "prestacao-servicos",
    name: "Prestação de Serviços",
    icon: Briefcase,
    description: "Ideal para freelancers e prestadores de serviço",
    popular: true,
  },
  {
    id: "aluguel",
    name: "Contrato de Aluguel",
    icon: Home,
    description: "Para locação de imóveis residenciais ou comerciais",
    popular: false,
  },
  {
    id: "parceria",
    name: "Acordo de Parceria",
    icon: Users,
    description: "Para parcerias comerciais e joint ventures",
    popular: false,
  },
  {
    id: "confidencialidade",
    name: "Termo de Confidencialidade (NDA)",
    icon: Shield,
    description: "Proteção de informações sigilosas",
    popular: true,
  },
  {
    id: "trabalho-freelancer",
    name: "Contrato Freelancer",
    icon: FileSignature,
    description: "Para contratação de profissionais autônomos",
    popular: false,
  },
  {
    id: "compra-venda",
    name: "Compra e Venda",
    icon: Building2,
    description: "Para transações de bens móveis ou imóveis",
    popular: false,
  },
];
// ==================== CHAT HEADER ====================
const ChatHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 h-14 sm:h-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Contrate-me</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">IA Online</span>
          </div>
        </div>
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
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Passo 1 de 3
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Qual tipo de contrato você precisa?
        </h2>
        <p className="text-gray-600">
          Selecione o modelo que melhor se adapta à sua necessidade
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {contractTypes.map((type, index) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(type)}
            className="group relative p-4 sm:p-5 rounded-2xl border-2 border-gray-100 bg-white hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 text-left min-h-[80px] overflow-visible"
          >
            {type.popular && (
              <div className="absolute -top-2.5 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                Popular
              </div>
            )}
            <div className="flex items-start gap-3 pr-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center flex-shrink-0 group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors">
                <type.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors break-words">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-500 break-words">{type.description}</p>
              </div>
            </div>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
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
      className={`flex gap-2 sm:gap-3 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      )}
      <div
        className={`max-w-[75%] sm:max-w-[80%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl ${
          isBot
            ? "bg-gray-100 text-gray-800 rounded-tl-md"
            : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-md"
        }`}
      >
        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
          {message}
        </p>
      </div>
      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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
      className="flex gap-2 sm:gap-3 justify-start"
    >
      <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <div className="bg-gray-100 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl rounded-tl-md">
        <div className="flex gap-1.5">
          <motion.div
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
};
// ==================== CHAT INPUT ====================
const ChatInput = ({ value, onChange, onSend, disabled }) => {
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
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <div className="border-t border-gray-100 bg-white p-3 sm:p-4 flex-shrink-0" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua resposta..."
            disabled={disabled}
            rows={1}
            style={{ fontSize: "16px" }}
            className="flex-1 bg-transparent px-2 sm:px-3 py-2 text-gray-800 placeholder-gray-400 resize-none focus:outline-none min-h-[40px] max-h-32 overflow-y-auto"
          />
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2 hidden sm:block">
          Pressione Enter para enviar • Shift + Enter para nova linha
        </p>
      </div>
    </div>
  );
};
// ==================== PROGRESS SIDEBAR ====================
const ProgressSidebar = ({ currentStep, contractType }) => {
  const steps = [
    { id: 1, name: "Tipo de Contrato", icon: FileCheck },
    { id: 2, name: "Informações", icon: Users },
    { id: 3, name: "Pagamento", icon: CreditCard },
  ];
  return (
    <div className="hidden lg:flex lg:flex-col w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 fixed left-0 top-16 bottom-0">
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Seu Contrato</h3>
        {contractType ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
            <contractType.icon className="w-5 h-5 text-emerald-400" />
            <span className="text-sm">{contractType.name}</span>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Selecione um tipo</p>
        )}
      </div>
      <div className="space-y-4 flex-1">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Progresso
        </h4>
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep > step.id
                  ? "bg-emerald-500"
                  : currentStep === step.id
                  ? "bg-emerald-500/20 ring-2 ring-emerald-500"
                  : "bg-white/10"
              }`}
            >
              {currentStep > step.id ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <step.icon
                  className={`w-5 h-5 ${
                    currentStep === step.id ? "text-emerald-400" : "text-gray-400"
                  }`}
                />
              )}
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  currentStep >= step.id ? "text-white" : "text-gray-400"
                }`}
              >
                {step.name}
              </p>
              {currentStep === step.id && (
                <p className="text-xs text-emerald-400">Em andamento</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Tempo estimado</span>
          </div>
          <p className="text-2xl font-bold">~2 min</p>
          <p className="text-xs text-gray-400 mt-1">
            Para completar seu contrato
          </p>
        </div>
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
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header Info */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 p-3 sm:p-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <contractType.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">{contractType.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500">Passo 2 de 3 • Coletando informações</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm">
            <Sparkles className="w-4 h-4" />
            IA Ativa
          </div>
        </div>
      </div>
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 min-h-0"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 pt-2 pb-4">
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
      />
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
  const contractQuestions = {
    "prestacao-servicos": [
      "Qual é o nome completo ou razão social do CONTRATANTE (quem vai pagar pelo serviço)?",
      "Qual é o CPF ou CNPJ do CONTRATANTE?",
      "Qual é o nome completo ou razão social do CONTRATADO (quem vai prestar o serviço)?",
      "Qual é o CPF ou CNPJ do CONTRATADO?",
      "Descreva brevemente o serviço que será prestado:",
      "Qual será o valor total do serviço? (Ex: R$ 5.000,00)",
      "Qual será a forma de pagamento? (Ex: 50% na assinatura e 50% na entrega)",
      "Qual será o prazo para execução do serviço? (Ex: 30 dias)",
    ],
    default: [
      "Qual é o nome completo da primeira parte envolvida?",
      "Qual é o CPF/CNPJ da primeira parte?",
      "Qual é o nome completo da segunda parte envolvida?",
      "Qual é o CPF/CNPJ da segunda parte?",
      "Descreva o objeto principal deste contrato:",
      "Qual será o valor envolvido neste contrato?",
      "Qual será o prazo de vigência?",
    ],
  };
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const handleSelectContract = (type) => {
    setSelectedContract(type);
    setCurrentStep(2);
    const questions = contractQuestions[type.id] || contractQuestions.default;
    setTimeout(() => {
      setMessages([
        {
          text: `Ótima escolha! Vou te ajudar a criar um ${type.name}.\n\nVou fazer algumas perguntas para personalizar seu contrato. Responda com calma, você pode revisar tudo no final. 😊`,
          isBot: true,
        },
      ]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { text: questions[0], isBot: true },
        ]);
      }, 1500);
    }, 500);
  };
  const handleSendMessage = () => {
    if (!inputValue.trim() || isTyping) return;
    const userMessage = inputValue.trim();
    const newMessages = [...messages, { text: userMessage, isBot: false }];
    setMessages(newMessages);
    setAnswers((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    const questions =
      contractQuestions[selectedContract?.id] || contractQuestions.default;
    const nextIndex = currentQuestionIndex + 1;
    setTimeout(() => {
      setIsTyping(false);
      if (nextIndex < questions.length) {
        setMessages((prev) => [
          ...prev,
          { text: questions[nextIndex], isBot: true },
        ]);
        setCurrentQuestionIndex(nextIndex);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: `Perfeito! Coletei todas as informações necessárias. ✅\n\nSeu contrato de ${selectedContract.name} está sendo gerado pela nossa IA...\n\nEm breve você poderá revisar e fazer o pagamento via Pix para baixar o documento final.`,
            isBot: true,
          },
        ]);
        setCurrentStep(3);
      }
    }, 1500);
  };
  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-gray-50">
      <ChatHeader />
      <ProgressSidebar currentStep={currentStep} contractType={selectedContract} />
      <main className="flex-1 pt-14 sm:pt-16 lg:pl-72 flex flex-col min-h-0 overflow-hidden">
        {currentStep === 1 ? (
          <div className="flex-1 flex items-start sm:items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <ContractTypeSelector onSelect={handleSelectContract} />
          </div>
        ) : (
          <ChatInterface
            contractType={selectedContract}
            messages={messages}
            isTyping={isTyping}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
          />
        )}
      </main>
    </div>
  );
};
export default Chat;