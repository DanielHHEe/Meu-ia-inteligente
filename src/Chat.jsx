import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Send, Bot, User, Sparkles, Loader2,
  FileCheck, Building2, Users, Briefcase, Home, Shield,
  FileSignature, ChevronRight, CheckCircle2, Clock,
} from "lucide-react";
import { ChatService } from './chatService';
import ContractViewer from './ContractViewer';

// ==================== TYPING ====================
const TypingText = ({ text, onComplete, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return (
    <span>
      {displayedText}
      {!isComplete && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          style={{
            display: 'inline-block', width: '2px', height: '1.2em',
            backgroundColor: '#10b981', marginLeft: '2px', verticalAlign: 'middle'
          }}
        />
      )}
    </span>
  );
};

// ==================== CONTRACT TYPES ====================
const contractTypes = [
  {
    id: "prestacao-servicos",
    name: "Prestação de Serviços",
    icon: Briefcase,
    description: "Ideal para freelancers e prestadores de serviço",
    popular: true,
    questions: [
      { id: "contratante_nome",          question: "Qual o nome completo do CONTRATANTE (quem vai pagar pelo serviço)?",       type: "text" },
      { id: "contratante_cpf_cnpj",      question: "Qual o CPF ou CNPJ do CONTRATANTE?",                                       type: "text" },
      { id: "contratado_nome",           question: "Qual o nome completo do CONTRATADO (quem vai prestar o serviço)?",          type: "text" },
      { id: "contratado_cpf_cnpj",       question: "Qual o CPF ou CNPJ do CONTRATADO?",                                        type: "text" },
      { id: "descricao_servico",         question: "Descreva detalhadamente o serviço a ser prestado:",                         type: "textarea" },
      { id: "valor_total",               question: "Qual o valor total do serviço? (Ex: R$ 5.000,00)",                          type: "text" },
      { id: "forma_pagamento",           question: "Qual a forma de pagamento? (Ex: PIX à vista, 50% entrada + 50% entrega)",   type: "text" },
      { id: "prazo_execucao",            question: "Qual o prazo para execução do serviço? (Ex: 30 dias)",                      type: "text" },
      { id: "multa_atraso_contratado",   question: "Qual o percentual de multa por dia de atraso na entrega? (Ex: 0,5% ao dia)", type: "text" },
      { id: "multa_limite",              question: "Qual o limite máximo da multa por atraso? (Ex: 10% do valor total)",         type: "text" },
      { id: "multa_rescisao",            question: "Qual o percentual de multa por rescisão antecipada? (Ex: 20%)",             type: "text" },
      { id: "cidade",                    question: "Em qual cidade o contrato será assinado?",                                  type: "text" },
      { id: "estado",                    question: "Qual o Estado (UF)?",                                                       type: "text" },
    ],
  },
  {
    id: "aluguel",
    name: "Contrato de Aluguel",
    icon: Home,
    description: "Para locação de imóveis",
    popular: true,
    questions: [
      { id: "locador_nome",          question: "Qual o nome completo do LOCADOR (proprietário)?",                               type: "text" },
      { id: "locador_cpf_cnpj",      question: "Qual o CPF ou CNPJ do LOCADOR?",                                               type: "text" },
      { id: "locatario_nome",        question: "Qual o nome completo do LOCATÁRIO (inquilino)?",                                type: "text" },
      { id: "locatario_cpf_cnpj",    question: "Qual o CPF ou CNPJ do LOCATÁRIO?",                                             type: "text" },
      { id: "descricao_imovel",      question: "Descreva o imóvel (tipo, número de cômodos, características):",                 type: "textarea" },
      { id: "endereco_imovel",       question: "Qual o endereço completo do imóvel?",                                           type: "text" },
      { id: "valor_aluguel",         question: "Qual o valor mensal do aluguel?",                                               type: "text" },
      { id: "dia_vencimento",        question: "Qual o dia do mês para vencimento? (Ex: dia 10)",                               type: "text" },
      { id: "data_inicio",           question: "Qual a data de início da locação? (Ex: 01/04/2025)",                            type: "text" },
      { id: "prazo_locacao",         question: "Qual o prazo da locação em meses? (Ex: 12 meses)",                              type: "text" },
      { id: "multa_atraso",          question: "Qual o percentual de multa por atraso no pagamento? (Ex: 10%)",                 type: "text" },
      { id: "juros_atraso",          question: "Qual o percentual de juros ao mês por atraso? (Ex: 1% ao mês)",                 type: "text" },
      { id: "correcao_monetaria",    question: "Qual o índice de correção monetária anual? (Ex: IGPM, IPCA)",                   type: "text" },
      { id: "prazo_tolerancia",      question: "Qual o prazo de tolerância para pagamento em dias? (Ex: 5 dias)",               type: "text" },
      { id: "cidade",                question: "Em qual cidade o contrato será assinado?",                                      type: "text" },
      { id: "estado",                question: "Qual o Estado (UF)?",                                                          type: "text" },
    ],
  },
  {
    id: "parceria",
    name: "Acordo de Parceria",
    icon: Users,
    description: "Para parcerias comerciais",
    popular: false,
    questions: [
      { id: "parte_a_nome",            question: "Qual o nome completo da PARTE A?",                                            type: "text" },
      { id: "parte_a_cpf_cnpj",        question: "Qual o CPF/CNPJ da PARTE A?",                                                type: "text" },
      { id: "parte_b_nome",            question: "Qual o nome completo da PARTE B?",                                            type: "text" },
      { id: "parte_b_cpf_cnpj",        question: "Qual o CPF/CNPJ da PARTE B?",                                                type: "text" },
      { id: "objeto_parceria",         question: "Qual o objeto da parceria? (descreva o que será feito em conjunto)",          type: "textarea" },
      { id: "contribuicao_a",          question: "Qual a contribuição da PARTE A? (o que ela entra com)",                       type: "text" },
      { id: "contribuicao_b",          question: "Qual a contribuição da PARTE B? (o que ela entra com)",                       type: "text" },
      { id: "participacao_resultados", question: "Como será a divisão dos resultados? (Ex: 50%/50%)",                           type: "text" },
      { id: "prazo_parceria",          question: "Qual o prazo da parceria? (Ex: 12 meses, 2 anos, indeterminado)",             type: "text" },
      { id: "multa_descumprimento",    question: "Qual o percentual de multa por descumprimento das obrigações? (Ex: 10%)",     type: "text" },
      { id: "multa_rescisao",          question: "Qual o percentual de multa por rescisão antecipada? (Ex: 15%)",               type: "text" },
      { id: "cidade",                  question: "Em qual cidade o contrato será assinado?",                                    type: "text" },
      { id: "estado",                  question: "Qual o Estado (UF)?",                                                        type: "text" },
    ],
  },
  {
    id: "confidencialidade",
    name: "Termo de Confidencialidade",
    icon: Shield,
    description: "Proteção de informações sigilosas",
    popular: true,
    questions: [
      { id: "revelador_nome",            question: "Qual o nome completo da parte REVELADORA?",                                 type: "text" },
      { id: "revelador_cpf_cnpj",        question: "Qual o CPF/CNPJ da parte REVELADORA?",                                     type: "text" },
      { id: "receptor_nome",             question: "Qual o nome completo da parte RECEPTORA?",                                  type: "text" },
      { id: "receptor_cpf_cnpj",         question: "Qual o CPF/CNPJ da parte RECEPTORA?",                                      type: "text" },
      { id: "informacoes_confidenciais", question: "Quais informações serão consideradas confidenciais? Descreva:",              type: "textarea" },
      { id: "prazo_confidencialidade",   question: "Qual o prazo de confidencialidade? (Ex: 2 anos, 5 anos)",                   type: "text" },
      { id: "multa_violacao",            question: "Qual o valor da multa em caso de violação? (Ex: R$ 50.000,00)",             type: "text" },
      { id: "perdas_danos",              question: "Além da multa, haverá cobrança de perdas e danos? (Sim ou Não)",            type: "text" },
      { id: "cidade",                    question: "Em qual cidade o contrato será assinado?",                                  type: "text" },
      { id: "estado",                    question: "Qual o Estado (UF)?",                                                       type: "text" },
    ],
  },
  {
    id: "trabalho-freelancer",
    name: "Contrato Freelancer",
    icon: FileSignature,
    description: "Para profissionais autônomos",
    popular: false,
    questions: [
      { id: "contratante_nome",        question: "Qual o nome completo do CONTRATANTE (o cliente)?",                            type: "text" },
      { id: "contratante_cpf_cnpj",    question: "Qual o CPF/CNPJ do CONTRATANTE?",                                            type: "text" },
      { id: "freelancer_nome",         question: "Qual o nome completo do FREELANCER?",                                         type: "text" },
      { id: "freelancer_cpf",          question: "Qual o CPF do FREELANCER?",                                                   type: "text" },
      { id: "escopo_trabalho",         question: "Descreva detalhadamente o escopo do trabalho (o que será entregue):",          type: "textarea" },
      { id: "valor_projeto",           question: "Qual o valor total do projeto? (Ex: R$ 3.000,00)",                            type: "text" },
      { id: "forma_pagamento",         question: "Qual a forma de pagamento? (Ex: 50% na assinatura, 50% na entrega)",          type: "text" },
      { id: "prazo_entrega",           question: "Qual o prazo de entrega? (Ex: 30 dias após a assinatura)",                    type: "text" },
      { id: "multa_atraso_entrega",    question: "Multa por atraso na entrega pelo freelancer, por dia? (Ex: 0,5% ao dia)",     type: "text" },
      { id: "multa_atraso_pagamento",  question: "Multa por atraso no pagamento pelo contratante, por dia? (Ex: 0,5% ao dia)", type: "text" },
      { id: "multa_rescisao",          question: "Percentual de multa por rescisão antecipada? (Ex: 20%)",                      type: "text" },
      { id: "cidade",                  question: "Em qual cidade o contrato será assinado?",                                    type: "text" },
      { id: "estado",                  question: "Qual o Estado (UF)?",                                                        type: "text" },
    ],
  },
  {
    id: "compra-venda",
    name: "Compra e Venda",
    icon: Building2,
    description: "Para transações de bens",
    popular: false,
    questions: [
      { id: "vendedor_nome",           question: "Qual o nome completo do VENDEDOR?",                                           type: "text" },
      { id: "vendedor_cpf_cnpj",       question: "Qual o CPF/CNPJ do VENDEDOR?",                                               type: "text" },
      { id: "comprador_nome",          question: "Qual o nome completo do COMPRADOR?",                                          type: "text" },
      { id: "comprador_cpf_cnpj",      question: "Qual o CPF/CNPJ do COMPRADOR?",                                              type: "text" },
      { id: "descricao_bem",           question: "Descreva detalhadamente o bem sendo vendido:",                                 type: "textarea" },
      { id: "valor_venda",             question: "Qual o valor total da venda?",                                                type: "text" },
      { id: "forma_pagamento",         question: "Qual a forma de pagamento?",                                                  type: "text" },
      { id: "prazo_entrega_bem",       question: "Qual o prazo para entrega do bem? (Ex: na assinatura, 7 dias, 30 dias)",      type: "text" },
      { id: "multa_atraso_pagamento",  question: "Multa por atraso no pagamento, por dia? (Ex: 0,5% ao dia)",                  type: "text" },
      { id: "multa_desistencia",       question: "Percentual de multa por desistência/rescisão? (Ex: 20% do valor)",            type: "text" },
      { id: "cidade",                  question: "Em qual cidade o contrato será assinado?",                                    type: "text" },
      { id: "estado",                  question: "Qual o Estado (UF)?",                                                        type: "text" },
    ],
  },
];

// ==================== CONTRACT TYPE SELECTOR ====================
const ContractTypeSelector = ({ onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '24px 16px 32px' }}
  >
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '6px 14px', borderRadius: '9999px',
        backgroundColor: 'rgba(16,185,129,0.1)',
        border: '1px solid rgba(16,185,129,0.2)',
        color: '#10b981', fontSize: '12px', fontWeight: '600',
        letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px'
      }}>
        <Sparkles size={13} />
        Passo 1 de 3
      </div>
      <h2 style={{
        fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: '800',
        color: 'white', marginBottom: '8px', lineHeight: 1.15,
        letterSpacing: '-0.02em'
      }}>
        Qual contrato você precisa?
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
        Selecione o modelo ideal para sua necessidade
      </p>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '10px'
    }}>
      {contractTypes.map((type, index) => (
        <motion.button
          key={type.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.07 }}
          onClick={() => onSelect(type)}
          style={{
            position: 'relative', padding: '18px 16px', borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.07)',
            backgroundColor: 'rgba(255,255,255,0.03)',
            textAlign: 'left', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)';
            e.currentTarget.style.backgroundColor = 'rgba(16,185,129,0.06)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {type.popular && (
            <div style={{
              position: 'absolute', top: '-10px', right: '14px',
              padding: '3px 10px',
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              color: 'white', fontSize: '10px', fontWeight: '700',
              borderRadius: '9999px', letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>
              Popular
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingRight: '20px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <type.icon size={18} color="#10b981" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                fontWeight: '700', color: 'white', marginBottom: '4px', fontSize: '14px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {type.name}
              </h3>
              <p style={{
                fontSize: '12px', color: 'rgba(255,255,255,0.35)',
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
              }}>
                {type.description}
              </p>
            </div>
          </div>

          <ChevronRight size={15} style={{
            position: 'absolute', right: '14px', top: '50%',
            transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)'
          }} />
        </motion.button>
      ))}
    </div>
  </motion.div>
);

// ==================== GENERATING BUBBLE ====================
const GeneratingBubble = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px' }}
  >
    <div style={{
      width: '34px', height: '34px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, boxShadow: '0 0 16px rgba(16,185,129,0.3)'
    }}>
      <Bot size={16} color="white" />
    </div>
    <div style={{
      padding: '12px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px',
      backgroundColor: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', gap: '10px',
    }}>
      <div style={{
        width: '16px', height: '16px',
        border: '2px solid rgba(16,185,129,0.2)',
        borderTopColor: '#10b981', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', flexShrink: 0,
      }} />
      <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
        Gerando contrato...
      </span>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>aguarde</span>
    </div>
  </motion.div>
);

// ==================== PDF CARD ====================
// ⚠️ CORRIGIDO: agora abre o ContractViewer com gate de pagamento
// em vez de baixar o PDF diretamente
const PdfCard = ({ contractType, onOpenContractViewer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px' }}
    >
      <div style={{
        width: '34px', height: '34px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, boxShadow: '0 0 16px rgba(16,185,129,0.3)'
      }}>
        <Bot size={16} color="white" />
      </div>

      <div style={{ maxWidth: '340px' }}>
        {/* Success message */}
        <div style={{
          padding: '11px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px',
          backgroundColor: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.2)',
          fontSize: '14px', color: 'rgba(255,255,255,0.85)',
          marginBottom: '8px', lineHeight: '1.5',
        }}>
          ✅ Seu contrato foi gerado com sucesso! Clique abaixo para visualizar e baixar o PDF.
        </div>

        {/* Card que abre o ContractViewer */}
        <button
          onClick={onOpenContractViewer}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
        >
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', borderRadius: '14px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'border-color 0.2s, background-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)';
              e.currentTarget.style.backgroundColor = 'rgba(16,185,129,0.07)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
            }}
          >
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
            }}>
              <FileText size={20} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '13px', fontWeight: '600', color: 'white',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0,
              }}>
                {contractType?.name || 'Contrato'}.pdf
              </p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>
                Pagar R$ 19,90 via Pix para baixar
              </p>
            </div>
            <div style={{
              width: '26px', height: '26px', borderRadius: '8px',
              backgroundColor: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ChevronRight size={14} color="#f59e0b" />
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  );
};

// ==================== MESSAGE BUBBLE ====================
const MessageBubble = ({ message, isBot, isGenerating, isPdfCard, contractType, onOpenContractViewer, onTypingComplete }) => {
  if (isGenerating) return <GeneratingBubble />;

  // ⚠️ CORRIGIDO: passa onOpenContractViewer para o PdfCard
  if (isPdfCard) return (
    <PdfCard
      contractType={contractType}
      onOpenContractViewer={onOpenContractViewer}
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        padding: '0 8px',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        width: '100%'
      }}
    >
      {isBot && (
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, boxShadow: '0 0 16px rgba(16,185,129,0.3)'
        }}>
          <Bot size={16} color="white" />
        </div>
      )}

      <div style={{
        maxWidth: '75%', padding: '12px 16px', borderRadius: '18px',
        backgroundColor: isBot ? 'rgba(255,255,255,0.06)' : '#10b981',
        color: isBot ? 'rgba(255,255,255,0.85)' : 'white',
        borderBottomLeftRadius: isBot ? '4px' : '18px',
        borderBottomRightRadius: isBot ? '18px' : '4px',
        border: isBot ? '1px solid rgba(255,255,255,0.1)' : 'none',
        boxShadow: isBot ? 'none' : '0 4px 16px rgba(16,185,129,0.25)',
        wordBreak: 'break-word', fontSize: '14px', lineHeight: '1.55'
      }}>
        {isBot ? (
          <TypingText text={message} onComplete={onTypingComplete} speed={12} />
        ) : (
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message}</p>
        )}
      </div>

      {!isBot && (
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <User size={16} color="rgba(255,255,255,0.7)" />
        </div>
      )}
    </motion.div>
  );
};

// ==================== TYPING INDICATOR ====================
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px' }}
  >
    <div style={{
      width: '34px', height: '34px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, boxShadow: '0 0 16px rgba(16,185,129,0.3)'
    }}>
      <Bot size={16} color="white" />
    </div>
    <div style={{
      padding: '14px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px',
      backgroundColor: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        {[0, 0.15, 0.3].map((delay, i) => (
          <div key={i} style={{
            width: '7px', height: '7px',
            backgroundColor: 'rgba(16,185,129,0.7)',
            borderRadius: '50%',
            animation: 'bounce 1s infinite',
            animationDelay: `${delay}s`
          }} />
        ))}
      </div>
    </div>
  </motion.div>
);

// ==================== CHAT INPUT ====================
const ChatInput = ({ value, onChange, onSend, disabled }) => {
  const textareaRef = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  return (
    <div style={{
      padding: '10px 16px 14px',
      background: 'linear-gradient(to top, rgba(8,13,20,1) 60%, rgba(8,13,20,0))',
    }}>
      <div style={{ maxWidth: '672px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: '10px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '18px',
          padding: '8px 8px 8px 16px',
          border: focused
            ? '1.5px solid rgba(16,185,129,0.5)'
            : '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: focused ? '0 0 0 3px rgba(16,185,129,0.08)' : 'none',
          backdropFilter: 'blur(12px)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Digite sua resposta..."
            disabled={disabled}
            rows={1}
            style={{
              flex: 1, backgroundColor: 'transparent', padding: '6px 0',
              color: 'white', resize: 'none', outline: 'none',
              minHeight: '40px', maxHeight: '120px', fontSize: '16px',
              border: 'none', fontFamily: 'inherit', lineHeight: '1.5',
              WebkitAppearance: 'none', borderRadius: 0,
            }}
          />
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            style={{
              flexShrink: 0, width: '36px', height: '36px', borderRadius: '12px',
              background: !disabled && value.trim()
                ? 'linear-gradient(135deg, #059669, #10b981)'
                : 'rgba(255,255,255,0.07)',
              color: !disabled && value.trim() ? 'white' : 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: !disabled && value.trim() ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
            }}
          >
            {disabled
              ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={14} />}
          </button>
        </div>
        <p style={{
          fontSize: '11px', color: 'rgba(255,255,255,0.2)',
          textAlign: 'center', marginTop: '6px', letterSpacing: '0.01em'
        }}>
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
};

// ==================== PROGRESS SIDEBAR ====================
const ProgressSidebar = ({ currentStep, contractType }) => {
  const steps = [
    { id: 1, name: 'Tipo de Contrato', icon: FileCheck },
    { id: 2, name: 'Dados', icon: Users },
    { id: 3, name: 'Contrato Pronto', icon: FileText },
  ];
  if (currentStep === 4) return null;

  return (
    <div className="hidden lg:flex" style={{
      width: '260px', position: 'fixed', left: 0, top: 0, bottom: 0,
      backgroundColor: '#060b11',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      flexDirection: 'column',
      padding: '28px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', boxShadow: '0 0 16px rgba(16,185,129,0.3)'
        }}>
          <img src="/robozinho.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>
          Contrate<span style={{ color: '#10b981' }}>-me</span>
        </span>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>
          Contrato
        </p>
        {contractType ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '12px',
            backgroundColor: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)'
          }}>
            <contractType.icon size={16} color="#10b981" />
            <span style={{ fontSize: '13px', color: 'white', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {contractType.name}
            </span>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>Nenhum selecionado</p>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
          Progresso
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;
            return (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', backgroundColor: isActive ? 'rgba(16,185,129,0.07)' : 'transparent' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: isDone ? '#10b981' : isActive ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                  border: isActive ? '1.5px solid rgba(16,185,129,0.4)' : 'none',
                }}>
                  {isDone
                    ? <CheckCircle2 size={16} color="white" />
                    : <step.icon size={14} color={isActive ? '#10b981' : 'rgba(255,255,255,0.25)'} />}
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: isDone || isActive ? 'white' : 'rgba(255,255,255,0.25)', lineHeight: 1.2 }}>
                    {step.name}
                  </p>
                  {isActive && (
                    <p style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>Em andamento</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{
        padding: '14px 16px', borderRadius: '14px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Clock size={14} color="#10b981" />
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Tempo estimado
          </span>
        </div>
        <p style={{ fontSize: '26px', fontWeight: '800', color: 'white', letterSpacing: '-0.02em' }}>~3 min</p>
      </div>
    </div>
  );
};

// ==================== CHAT INTERFACE ====================
const ChatInterface = ({ contractType, messages, isTyping, isGenerating, inputValue, setInputValue, onSendMessage, onOpenContractViewer }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isGenerating]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0a1018' }}>
      {/* Top bar */}
      <div style={{
        backgroundColor: 'rgba(8,13,20,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 16px', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: '10px',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: '0 0 10px rgba(16,185,129,0.3)'
        }}>
          <contractType.icon size={14} color="white" />
        </div>
        <span style={{ fontWeight: '600', color: 'white', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {contractType.name}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.6)' }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: '500' }}>IA ativa</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px 8px 8px' }}>
        <div style={{ maxWidth: '672px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                message={msg.text}
                isBot={msg.isBot}
                isGenerating={msg.isGenerating}
                isPdfCard={msg.isPdfCard}
                contractType={contractType}
                // ⚠️ CORRIGIDO: passa o handler correto para abrir o ContractViewer
                onOpenContractViewer={onOpenContractViewer}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ flexShrink: 0, position: 'sticky', bottom: 0, zIndex: 10 }}>
        <ChatInput value={inputValue} onChange={setInputValue} onSend={onSendMessage} disabled={isTyping || isGenerating} />
      </div>
    </div>
  );
};

// ==================== MAIN ====================
const Chat = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedContract, setSelectedContract] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatService, setChatService] = useState(null);
  const [generatedContract, setGeneratedContract] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; overflow: hidden; background: #080d14; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      ::placeholder { color: rgba(255,255,255,0.25) !important; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

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

  useEffect(() => {
    const h = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const handleSelectContract = async (type) => {
    setSelectedContract(type);
    setCurrentStep(2);
    setMessages([]);
    const service = new ChatService(type.id);
    setChatService(service);
    setIsTyping(true);
    try {
      const msg = await service.startChat();
      setMessages([{ text: msg, isBot: true }]);
    } catch (e) {
      setMessages([{ text: `❌ Erro ao iniciar: ${e.message}`, isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping || !chatService) return;
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInputValue('');
    setIsTyping(true);
    try {
      const response = await chatService.sendUserMessage(userMessage);
      setMessages(prev => [...prev, { text: response.message, isBot: true }]);
      if (response.isComplete) {
        setTimeout(async () => {
          setIsGenerating(true);
          setMessages(prev => [...prev, { text: '__GENERATING__', isBot: true, isGenerating: true }]);
          try {
            const contract = await chatService.generateContract();
            setGeneratedContract(contract);
            // ⚠️ CORRIGIDO: marca como isPdfCard para mostrar o card que abre o ContractViewer
            setMessages(prev => prev.map(m =>
              m.isGenerating ? { text: '__PDF_READY__', isBot: true, isPdfCard: true } : m
            ));
          } catch (e) {
            setMessages(prev => prev.map(m =>
              m.isGenerating ? { text: `❌ Erro ao gerar o contrato: ${e.message}`, isBot: true } : m
            ));
          } finally {
            setIsGenerating(false);
          }
        }, 1000);
      }
    } catch (e) {
      setMessages(prev => [...prev, { text: `❌ Erro: ${e.message}`, isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) { window.location.href = '/'; return; }
    setCurrentStep(1);
    setSelectedContract(null);
    setMessages([]);
    setChatService(null);
    setGeneratedContract(null);
    setGenerationError(null);
    setIsGenerating(false);
  };

  // ⚠️ CORRIGIDO: abre o ContractViewer (step 4) que contém o gate de pagamento
  const handleOpenContractViewer = () => setCurrentStep(4);

  const isDesktop = windowWidth >= 1024;

  return (
    <div style={{
      height: 'calc(var(--vh, 1vh) * 100)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', backgroundColor: '#080d14'
    }}>
      {isDesktop && currentStep <= 2 && (
        <ProgressSidebar currentStep={currentStep} contractType={selectedContract} />
      )}

      <main style={{
        flex: 1,
        paddingTop: 0,
        marginLeft: isDesktop && currentStep <= 2 ? '260px' : 0,
        display: 'flex', flexDirection: 'column',
        minHeight: 0, overflow: 'hidden'
      }}>
        {currentStep === 1 && (
          <div style={{
            flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch',
            paddingTop: '20px',
            backgroundImage: `linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}>
            <ContractTypeSelector onSelect={handleSelectContract} />
          </div>
        )}

        {currentStep === 2 && selectedContract && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <ChatInterface
              contractType={selectedContract}
              messages={messages}
              isTyping={isTyping}
              isGenerating={isGenerating}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSendMessage={handleSendMessage}
              // ⚠️ CORRIGIDO: passa handler que abre o ContractViewer
              onOpenContractViewer={handleOpenContractViewer}
            />
          </div>
        )}

        {/* ⚠️ CORRIGIDO: ContractViewer com gate de pagamento integrado */}
        {currentStep === 4 && generatedContract && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: '#080d14', overflowY: 'auto' }}>
            <ContractViewer
              contract={generatedContract}
              contractType={selectedContract}
              onBack={() => setCurrentStep(2)}
              onDownload={() => {}}
            />
          </div>
        )}

        {generationError && currentStep === 2 && (
          <div style={{ position: 'fixed', bottom: '80px', left: isDesktop ? 'calc(260px + 16px)' : '16px', right: '16px', zIndex: 50 }}>
            <div style={{
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '14px', padding: '16px'
            }}>
              <p style={{ fontSize: '14px', color: '#fca5a5' }}>{generationError}</p>
              <button onClick={() => setGenerationError(null)} style={{ marginTop: '8px', fontSize: '13px', color: '#fca5a5', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
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