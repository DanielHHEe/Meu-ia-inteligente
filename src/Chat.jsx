import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Send, Bot, User, Sparkles, Loader2,
  FileCheck, Building2, Users, Briefcase, Home, Shield,
  FileSignature, ChevronRight, CheckCircle2, Clock,
  X, Copy, Check, RefreshCw, Download, Lock,
} from "lucide-react";
import { ChatService } from './chatService';

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
      { id: "contratante_nome",        question: "Qual o nome completo do CONTRATANTE (quem vai pagar pelo serviço)?",       type: "text" },
      { id: "contratante_cpf_cnpj",    question: "Qual o CPF ou CNPJ do CONTRATANTE?",                                       type: "text" },
      { id: "contratado_nome",         question: "Qual o nome completo do CONTRATADO (quem vai prestar o serviço)?",          type: "text" },
      { id: "contratado_cpf_cnpj",     question: "Qual o CPF ou CNPJ do CONTRATADO?",                                        type: "text" },
      { id: "descricao_servico",       question: "Descreva detalhadamente o serviço a ser prestado:",                         type: "textarea" },
      { id: "valor_total",             question: "Qual o valor total do serviço? (Ex: R$ 5.000,00)",                          type: "text" },
      { id: "forma_pagamento",         question: "Qual a forma de pagamento? (Ex: PIX à vista, 50% entrada + 50% entrega)",   type: "text" },
      { id: "prazo_execucao",          question: "Qual o prazo para execução do serviço? (Ex: 30 dias)",                      type: "text" },
      { id: "multa_atraso_contratado", question: "Qual o percentual de multa por dia de atraso na entrega? (Ex: 0,5% ao dia)", type: "text" },
      { id: "multa_limite",            question: "Qual o limite máximo da multa por atraso? (Ex: 10% do valor total)",         type: "text" },
      { id: "multa_rescisao",          question: "Qual o percentual de multa por rescisão antecipada? (Ex: 20%)",             type: "text" },
      { id: "cidade",                  question: "Em qual cidade o contrato será assinado?",                                  type: "text" },
      { id: "estado",                  question: "Qual o Estado (UF)?",                                                       type: "text" },
    ],
  },
  {
    id: "aluguel",
    name: "Contrato de Aluguel",
    icon: Home,
    description: "Para locação de imóveis",
    popular: true,
    questions: [
      { id: "locador_nome",       question: "Qual o nome completo do LOCADOR (proprietário)?",                    type: "text" },
      { id: "locador_cpf_cnpj",   question: "Qual o CPF ou CNPJ do LOCADOR?",                                    type: "text" },
      { id: "locatario_nome",     question: "Qual o nome completo do LOCATÁRIO (inquilino)?",                     type: "text" },
      { id: "locatario_cpf_cnpj", question: "Qual o CPF ou CNPJ do LOCATÁRIO?",                                  type: "text" },
      { id: "descricao_imovel",   question: "Descreva o imóvel (tipo, número de cômodos, características):",      type: "textarea" },
      { id: "endereco_imovel",    question: "Qual o endereço completo do imóvel?",                               type: "text" },
      { id: "valor_aluguel",      question: "Qual o valor mensal do aluguel?",                                   type: "text" },
      { id: "dia_vencimento",     question: "Qual o dia do mês para vencimento? (Ex: dia 10)",                   type: "text" },
      { id: "data_inicio",        question: "Qual a data de início da locação? (Ex: 01/04/2025)",                type: "text" },
      { id: "prazo_locacao",      question: "Qual o prazo da locação em meses? (Ex: 12 meses)",                  type: "text" },
      { id: "multa_atraso",       question: "Qual o percentual de multa por atraso no pagamento? (Ex: 10%)",     type: "text" },
      { id: "juros_atraso",       question: "Qual o percentual de juros ao mês por atraso? (Ex: 1% ao mês)",    type: "text" },
      { id: "correcao_monetaria", question: "Qual o índice de correção monetária anual? (Ex: IGPM, IPCA)",      type: "text" },
      { id: "prazo_tolerancia",   question: "Qual o prazo de tolerância para pagamento em dias? (Ex: 5 dias)",  type: "text" },
      { id: "cidade",             question: "Em qual cidade o contrato será assinado?",                         type: "text" },
      { id: "estado",             question: "Qual o Estado (UF)?",                                              type: "text" },
    ],
  },
  {
    id: "parceria",
    name: "Acordo de Parceria",
    icon: Users,
    description: "Para parcerias comerciais",
    popular: false,
    questions: [
      { id: "parte_a_nome",            question: "Qual o nome completo da PARTE A?",                                 type: "text" },
      { id: "parte_a_cpf_cnpj",        question: "Qual o CPF/CNPJ da PARTE A?",                                     type: "text" },
      { id: "parte_b_nome",            question: "Qual o nome completo da PARTE B?",                                 type: "text" },
      { id: "parte_b_cpf_cnpj",        question: "Qual o CPF/CNPJ da PARTE B?",                                     type: "text" },
      { id: "objeto_parceria",         question: "Qual o objeto da parceria? (descreva o que será feito em conjunto)", type: "textarea" },
      { id: "contribuicao_a",          question: "Qual a contribuição da PARTE A? (o que ela entra com)",             type: "text" },
      { id: "contribuicao_b",          question: "Qual a contribuição da PARTE B? (o que ela entra com)",             type: "text" },
      { id: "participacao_resultados", question: "Como será a divisão dos resultados? (Ex: 50%/50%)",                 type: "text" },
      { id: "prazo_parceria",          question: "Qual o prazo da parceria? (Ex: 12 meses, 2 anos, indeterminado)",   type: "text" },
      { id: "multa_descumprimento",    question: "Percentual de multa por descumprimento das obrigações? (Ex: 10%)",  type: "text" },
      { id: "multa_rescisao",          question: "Percentual de multa por rescisão antecipada? (Ex: 15%)",            type: "text" },
      { id: "cidade",                  question: "Em qual cidade o contrato será assinado?",                          type: "text" },
      { id: "estado",                  question: "Qual o Estado (UF)?",                                               type: "text" },
    ],
  },
  {
    id: "confidencialidade",
    name: "Termo de Confidencialidade",
    icon: Shield,
    description: "Proteção de informações sigilosas",
    popular: true,
    questions: [
      { id: "revelador_nome",            question: "Qual o nome completo da parte REVELADORA?",                           type: "text" },
      { id: "revelador_cpf_cnpj",        question: "Qual o CPF/CNPJ da parte REVELADORA?",                               type: "text" },
      { id: "receptor_nome",             question: "Qual o nome completo da parte RECEPTORA?",                            type: "text" },
      { id: "receptor_cpf_cnpj",         question: "Qual o CPF/CNPJ da parte RECEPTORA?",                                type: "text" },
      { id: "informacoes_confidenciais", question: "Quais informações serão consideradas confidenciais? Descreva:",        type: "textarea" },
      { id: "prazo_confidencialidade",   question: "Qual o prazo de confidencialidade? (Ex: 2 anos, 5 anos)",             type: "text" },
      { id: "multa_violacao",            question: "Valor da multa em caso de violação? (Ex: R$ 50.000,00)",              type: "text" },
      { id: "perdas_danos",              question: "Além da multa, haverá cobrança de perdas e danos? (Sim ou Não)",      type: "text" },
      { id: "cidade",                    question: "Em qual cidade o contrato será assinado?",                            type: "text" },
      { id: "estado",                    question: "Qual o Estado (UF)?",                                                 type: "text" },
    ],
  },
  {
    id: "trabalho-freelancer",
    name: "Contrato Freelancer",
    icon: FileSignature,
    description: "Para profissionais autônomos",
    popular: false,
    questions: [
      { id: "contratante_nome",       question: "Qual o nome completo do CONTRATANTE (o cliente)?",                    type: "text" },
      { id: "contratante_cpf_cnpj",   question: "Qual o CPF/CNPJ do CONTRATANTE?",                                    type: "text" },
      { id: "freelancer_nome",        question: "Qual o nome completo do FREELANCER?",                                 type: "text" },
      { id: "freelancer_cpf",         question: "Qual o CPF do FREELANCER?",                                           type: "text" },
      { id: "escopo_trabalho",        question: "Descreva detalhadamente o escopo do trabalho (o que será entregue):", type: "textarea" },
      { id: "valor_projeto",          question: "Qual o valor total do projeto? (Ex: R$ 3.000,00)",                    type: "text" },
      { id: "forma_pagamento",        question: "Qual a forma de pagamento?",                                          type: "text" },
      { id: "prazo_entrega",          question: "Qual o prazo de entrega?",                                            type: "text" },
      { id: "multa_atraso_entrega",   question: "Multa por atraso na entrega pelo freelancer, por dia? (Ex: 0,5%)",   type: "text" },
      { id: "multa_atraso_pagamento", question: "Multa por atraso no pagamento pelo contratante, por dia? (Ex: 0,5%)", type: "text" },
      { id: "multa_rescisao",         question: "Percentual de multa por rescisão antecipada? (Ex: 20%)",              type: "text" },
      { id: "cidade",                 question: "Em qual cidade o contrato será assinado?",                            type: "text" },
      { id: "estado",                 question: "Qual o Estado (UF)?",                                                 type: "text" },
    ],
  },
  {
    id: "compra-venda",
    name: "Compra e Venda",
    icon: Building2,
    description: "Para transações de bens",
    popular: false,
    questions: [
      { id: "vendedor_nome",          question: "Qual o nome completo do VENDEDOR?",                                    type: "text" },
      { id: "vendedor_cpf_cnpj",      question: "Qual o CPF/CNPJ do VENDEDOR?",                                        type: "text" },
      { id: "comprador_nome",         question: "Qual o nome completo do COMPRADOR?",                                  type: "text" },
      { id: "comprador_cpf_cnpj",     question: "Qual o CPF/CNPJ do COMPRADOR?",                                       type: "text" },
      { id: "descricao_bem",          question: "Descreva detalhadamente o bem sendo vendido:",                         type: "textarea" },
      { id: "valor_venda",            question: "Qual o valor total da venda?",                                        type: "text" },
      { id: "forma_pagamento",        question: "Qual a forma de pagamento?",                                          type: "text" },
      { id: "prazo_entrega_bem",      question: "Qual o prazo para entrega do bem? (Ex: na assinatura, 7 dias, 30 dias)", type: "text" },
      { id: "multa_atraso_pagamento", question: "Multa por atraso no pagamento, por dia? (Ex: 0,5% ao dia)",           type: "text" },
      { id: "multa_desistencia",      question: "Percentual de multa por desistência/rescisão? (Ex: 20% do valor)",    type: "text" },
      { id: "cidade",                 question: "Em qual cidade o contrato será assinado?",                            type: "text" },
      { id: "estado",                 question: "Qual o Estado (UF)?",                                                 type: "text" },
    ],
  },
];

// ==================== PAYMENT MODAL ====================
// Modal flutuante — NÃO troca de tela, NÃO redireciona
const PaymentModal = ({ isOpen, onClose, onPaymentConfirmed, contractType }) => {
  const [step, setStep] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const pollRef = useRef(null);
  const timerRef = useRef(null);
  const externalRefRef = useRef(null);

  const createPayment = useCallback(async () => {
    setStep('loading');
    setTimeLeft(30 * 60);
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: contractType?.name || 'Contrato' }),
      });
      const data = await response.json();
      if (!response.ok || !data.qrCode) throw new Error(data.error || 'Erro ao gerar QR Code');
      setPaymentData(data);
      externalRefRef.current = data.externalReference;
      setStep('qrcode');
    } catch {
      setStep('error');
    }
  }, [contractType]);

  useEffect(() => {
    if (isOpen) {
      createPayment();
    } else {
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
      setStep('loading');
      setPaymentData(null);
    }
  }, [isOpen, createPayment]);

  // Polling de confirmação do pagamento
  useEffect(() => {
    if (step !== 'qrcode' || !externalRefRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-payment?ref=${externalRefRef.current}`);
        const data = await res.json();
        if (data.paid) {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setStep('confirmed');
          setTimeout(() => onPaymentConfirmed(), 2000);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [step, onPaymentConfirmed]);

  // Countdown do QR Code
  useEffect(() => {
    if (step !== 'qrcode') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          setStep('expired');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [step]);

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleCopy = async () => {
    if (!paymentData?.qrCode) return;
    try { await navigator.clipboard.writeText(paymentData.qrCode); }
    catch {
      const el = document.createElement('textarea');
      el.value = paymentData.qrCode;
      document.body.appendChild(el); el.select();
      document.execCommand('copy'); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step !== 'confirmed' ? onClose : undefined}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '390px',
              backgroundColor: '#0d1520',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '24px', overflow: 'hidden',
              boxShadow: '0 30px 70px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '9px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 14px rgba(16,185,129,0.3)',
                }}>
                  <span style={{ fontSize: '15px' }}>💳</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'white', margin: 0, lineHeight: 1.2 }}>
                    Pagamento via Pix
                  </h3>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                    {contractType?.name || 'Contrato'}
                  </p>
                </div>
              </div>
              {step !== 'confirmed' && (
                <button onClick={onClose} style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: '18px 20px 22px' }}>

              {/* LOADING */}
              {step === 'loading' && (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                  }}>
                    <Loader2 size={22} color="#10b981" style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: 0 }}>
                    Gerando QR Code Pix...
                  </p>
                </div>
              )}

              {/* QR CODE */}
              {step === 'qrcode' && paymentData && (
                <>
                  {/* Valor */}
                  <div style={{
                    textAlign: 'center', padding: '14px 16px',
                    borderRadius: '14px', background: 'rgba(16,185,129,0.06)',
                    border: '1px solid rgba(16,185,129,0.14)', marginBottom: '16px',
                  }}>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Valor a pagar
                    </p>
                    <p style={{ fontSize: '34px', fontWeight: '800', color: 'white', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
                      R$ 19<span style={{ fontSize: '20px' }}>,90</span>
                    </p>
                  </div>

                  {/* QR Code image */}
                  {paymentData.qrCodeBase64 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                      <div style={{ padding: '10px', borderRadius: '14px', backgroundColor: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                        <img
                          src={`data:image/png;base64,${paymentData.qrCodeBase64}`}
                          alt="QR Code Pix"
                          style={{ width: '164px', height: '164px', display: 'block' }}
                        />
                      </div>
                    </div>
                  )}

                  <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                    Escaneie o QR Code ou copie o código abaixo
                  </p>

                  {/* Copia e cola */}
                  <button
                    onClick={handleCopy}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '11px', cursor: 'pointer',
                      background: copied ? 'rgba(16,185,129,0.09)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: '10px', transition: 'all 0.2s', marginBottom: '14px',
                    }}
                  >
                    <span style={{
                      fontSize: '11px', color: 'rgba(255,255,255,0.32)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      flex: 1, textAlign: 'left', fontFamily: 'monospace',
                    }}>
                      {paymentData.qrCode?.slice(0, 46)}...
                    </span>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      color: copied ? '#10b981' : 'rgba(255,255,255,0.4)',
                      flexShrink: 0, fontSize: '12px', fontWeight: '600',
                    }}>
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </div>
                  </button>

                  {/* Status de aguardo */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 13px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.6)',
                        animation: 'pulse 2s infinite',
                      }} />
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)' }}>
                        Aguardando pagamento...
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.22)' }}>
                      <Clock size={11} />
                      <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
                    </div>
                  </div>

                  <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.16)', marginTop: '10px' }}>
                    O download é liberado automaticamente após o pagamento
                  </p>
                </>
              )}

              {/* CONFIRMADO */}
              {step === 'confirmed' && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px', boxShadow: '0 0 32px rgba(16,185,129,0.45)',
                    }}
                  >
                    <CheckCircle2 size={32} color="white" />
                  </motion.div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>
                    Pagamento confirmado!
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', marginBottom: '16px' }}>
                    Seu download está sendo liberado...
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '7px 14px', borderRadius: '9999px',
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                  }}>
                    <Sparkles size={13} color="#10b981" />
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
                      R$ 19,90 recebido via Pix
                    </span>
                  </div>
                </div>
              )}

              {/* EXPIRADO */}
              {step === 'expired' && (
                <div style={{ textAlign: 'center', padding: '22px 0' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                  }}>
                    <Clock size={26} color="#f59e0b" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
                    QR Code expirado
                  </h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '18px' }}>
                    O código Pix expirou após 30 minutos.
                  </p>
                  <button onClick={createPayment} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '10px 22px', borderRadius: '11px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white', fontWeight: '700', fontSize: '13px',
                    border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.28)',
                  }}>
                    <RefreshCw size={14} /> Gerar novo QR Code
                  </button>
                </div>
              )}

              {/* ERRO */}
              {step === 'error' && (
                <div style={{ textAlign: 'center', padding: '22px 0' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                  }}>
                    <X size={26} color="#ef4444" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>
                    Erro ao gerar pagamento
                  </h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '18px' }}>
                    Não foi possível conectar com o Mercado Pago. Tente novamente.
                  </p>
                  <button onClick={createPayment} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '10px 22px', borderRadius: '11px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white', fontWeight: '700', fontSize: '13px',
                    border: 'none', cursor: 'pointer',
                  }}>
                    <RefreshCw size={14} /> Tentar novamente
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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
        backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
        color: '#10b981', fontSize: '12px', fontWeight: '600',
        letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px'
      }}>
        <Sparkles size={13} /> Passo 1 de 3
      </div>
      <h2 style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: '800', color: 'white', marginBottom: '8px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
        Qual contrato você precisa?
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
        Selecione o modelo ideal para sua necessidade
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
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
            textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease',
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
              padding: '3px 10px', background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              color: 'white', fontSize: '10px', fontWeight: '700',
              borderRadius: '9999px', letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>Popular</div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingRight: '20px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <type.icon size={18} color="#10b981" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontWeight: '700', color: 'white', marginBottom: '4px', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {type.name}
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {type.description}
              </p>
            </div>
          </div>
          <ChevronRight size={15} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
        </motion.button>
      ))}
    </div>
  </motion.div>
);

// ==================== GENERATING BUBBLE ====================
const GeneratingBubble = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px' }}>
    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px rgba(16,185,129,0.3)' }}>
      <Bot size={16} color="white" />
    </div>
    <div style={{ padding: '12px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
      <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>Gerando contrato...</span>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>aguarde</span>
    </div>
  </motion.div>
);

// ==================== PDF CARD ====================
// Abre o PaymentModal diretamente NO CHAT — sem mudar de tela
const PdfCard = ({ contractType, isPaid, onOpenPayment, onDownload }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px' }}>
    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px rgba(16,185,129,0.3)' }}>
      <Bot size={16} color="white" />
    </div>

    <div style={{ maxWidth: '340px' }}>
      {/* Mensagem de status */}
      <div style={{
        padding: '11px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px',
        backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
        fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginBottom: '8px', lineHeight: '1.5',
      }}>
        {isPaid
          ? '✅ Pagamento confirmado! Clique abaixo para baixar seu contrato.'
          : '✅ Contrato gerado! Clique abaixo para pagar e baixar o PDF.'}
      </div>

      {/* Card clicável */}
      <button
        onClick={isPaid ? onDownload : onOpenPayment}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 14px', borderRadius: '14px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: `1px solid ${isPaid ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
            transition: 'border-color 0.2s, background-color 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = isPaid ? 'rgba(16,185,129,0.55)' : 'rgba(245,158,11,0.45)';
            e.currentTarget.style.backgroundColor = isPaid ? 'rgba(16,185,129,0.07)' : 'rgba(245,158,11,0.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = isPaid ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
          }}
        >
          <div style={{
            width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
            background: isPaid
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isPaid ? '0 4px 12px rgba(16,185,129,0.3)' : '0 4px 12px rgba(245,158,11,0.3)',
          }}>
            {isPaid ? <Download size={20} color="white" /> : <Lock size={20} color="white" />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
              {contractType?.name || 'Contrato'}.pdf
            </p>
            <p style={{ fontSize: '11px', color: isPaid ? '#10b981' : 'rgba(255,255,255,0.35)', margin: '2px 0 0', fontWeight: isPaid ? '600' : '400' }}>
              {isPaid ? 'Download liberado — clique para baixar' : 'Pagar R$ 19,90 via Pix para baixar'}
            </p>
          </div>
          <div style={{
            width: '26px', height: '26px', borderRadius: '8px',
            backgroundColor: isPaid ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
            border: `1px solid ${isPaid ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <ChevronRight size={14} color={isPaid ? '#10b981' : '#f59e0b'} />
          </div>
        </div>
      </button>
    </div>
  </motion.div>
);

// ==================== MESSAGE BUBBLE ====================
const MessageBubble = ({ message, isBot, isGenerating, isPdfCard, contractType, isPaid, onOpenPayment, onDownload }) => {
  if (isGenerating) return <GeneratingBubble />;
  if (isPdfCard) return <PdfCard contractType={contractType} isPaid={isPaid} onOpenPayment={onOpenPayment} onDownload={onDownload} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px', justifyContent: isBot ? 'flex-start' : 'flex-end', width: '100%' }}>
      {isBot && (
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px rgba(16,185,129,0.3)' }}>
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
        {isBot ? <TypingText text={message} speed={12} /> : <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message}</p>}
      </div>
      {!isBot && (
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <User size={16} color="rgba(255,255,255,0.7)" />
        </div>
      )}
    </motion.div>
  );
};

// ==================== TYPING INDICATOR ====================
const TypingIndicator = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px' }}>
    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px rgba(16,185,129,0.3)' }}>
      <Bot size={16} color="white" />
    </div>
    <div style={{ padding: '14px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        {[0, 0.15, 0.3].map((delay, i) => (
          <div key={i} style={{ width: '7px', height: '7px', backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: '50%', animation: 'bounce 1s infinite', animationDelay: `${delay}s` }} />
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
    <div style={{ padding: '10px 16px 14px', background: 'linear-gradient(to top, rgba(8,13,20,1) 60%, rgba(8,13,20,0))' }}>
      <div style={{ maxWidth: '672px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: '10px',
          backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '18px',
          padding: '8px 8px 8px 16px',
          border: focused ? '1.5px solid rgba(16,185,129,0.5)' : '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: focused ? '0 0 0 3px rgba(16,185,129,0.08)' : 'none',
          backdropFilter: 'blur(12px)', transition: 'border-color 0.2s, box-shadow 0.2s',
        }}>
          <textarea
            ref={textareaRef} value={value} onChange={e => onChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Digite sua resposta..." disabled={disabled} rows={1}
            style={{ flex: 1, backgroundColor: 'transparent', padding: '6px 0', color: 'white', resize: 'none', outline: 'none', minHeight: '40px', maxHeight: '120px', fontSize: '16px', border: 'none', fontFamily: 'inherit', lineHeight: '1.5', WebkitAppearance: 'none', borderRadius: 0 }}
          />
          <button onClick={onSend} disabled={disabled || !value.trim()} style={{
            flexShrink: 0, width: '36px', height: '36px', borderRadius: '12px',
            background: !disabled && value.trim() ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(255,255,255,0.07)',
            color: !disabled && value.trim() ? 'white' : 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: !disabled && value.trim() ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
          }}>
            {disabled ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={14} />}
          </button>
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '6px' }}>
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

  return (
    <div className="hidden lg:flex" style={{ width: '260px', position: 'fixed', left: 0, top: 0, bottom: 0, backgroundColor: '#060b11', borderRight: '1px solid rgba(255,255,255,0.06)', flexDirection: 'column', padding: '28px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 16px rgba(16,185,129,0.3)' }}>
          <img src="/robozinho.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>
          Contrate<span style={{ color: '#10b981' }}>-me</span>
        </span>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>Contrato</p>
        {contractType ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <contractType.icon size={16} color="#10b981" />
            <span style={{ fontSize: '13px', color: 'white', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contractType.name}</span>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>Nenhum selecionado</p>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>Progresso</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {steps.map(step => {
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;
            return (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', backgroundColor: isActive ? 'rgba(16,185,129,0.07)' : 'transparent' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isDone ? '#10b981' : isActive ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', border: isActive ? '1.5px solid rgba(16,185,129,0.4)' : 'none' }}>
                  {isDone ? <CheckCircle2 size={16} color="white" /> : <step.icon size={14} color={isActive ? '#10b981' : 'rgba(255,255,255,0.25)'} />}
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: isDone || isActive ? 'white' : 'rgba(255,255,255,0.25)', lineHeight: 1.2 }}>{step.name}</p>
                  {isActive && <p style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>Em andamento</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '14px 16px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Clock size={14} color="#10b981" />
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tempo estimado</span>
        </div>
        <p style={{ fontSize: '26px', fontWeight: '800', color: 'white', letterSpacing: '-0.02em' }}>~3 min</p>
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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ Controle de pagamento — modal inline, sem troca de tela
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isGenerating]);

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
    return () => { window.removeEventListener('resize', setVh); window.removeEventListener('orientationchange', setVh); };
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
    setIsPaid(false);
    setGeneratedContract(null);
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

  // ✅ Pagamento confirmado → fecha modal, marca como pago
  const handlePaymentConfirmed = () => {
    setIsPaid(true);
    setShowPaymentModal(false);
  };

  // ✅ Download do PDF — só funciona após isPaid = true
  const handleDownload = () => {
    if (!generatedContract || !isPaid) return;
    const contractText = typeof generatedContract === 'string'
      ? generatedContract
      : generatedContract.contract || generatedContract.content || String(generatedContract);
    const fileName = `${selectedContract?.name || 'Contrato'}.pdf`;

    const gerar = (JsPDF) => {
      const doc = new JsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20, maxWidth = pageWidth - margin * 2, lineHeight = 6;
      let y = margin;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      for (const rawLine of contractText.split('\n')) {
        const wrapped = doc.splitTextToSize(rawLine || ' ', maxWidth);
        for (const segment of wrapped) {
          if (y + lineHeight > pageHeight - margin) { doc.addPage(); y = margin; }
          doc.text(segment, margin, y);
          y += lineHeight;
        }
      }
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isMobile = isIOS || /Android/.test(navigator.userAgent);
      const pdfBlob = doc.output('blob');
      const downloadViaBlob = (blob, name) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name; a.style.display = 'none';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      };
      if (isMobile && navigator.share && navigator.canShare) {
        const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
        if (navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: fileName }).catch(() => downloadViaBlob(pdfBlob, fileName));
          return;
        }
      }
      downloadViaBlob(pdfBlob, fileName);
    };

    if (window.jspdf?.jsPDF) { gerar(window.jspdf.jsPDF); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => { if (window.jspdf?.jsPDF) gerar(window.jspdf.jsPDF); };
    script.onerror = () => {
      const blob = new Blob([contractText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = fileName.replace('.pdf', '.txt');
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    };
    document.head.appendChild(script);
  };

  const isDesktop = windowWidth >= 1024;

  return (
    <div style={{ height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#080d14' }}>
      {isDesktop && <ProgressSidebar currentStep={currentStep} contractType={selectedContract} />}

      <main style={{ flex: 1, marginLeft: isDesktop ? '260px' : 0, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

        {/* STEP 1 — Seleção do tipo */}
        {currentStep === 1 && (
          <div style={{
            flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: '20px',
            backgroundImage: `linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}>
            <ContractTypeSelector onSelect={handleSelectContract} />
          </div>
        )}

        {/* STEP 2 — Chat (permanece visível durante todo o processo) */}
        {currentStep === 2 && selectedContract && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0a1018' }}>
            {/* Top bar */}
            <div style={{ backgroundColor: 'rgba(8,13,20,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(12px)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 10px rgba(16,185,129,0.3)' }}>
                <selectedContract.icon size={14} color="white" />
              </div>
              <span style={{ fontWeight: '600', color: 'white', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedContract.name}
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
                      contractType={selectedContract}
                      isPaid={isPaid}
                      onOpenPayment={() => setShowPaymentModal(true)}
                      onDownload={handleDownload}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div style={{ flexShrink: 0, position: 'sticky', bottom: 0, zIndex: 10 }}>
              <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSendMessage} disabled={isTyping || isGenerating} />
            </div>
          </div>
        )}
      </main>

      {/* ✅ Modal de pagamento — flutua SOBRE o chat, sem trocar de tela */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentConfirmed={handlePaymentConfirmed}
        contractType={selectedContract}
      />
    </div>
  );
};

export default Chat;