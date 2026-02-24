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

// ==================== CONTRACT TYPES ====================
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

// ==================== GLOBAL STYLES ====================
const GlobalStyle = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-4px); }
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
  
  return null;
};

// ==================== CHAT HEADER ====================
const ChatHeader = ({ onBack }) => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #e5e7eb',
      height: '56px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#4b5563',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={16} color="white" />
          </div>
          <span style={{ fontWeight: 'bold', color: '#111827' }}>Contrate-me</span>
        </div>
        <div style={{ width: '20px' }} />
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
      style={{
        width: '100%',
        maxWidth: '1024px',
        margin: '0 auto',
        padding: '16px'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '9999px',
          backgroundColor: '#ecfdf5',
          color: '#047857',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '16px'
        }}>
          <Sparkles size={16} />
          Passo 1 de 3
        </div>
        <h2 style={{
          fontSize: 'clamp(24px, 5vw, 36px)',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '8px'
        }}>
          Qual contrato você precisa?
        </h2>
        <p style={{ color: '#4b5563' }}>
          Selecione o modelo ideal para sua necessidade
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px'
      }}>
        {contractTypes.map((type, index) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(type)}
            style={{
              position: 'relative',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #f3f4f6',
              backgroundColor: 'white',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#a7f3d0';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#f3f4f6';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {type.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '16px',
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                borderRadius: '9999px',
                zIndex: 10
              }}>
                Popular
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <type.icon size={20} color="#059669" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{type.name}</h3>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>{type.description}</p>
              </div>
            </div>
            <ChevronRight size={20} style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
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
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '0 8px',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        width: '100%'
      }}
    >
      {isBot && (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <Bot size={18} color="white" />
        </div>
      )}
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '18px',
        backgroundColor: isBot ? '#ffffff' : '#10b981',
        color: isBot ? '#1f2937' : '#ffffff',
        borderBottomLeftRadius: isBot ? '4px' : '18px',
        borderBottomRightRadius: isBot ? '18px' : '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        border: isBot ? '1px solid #e5e7eb' : 'none',
        wordBreak: 'break-word'
      }}>
        <p style={{
          fontSize: '15px',
          lineHeight: '1.5',
          margin: 0,
          whiteSpace: 'pre-wrap'
        }}>{message}</p>
      </div>
      {!isBot && (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #374151, #111827)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <User size={18} color="white" />
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
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '0 8px'
      }}
    >
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        <Bot size={18} color="white" />
      </div>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '12px 16px',
        borderRadius: '18px',
        borderBottomLeftRadius: '4px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#9ca3af',
            borderRadius: '50%',
            animation: 'bounce 1s infinite'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#9ca3af',
            borderRadius: '50%',
            animation: 'bounce 1s infinite',
            animationDelay: '0.15s'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#9ca3af',
            borderRadius: '50%',
            animation: 'bounce 1s infinite',
            animationDelay: '0.3s'
          }} />
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
    <div style={{
      borderTop: '1px solid #e5e7eb',
      backgroundColor: 'white',
      padding: '12px',
      boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)'
    }}>
      <div style={{ maxWidth: '672px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          backgroundColor: '#f9fafb',
          borderRadius: '20px',
          padding: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Digite sua resposta..."}
            disabled={disabled}
            rows={1}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              padding: '10px 12px',
              color: '#111827',
              resize: 'none',
              outline: 'none',
              minHeight: '44px',
              maxHeight: '120px',
              fontSize: '16px',
              border: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            style={{
              flexShrink: 0,
              width: '44px',
              height: '44px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
              opacity: disabled || !value.trim() ? 0.5 : 1,
              transition: 'all 0.2s ease'
            }}
            aria-label="Enviar mensagem"
          >
            {disabled ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Send size={20} />
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
    <div className="hidden lg:block" style={{
      width: '288px',
      position: 'fixed',
      left: 0,
      top: '56px',
      bottom: 0,
      background: 'linear-gradient(135deg, #111827, #1f2937)',
      color: 'white',
      padding: '24px',
      overflowY: 'auto'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Seu Contrato</h3>
        {contractType ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}>
            <contractType.icon size={20} color="#34d399" />
            <span style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {contractType.name}
            </span>
          </div>
        ) : (
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>Selecione um tipo</p>
        )}
      </div>

      <div>
        <h4 style={{
          fontSize: '12px',
          fontWeight: '500',
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '16px'
        }}>Progresso</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((step) => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: currentStep > step.id ? '#10b981' : 
                                 currentStep === step.id ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                border: currentStep === step.id ? '2px solid #10b981' : 'none'
              }}>
                {currentStep > step.id ? (
                  <CheckCircle2 size={20} color="white" />
                ) : (
                  <step.icon size={20} color={currentStep === step.id ? '#34d399' : '#9ca3af'} />
                )}
              </div>
              <div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: currentStep >= step.id ? 'white' : '#9ca3af'
                }}>
                  {step.name}
                </p>
                {currentStep === step.id && (
                  <p style={{ fontSize: '12px', color: '#34d399' }}>Em andamento</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        right: '24px',
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', marginBottom: '8px' }}>
          <Clock size={16} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Tempo estimado</span>
        </div>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>~2 min</p>
      </div>
    </div>
  );
};

// ==================== CHAT INTERFACE ====================
const ChatInterface = ({ contractType, messages, isTyping, inputValue, setInputValue, onSendMessage }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const currentQuestion = contractType.questions[messages.filter(m => !m.isBot).length];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#f3f4f6',
      position: 'relative'
    }}>
      {/* Chat Header Info */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        zIndex: 5
      }}>
        <div style={{ maxWidth: '672px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            <contractType.icon size={18} color="white" />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{
              fontWeight: '600',
              color: '#111827',
              fontSize: '15px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>{contractType.name}</h3>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>
              Pergunta {messages.filter(m => !m.isBot).length + 1} de {contractType.questions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '16px 8px 20px 8px'
        }}
      >
        <div style={{
          maxWidth: '672px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
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
      <div style={{
        flexShrink: 0,
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        zIndex: 10
      }}>
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={onSendMessage}
          disabled={isTyping}
          placeholder={currentQuestion?.question}
        />
      </div>
    </div>
  );
};

// ==================== LOADING SCREEN ====================
const LoadingScreen = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #d1fae5',
            borderTopColor: '#059669',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            position: 'absolute',
            top: 0,
            left: 0
          }} />
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={24} color="#059669" style={{ animation: 'pulse 2s infinite' }} />
          </div>
        </div>
        <p style={{ color: '#4b5563', fontWeight: '500' }}>Gerando seu contrato</p>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Aguarde um momento...</p>
      </div>
    </div>
  );
};

// ==================== CONTRACT VIEWER WRAPPER ====================
const ContractViewerWrapper = ({ contract, contractType, onBack, onDownload }) => {
  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      backgroundColor: '#f9fafb',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div style={{
        maxWidth: '1024px',
        margin: '0 auto',
        padding: '24px 16px'
      }}>
        <ContractViewer
          contract={contract}
          contractType={contractType}
          onBack={onBack}
          onDownload={onDownload}
        />
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
  const [answers, setAnswers] = useState([]);
  const [generatedContract, setGeneratedContract] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Adicionar estilos globais
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-4px); }
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Fix para mobile viewport
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  // Monitorar largura da janela para sidebar
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGenerateContract = async () => {
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
  };

  const handleSelectContract = (type) => {
    setSelectedContract(type);
    setCurrentStep(2);
    setMessages([]);
    setAnswers([]);
    
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
      setGeneratedContract(null);
      setGenerationError(null);
    }
  };

  const isDesktop = windowWidth >= 1024;

  return (
    <div style={{
      height: 'calc(var(--vh, 1vh) * 100)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: '#f9fafb',
      position: 'relative'
    }}>
      <ChatHeader onBack={handleBack} />
      
      {isDesktop && currentStep !== 4 && (
        <ProgressSidebar currentStep={currentStep} contractType={selectedContract} />
      )}

      <main style={{
        flex: 1,
        paddingTop: '56px',
        marginLeft: isDesktop && currentStep !== 4 ? '288px' : 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {currentStep === 1 && (
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            WebkitOverflowScrolling: 'touch',
            height: '100%'
          }}>
            <ContractTypeSelector onSelect={handleSelectContract} />
          </div>
        )}

        {currentStep === 2 && selectedContract && (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: 0,
            height: '100%'
          }}>
            <ChatInterface
              contractType={selectedContract}
              messages={messages}
              isTyping={isTyping}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSendMessage={handleSendMessage}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%'
          }}>
            <LoadingScreen />
          </div>
        )}

        {currentStep === 4 && generatedContract && (
          <div style={{ 
            flex: 1, 
            overflow: 'hidden',
            height: '100%'
          }}>
            <ContractViewerWrapper
              contract={generatedContract}
              contractType={selectedContract}
              onBack={handleBack}
              onDownload={(format) => {
                console.log(`Download ${format}:`, generatedContract);
                alert(`Download em ${format} será implementado em breve!`);
              }}
            />
          </div>
        )}

        {generationError && currentStep === 2 && (
          <div style={{
            position: 'fixed',
            bottom: '80px',
            left: isDesktop ? 'calc(288px + 16px)' : '16px',
            right: '16px',
            zIndex: 50,
            maxWidth: '448px',
            margin: '0 auto'
          }}>
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '14px', color: '#991b1b' }}>{generationError}</p>
              <button
                onClick={() => setGenerationError(null)}
                style={{
                  marginTop: '8px',
                  fontSize: '14px',
                  color: '#991b1b',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
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