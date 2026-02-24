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
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #f3f4f6",
        height: 56,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div
        style={{
          maxWidth: 1024,
          margin: "0 auto",
          padding: "0 16px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#6b7280",
            textDecoration: "none",
          }}
        >
          <ArrowLeft style={{ width: 20, height: 20 }} />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #10b981, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText style={{ width: 16, height: 16, color: "#fff" }} />
          </div>
          <span style={{ fontWeight: 700, color: "#111827" }}>Contrate-me</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#6b7280" }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#10b981",
              animation: "pulse 2s infinite",
            }}
          />
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
      style={{ width: "100%", maxWidth: 896, margin: "0 auto" }}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 9999,
            backgroundColor: "#ecfdf5",
            color: "#047857",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          <Sparkles style={{ width: 16, height: 16 }} />
          Passo 1 de 3
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
          Qual tipo de contrato você precisa?
        </h2>
        <p style={{ color: "#6b7280" }}>
          Selecione o modelo que melhor se adapta à sua necessidade
        </p>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        {contractTypes.map((type, index) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(type)}
            style={{
              position: "relative",
              padding: 16,
              borderRadius: 16,
              border: "2px solid #f3f4f6",
              backgroundColor: "#fff",
              textAlign: "left",
              minHeight: 80,
              cursor: "pointer",
              overflow: "visible",
            }}
          >
            {type.popular && (
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  right: 16,
                  padding: "4px 12px",
                  background: "linear-gradient(90deg, #f59e0b, #f97316)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: 9999,
                }}
              >
                Popular
              </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, paddingRight: 24 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #ecfdf5, #f0fdfa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <type.icon style={{ width: 20, height: 20, color: "#059669" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 600, color: "#111827", marginBottom: 4, wordBreak: "break-word" }}>
                  {type.name}
                </h3>
                <p style={{ fontSize: 14, color: "#6b7280", wordBreak: "break-word" }}>{type.description}</p>
              </div>
            </div>
            <ChevronRight
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                width: 20,
                height: 20,
                color: "#d1d5db",
                flexShrink: 0,
              }}
            />
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
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        justifyContent: isBot ? "flex-start" : "flex-end",
        width: "100%",
      }}
    >
      {isBot && (
        <div
          style={{
            width: 32,
            height: 32,
            minWidth: 32,
            minHeight: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #0d9488)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Bot style={{ width: 16, height: 16, color: "#fff" }} />
        </div>
      )}
      <div
        style={{
          maxWidth: "75%",
          padding: "10px 14px",
          borderRadius: 16,
          borderTopLeftRadius: isBot ? 4 : 16,
          borderTopRightRadius: isBot ? 16 : 4,
          backgroundColor: isBot ? "#f3f4f6" : undefined,
          background: isBot ? "#f3f4f6" : "linear-gradient(90deg, #059669, #0d9488)",
          color: isBot ? "#1f2937" : "#fff",
        }}
      >
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: 0,
          }}
        >
          {message}
        </p>
      </div>
      {!isBot && (
        <div
          style={{
            width: 32,
            height: 32,
            minWidth: 32,
            minHeight: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #334155, #0f172a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <User style={{ width: 16, height: 16, color: "#fff" }} />
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
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          minWidth: 32,
          minHeight: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #10b981, #0d9488)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Bot style={{ width: 16, height: 16, color: "#fff" }} />
      </div>
      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "10px 14px",
          borderRadius: 16,
          borderTopLeftRadius: 4,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <motion.div
            style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#9ca3af" }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
          />
          <motion.div
            style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#9ca3af" }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
          />
          <motion.div
            style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#9ca3af" }}
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
    <div
      style={{
        borderTop: "1px solid #f3f4f6",
        backgroundColor: "#fff",
        padding: 12,
        paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: 768, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            backgroundColor: "#f9fafb",
            borderRadius: 16,
            padding: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua resposta..."
            disabled={disabled}
            rows={1}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              padding: "8px 12px",
              color: "#1f2937",
              resize: "none",
              border: "none",
              outline: "none",
              minHeight: 40,
              maxHeight: 128,
              overflowY: "auto",
              fontSize: 16,
              lineHeight: 1.5,
              WebkitAppearance: "none",
            }}
          />
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            style={{
              flexShrink: 0,
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              borderRadius: 12,
              background: "linear-gradient(90deg, #059669, #0d9488)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
              opacity: disabled || !value.trim() ? 0.5 : 1,
              WebkitAppearance: "none",
              appearance: "none",
            }}
          >
            {disabled ? (
              <Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} />
            ) : (
              <Send style={{ width: 20, height: 20 }} />
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
    { id: 1, name: "Tipo de Contrato", icon: FileCheck },
    { id: 2, name: "Informações", icon: Users },
    { id: 3, name: "Pagamento", icon: CreditCard },
  ];

  return (
    <div
      style={{
        display: "none",
      }}
      className="lg:!flex lg:flex-col"
    >
      <div
        style={{
          width: 288,
          background: "linear-gradient(180deg, #0f172a, #1e293b)",
          color: "#fff",
          padding: 24,
          position: "fixed",
          left: 0,
          top: 56,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Seu Contrato</h3>
          {contractType ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 12,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              <contractType.icon style={{ width: 20, height: 20, color: "#34d399" }} />
              <span style={{ fontSize: 14 }}>{contractType.name}</span>
            </div>
          ) : (
            <p style={{ fontSize: 14, color: "#9ca3af" }}>Selecione um tipo</p>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 16,
            }}
          >
            Progresso
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {steps.map((step) => (
              <div key={step.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      currentStep > step.id
                        ? "#10b981"
                        : currentStep === step.id
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(255,255,255,0.1)",
                    outline: currentStep === step.id ? "2px solid #10b981" : "none",
                  }}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 style={{ width: 20, height: 20, color: "#fff" }} />
                  ) : (
                    <step.icon
                      style={{
                        width: 20,
                        height: 20,
                        color: currentStep === step.id ? "#34d399" : "#9ca3af",
                      }}
                    />
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: currentStep >= step.id ? "#fff" : "#9ca3af",
                    }}
                  >
                    {step.name}
                  </p>
                  {currentStep === step.id && (
                    <p style={{ fontSize: 12, color: "#34d399" }}>Em andamento</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#34d399", marginBottom: 8 }}>
            <Clock style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>Tempo estimado</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 700 }}>~2 min</p>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {/* Chat Header Info */}
      <div
        style={{
          background: "linear-gradient(90deg, #ecfdf5, #f0fdfa)",
          borderBottom: "1px solid #d1fae5",
          padding: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: 768,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                minWidth: 36,
                borderRadius: 12,
                background: "linear-gradient(135deg, #10b981, #0d9488)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <contractType.icon style={{ width: 18, height: 18, color: "#fff" }} />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: 14, color: "#111827", margin: 0 }}>{contractType.name}</h3>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Passo 2 de 3 • Coletando informações</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          minHeight: 0,
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ maxWidth: 768, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12, paddingTop: 8, paddingBottom: 16 }}>
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

  // Fix for mobile viewport height - only set once on load, not on keyboard open
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", vh + "px");
    };
    setVh();
    // Only update on orientation change, NOT on resize (keyboard)
    window.addEventListener("orientationchange", () => {
      setTimeout(setVh, 100);
    });
    return () => {
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

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
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#f9fafb",
      }}
    >
      <ChatHeader />
      <ProgressSidebar currentStep={currentStep} contractType={selectedContract} />

      <main
        style={{
          flex: 1,
          paddingTop: 56,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
        className="lg:pl-72"
      >
        {currentStep === 1 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: 16,
              overflowY: "auto",
            }}
          >
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
