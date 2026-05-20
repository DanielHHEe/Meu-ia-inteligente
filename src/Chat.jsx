import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Send, Bot, User, Sparkles, Loader2,
  FileCheck, Building2, Users, Briefcase, Home, Shield,
  FileSignature, ChevronRight, CheckCircle2, Clock,
  X, Copy, Check, RefreshCw, Download, Lock, LogOut,
} from "lucide-react";
import { ChatService } from './chatService';
import { useAuth } from "./config/AuthContext";
import { useNavigate } from "react-router-dom";

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
  {
    id: "empreitada",
    name: "Contrato de Empreitada",
    icon: Building2,
    description: "Obras e construção civil — art. 618 CC",
    popular: false,
    questions: [
      { id: "contratante_nome",       question: "Qual o nome completo do CONTRATANTE (dono da obra)?",                           type: "text" },
      { id: "contratante_cpf_cnpj",   question: "Qual o CPF ou CNPJ do CONTRATANTE?",                                            type: "text" },
      { id: "empreiteiro_nome",       question: "Qual o nome completo do EMPREITEIRO (quem vai executar a obra)?",               type: "text" },
      { id: "empreiteiro_cpf_cnpj",   question: "Qual o CPF ou CNPJ do EMPREITEIRO?",                                           type: "text" },
      { id: "tipo_obra",              question: "Qual é o tipo de obra ou serviço? (Ex: construção, reforma, instalação elétrica)", type: "text" },
      { id: "descricao_obra",         question: "Descreva detalhadamente o que será feito na obra:",                              type: "textarea" },
      { id: "endereco_obra",          question: "Qual o endereço onde a obra será executada?",                                   type: "text" },
      { id: "modalidade_empreitada",  question: "A empreitada é por preço global (valor fechado) ou por medição/etapas?",        type: "text" },
      { id: "valor_total",            question: "Qual o valor total da empreitada? (Ex: R$ 50.000,00)",                          type: "text" },
      { id: "forma_pagamento",        question: "Qual a forma de pagamento? (Ex: 30% na assinatura, 40% na metade, 30% na entrega)", type: "text" },
      { id: "prazo_execucao",         question: "Qual o prazo total para conclusão da obra? (Ex: 90 dias, 6 meses)",             type: "text" },
      { id: "prazo_garantia",         question: "Qual o prazo de garantia da obra após a entrega? (Ex: 5 anos para estrutura)",  type: "text" },
      { id: "multa_atraso",           question: "Percentual de multa por atraso na entrega da obra, por dia? (Ex: 0,5% ao dia)", type: "text" },
      { id: "multa_limite",           question: "Limite máximo da multa por atraso? (Ex: 10% do valor total)",                   type: "text" },
      { id: "multa_rescisao",         question: "Percentual de multa por rescisão antecipada? (Ex: 20%)",                        type: "text" },
      { id: "cidade",                 question: "Em qual cidade o contrato será assinado?",                                      type: "text" },
      { id: "estado",                 question: "Qual o Estado (UF)?",                                                           type: "text" },
    ],
  },
  {
    id: "sociedade",
    name: "Sociedade Simples",
    icon: Users,
    description: "Abertura de empresa entre sócios — CC arts. 997-1038",
    popular: false,
    questions: [
      { id: "socio_a_nome",         question: "Qual o nome completo do SÓCIO A?",                                              type: "text" },
      { id: "socio_a_cpf",          question: "Qual o CPF do SÓCIO A?",                                                        type: "text" },
      { id: "socio_a_quota",        question: "Qual o percentual de participação (quota) do SÓCIO A? (Ex: 50%)",               type: "text" },
      { id: "socio_b_nome",         question: "Qual o nome completo do SÓCIO B?",                                              type: "text" },
      { id: "socio_b_cpf",          question: "Qual o CPF do SÓCIO B?",                                                        type: "text" },
      { id: "socio_b_quota",        question: "Qual o percentual de participação (quota) do SÓCIO B? (Ex: 50%)",               type: "text" },
      { id: "razao_social",         question: "Qual será a razão social da empresa? (nome oficial registrado)",                 type: "text" },
      { id: "nome_fantasia",        question: "Qual será o nome fantasia? (se não houver, informe 'sem nome fantasia')",        type: "text" },
      { id: "objeto_social",        question: "Qual é o objeto social? (o que a empresa vai fazer — descreva as atividades)",  type: "textarea" },
      { id: "endereco_sede",        question: "Qual o endereço da sede da empresa?",                                           type: "text" },
      { id: "capital_social",       question: "Qual o valor do capital social? (Ex: R$ 10.000,00)",                            type: "text" },
      { id: "distribuicao_lucros",  question: "Como será feita a distribuição dos lucros entre os sócios? (Ex: proporcional às quotas)", type: "text" },
      { id: "multa_rescisao",       question: "Percentual de multa por rescisão antecipada ou descumprimento? (Ex: 20%)",      type: "text" },
      { id: "cidade",               question: "Em qual cidade o contrato será assinado?",                                      type: "text" },
      { id: "estado",               question: "Qual o Estado (UF)?",                                                           type: "text" },
    ],
  },
  {
    id: "representacao-comercial",
    name: "Representação Comercial",
    icon: Briefcase,
    description: "Representantes comerciais — Lei 4.886/65",
    popular: false,
    questions: [
      { id: "representada_nome",        question: "Qual o nome ou razão social da empresa REPRESENTADA (quem fabrica/vende)?",    type: "text" },
      { id: "representada_cnpj",        question: "Qual o CNPJ da REPRESENTADA?",                                                 type: "text" },
      { id: "representante_nome",       question: "Qual o nome completo ou razão social do REPRESENTANTE COMERCIAL?",             type: "text" },
      { id: "representante_cpf_cnpj",   question: "Qual o CPF ou CNPJ do REPRESENTANTE?",                                        type: "text" },
      { id: "produtos_representados",   question: "Quais produtos ou serviços o representante irá vender? (descreva)",            type: "textarea" },
      { id: "territorio_atuacao",       question: "Qual o território de atuação do representante? (Ex: estado de SP, região Sul)", type: "text" },
      { id: "exclusividade_territorial",question: "O representante terá exclusividade nesse território? (sim ou não)",            type: "text" },
      { id: "percentual_comissao",      question: "Qual o percentual de comissão do representante? (Ex: 5%)",                     type: "text" },
      { id: "base_calculo_comissao",    question: "A comissão é calculada sobre o quê? (Ex: valor faturado e recebido)",          type: "text" },
      { id: "prazo_contrato",           question: "Qual o prazo de duração do contrato? (Ex: 12 meses, indeterminado)",           type: "text" },
      { id: "multa_descumprimento",     question: "Percentual de multa por descumprimento das obrigações? (Ex: 20%)",             type: "text" },
      { id: "cidade",                   question: "Em qual cidade o contrato será assinado?",                                     type: "text" },
      { id: "estado",                   question: "Qual o Estado (UF)?",                                                          type: "text" },
    ],
  },
  {
    id: "comodato",
    name: "Contrato de Comodato",
    icon: FileText,
    description: "Empréstimo gratuito de bem — CC arts. 579-585",
    popular: false,
    questions: [
      { id: "comodante_nome",        question: "Qual o nome completo do COMODANTE (dono do bem que vai emprestar)?",             type: "text" },
      { id: "comodante_cpf_cnpj",    question: "Qual o CPF ou CNPJ do COMODANTE?",                                              type: "text" },
      { id: "comodatario_nome",      question: "Qual o nome completo do COMODATÁRIO (quem recebe o bem emprestado)?",           type: "text" },
      { id: "comodatario_cpf_cnpj",  question: "Qual o CPF ou CNPJ do COMODATÁRIO?",                                           type: "text" },
      { id: "descricao_bem",         question: "O que está sendo emprestado? Descreva o bem com detalhes:",                     type: "textarea" },
      { id: "estado_conservacao",    question: "Qual o estado de conservação do bem no momento da entrega?",                    type: "text" },
      { id: "finalidade_uso",        question: "Para qual finalidade o comodatário irá usar o bem?",                            type: "text" },
      { id: "prazo_comodato",        question: "Qual o prazo do empréstimo? (Ex: 30 dias, 6 meses, indeterminado)",             type: "text" },
      { id: "responsavel_manutencao",question: "Quem é responsável pela manutenção do bem durante o empréstimo?",              type: "text" },
      { id: "multa_dano",            question: "Como será calculada a indenização em caso de dano ao bem pelo comodatário?",    type: "text" },
      { id: "multa_atraso_devolucao",question: "Percentual de multa por dia de atraso na devolução do bem? (Ex: 0,5% ao dia)", type: "text" },
      { id: "cidade",                question: "Em qual cidade o contrato será assinado?",                                      type: "text" },
      { id: "estado",                question: "Qual o Estado (UF)?",                                                           type: "text" },
    ],
  },
];

// ==================== PAYMENT MODAL ====================
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

            <div style={{ padding: '18px 20px 22px' }}>
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

              {step === 'qrcode' && paymentData && (
                <>
                  <div style={{
                    textAlign: 'center', padding: '14px 16px',
                    borderRadius: '14px', background: 'rgba(16,185,129,0.06)',
                    border: '1px solid rgba(16,185,129,0.14)', marginBottom: '16px',
                  }}>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Valor a pagar
                    </p>
                    <p style={{ fontSize: '34px', fontWeight: '800', color: 'white', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
                      R$ 29<span style={{ fontSize: '20px' }}>,90</span>
                    </p>
                  </div>

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
                      R$ 29,90 recebido via Pix
                    </span>
                  </div>
                </div>
              )}

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

// ==================== USER AVATAR ====================
const ChatUserAvatar = ({ showInChat }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário";
  const initials = name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <div ref={menuRef} style={{
      display: 'flex', justifyContent: 'flex-end',
      padding: showInChat ? '0' : '16px 20px 0',
      maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative',
    }}>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 12px 6px 8px', borderRadius: '12px',
            backgroundColor: menuOpen ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${menuOpen ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`,
            cursor: 'pointer', transition: 'all 0.2s', outline: 'none',
          }}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: '0 0 10px rgba(16,185,129,0.25)',
          }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'white' }}>{initials}</span>
          </div>
          <span style={{ fontSize: '12px', color: menuOpen ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: '500', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </span>
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: '180px', backgroundColor: '#0d1520',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100,
              }}
            >
              <button
                onClick={handleSignOut}
                style={{
                  width: '100%', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  backgroundColor: 'transparent', border: 'none',
                  color: '#ef4444', fontSize: '13px', fontWeight: '500',
                  cursor: 'pointer', transition: 'background-color 0.2s', textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={14} /> Sair da conta
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
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
const PdfCard = ({ contractType, isPaid, onOpenPayment, onDownload }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px' }}>
    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px rgba(16,185,129,0.3)' }}>
      <Bot size={16} color="white" />
    </div>
    <div style={{ maxWidth: '340px' }}>
      <div style={{
        padding: '11px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px',
        backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
        fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginBottom: '8px', lineHeight: '1.5',
      }}>
        {isPaid
          ? '✅ Pagamento confirmado! Clique abaixo para baixar seu contrato.'
          : '✅ Contrato gerado! Clique abaixo para pagar e baixar o PDF.'}
      </div>
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
            background: isPaid ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
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
              {isPaid ? 'Download liberado — clique para baixar' : 'Pagar R$ 29,90 via Pix para baixar'}
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
    <div style={{
      padding: '10px 16px 14px',
      paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
      background: 'linear-gradient(to top, rgba(8,13,20,1) 60%, rgba(8,13,20,0))',
    }}>
      <div style={{ maxWidth: '672px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: '10px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '28px', padding: '8px 8px 8px 18px',
          border: focused ? '1.5px solid rgba(16,185,129,0.5)' : '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: focused ? '0 0 0 3px rgba(16,185,129,0.08)' : 'none',
          backdropFilter: 'blur(12px)', transition: 'border-color 0.2s, box-shadow 0.2s',
        }}>
          <textarea
            ref={textareaRef} value={value} onChange={e => onChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Digite sua resposta..." disabled={disabled} rows={1}
            style={{
              flex: 1, backgroundColor: 'transparent', padding: '6px 0',
              color: 'white', resize: 'none', outline: 'none',
              minHeight: '40px', maxHeight: '120px', fontSize: '16px',
              border: 'none', fontFamily: 'inherit', lineHeight: '1.5',
              WebkitAppearance: 'none', borderRadius: 0,
            }}
          />
          <button onClick={onSend} disabled={disabled || !value.trim()} style={{
            flexShrink: 0, width: '36px', height: '36px', borderRadius: '18px',
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
          <img src="/rob.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>
          Contrati<span style={{ color: '#10b981' }}>fy</span>
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
        <p style={{ fontSize: '26px', fontWeight: '400', color: 'white', letterSpacing: '-0.02em' }}>3 min</p>
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
      html, body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; overflow: hidden; background: #080d14 !important; background-color: #080d14 !important; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      ::placeholder { color: rgba(255,255,255,0.5) !important; }
    `;
    document.head.appendChild(style);
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) { metaTheme = document.createElement('meta'); metaTheme.name = 'theme-color'; document.head.appendChild(metaTheme); }
    metaTheme.content = '#080d14';
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
            setCurrentStep(3);
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

  const handlePaymentConfirmed = () => {
    setIsPaid(true);
    setShowPaymentModal(false);
  };

  // ==================== HANDLE DOWNLOAD COM FORMATAÇÃO ====================
  const handleDownload = () => {
    if (!generatedContract || !isPaid) return;

    const contractText = typeof generatedContract === 'string'
      ? generatedContract
      : generatedContract.contract || generatedContract.content || String(generatedContract);

    const fileName = `${selectedContract?.name || 'Contrato'}.pdf`;

    // Detecta blocos de assinatura (linhas ___ seguidas de nome - PAPEL)
    const buildSignatureBlock = (lines, startIndex) => {
      const sigLines = [];
      let i = startIndex;
      while (i < lines.length) {
        const s = lines[i].trim().replace(/\*\*/g, '').trim();
        if (/^_{3,}/.test(s) || /^[A-ZÀ-Úa-záéíóúâêîôûãõç][a-zA-ZÀ-ú\s]+\s*[-–]\s*(VENDEDOR|COMPRADOR|CONTRATANTE|CONTRATADO|LOCADOR|LOCATÁRIO|FREELANCER|PARTE [AB])$/i.test(s) || s === '') {
          sigLines.push({ index: i, text: s });
          i++;
        } else {
          break;
        }
      }
      return sigLines;
    };

    const formatText = (text) => {
      const lines = text.split('\n');
      let html = '';
      let i = 0;

      // Coleta todos os blocos de assinatura para renderizar lado a lado
      const signatureBlocks = [];
      let currentSigBlock = [];

      while (i < lines.length) {
        const trimmed = lines[i].trim();
        const stripped = trimmed.replace(/\*\*/g, '').trim();

        if (!stripped) {
          if (currentSigBlock.length > 0) {
            // Linha vazia entre blocos de assinatura — pode ser separador
          }
          html += '<div style="height:8px"></div>';
          i++;
          continue;
        }

        // Título principal
        if (/^(CONTRATO|TERMO|ACORDO|INSTRUMENTO)\s+DE\s+/i.test(stripped) && stripped === stripped.toUpperCase()) {
          html += `<p style="text-align:center;font-weight:bold;font-size:14px;letter-spacing:1px;text-transform:uppercase;color:#111827;margin:0 0 28px;padding-bottom:20px;border-bottom:1px solid #e5e7eb;line-height:1.6;font-family:Georgia,serif">${stripped}</p>`;
          i++; continue;
        }

        // Preâmbulo
        if (/^PREÂMBULO$/i.test(stripped)) {
          html += `<p style="text-align:center;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#9ca3af;margin:24px 0 16px;font-family:Arial,sans-serif">${stripped}</p>`;
          i++; continue;
        }

        // Cabeçalho de cláusula
        if (/^CL[ÁA]USULA\s+[\dIVXLC]/i.test(stripped)) {
          html += `<div style=""><p style="font-size:10px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#374151;font-family:Arial,sans-serif;margin:32px 0 12px;padding:10px 14px;background:#f9fafb;border-left:3px solid #059669;line-height:1.5">${stripped}</p>`;
          // Inclui os próximos parágrafos da cláusula no mesmo bloco
          i++;
          while (i < lines.length) {
            const nextTrimmed = lines[i].trim();
            const nextStripped = nextTrimmed.replace(/\*\*/g, '').trim();
            // Para quando encontrar outra cláusula, título ou assinatura
            if (!nextStripped) { html += '<div style="height:8px"></div>'; i++; continue; }
            if (/^CL[ÁA]USULA\s+[\dIVXLC]/i.test(nextStripped)) break;
            if (/^(CONTRATO|TERMO|ACORDO|INSTRUMENTO)\s+DE\s+/i.test(nextStripped) && nextStripped === nextStripped.toUpperCase()) break;
            if (/^_{3,}/.test(nextStripped)) break;
            if (/^[A-ZÀ-Ú][a-zA-ZÀ-ú\s]+\s*[-–]\s*(VENDEDOR|COMPRADOR|CONTRATANTE|CONTRATADO|LOCADOR|LOCATÁRIO|FREELANCER|PARTE [AB])$/i.test(nextStripped)) break;

            if (/^(\d+\.\d+\.?|§\d+[º°]?)\s/.test(nextStripped)) {
              const clean = nextStripped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              html += `<p style="text-align:justify;margin:0 0 10px;color:#1f2937;line-height:1.9;font-family:Georgia,serif;font-size:13px">${clean}</p>`;
            } else if (/^(CONTRATANTE|CONTRATADO|LOCADOR|LOCATÁRIO|PARTE [AB]|VENDEDOR|COMPRADOR|FREELANCER|REVELADORA|RECEPTORA)\s*:/i.test(nextStripped) || /^(CPF|CNPJ|TELEFONE|EMAIL|E-MAIL|ENDEREÇO)\s*:/i.test(nextStripped)) {
              const colonIdx = nextStripped.indexOf(':');
              const label = nextStripped.substring(0, colonIdx);
              const value = nextStripped.substring(colonIdx + 1).trim();
              html += `<p style="margin:0 0 5px;line-height:1.7;color:#1f2937;font-family:Georgia,serif;font-size:13px"><strong>${label}:</strong> ${value}</p>`;
            } else {
              const clean = nextStripped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              html += `<p style="text-align:justify;margin:0 0 10px;color:#1f2937;line-height:1.9;font-family:Georgia,serif;font-size:13px">${clean}</p>`;
            }
            i++;
          }
          html += '</div>';
          continue;
        }

        // Parágrafos numerados
        if (/^(\d+\.\d+\.?|§\d+[º°]?)\s/.test(stripped)) {
          const clean = stripped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          html += `<p style="text-align:justify;margin:0 0 10px;color:#1f2937;line-height:1.9;font-family:Georgia,serif;font-size:13px">${clean}</p>`;
          i++; continue;
        }

        // Campos de qualificação
        if (/^(CONTRATANTE|CONTRATADO|LOCADOR|LOCATÁRIO|PARTE [AB]|VENDEDOR|COMPRADOR|FREELANCER|REVELADORA|RECEPTORA)\s*:/i.test(stripped) || /^(CPF|CNPJ|TELEFONE|EMAIL|E-MAIL|ENDEREÇO)\s*:/i.test(stripped)) {
          const colonIdx = stripped.indexOf(':');
          const label = stripped.substring(0, colonIdx);
          const value = stripped.substring(colonIdx + 1).trim();
          html += `<p style="margin:0 0 5px;line-height:1.7;color:#1f2937;font-family:Georgia,serif;font-size:13px"><strong>${label}:</strong> ${value}</p>`;
          i++; continue;
        }

        // Remove referências a testemunhas (linha inteira que menciona testemunha)
        if (/testemunha|witness/i.test(stripped)) {
          i++; continue;
        }

        // Frase de encerramento — remove menção a testemunhas mas mantém a frase
        if (/^e,?\s+por\s+estarem\s+assim/i.test(stripped)) {
          const clean = stripped
            .replace(/,?\s*juntamente\s+com\s+\d+\s*\(duas?\)\s*testemunhas?/gi, '')
            .replace(/,?\s*na\s+presença\s+das?\s+testemunhas?\s+abaixo/gi, '')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          html += `<p style="text-align:justify;margin:0 0 10px;color:#1f2937;line-height:1.9;font-family:Georgia,serif;font-size:13px">${clean}</p>`;
          i++; continue;
        }

        // Data/local de assinatura
        if (/^(local e data|assim justas|em\s+\d|imperatriz|são paulo|rio de janeiro|\w+,\s+\d+\s+de\s+\w+\s+de\s+\d{4})/i.test(stripped)) {
          html += `<p style="text-align:center;margin:24px 0 32px;color:#4b5563;font-family:Georgia,serif;font-size:13px">${stripped}</p>`;
          i++; continue;
        }

        // Bloco de assinaturas — coleta pares e renderiza lado a lado
        if (/^_{3,}/.test(stripped)) {
          // Coleta todos os blocos de assinatura consecutivos
          const sigs = [];
          let j = i;
          while (j < lines.length) {
            const s = lines[j].trim().replace(/\*\*/g, '').trim();
            if (/^_{3,}/.test(s)) {
              // Linha de assinatura
              let nameLabel = '';
              if (j + 1 < lines.length) {
                const next = lines[j + 1].trim().replace(/\*\*/g, '').trim();
                if (/^[A-ZÀ-Úa-záéíóúâêîôûãõç]/.test(next) && next !== '') {
                  nameLabel = next;
                  j++;
                }
              }
              sigs.push(nameLabel);
              j++;
            } else if (s === '') {
              j++;
            } else {
              break;
            }
          }

          if (sigs.length >= 2) {
            // Renderiza em grid lado a lado
            html += `<div style="display:table;width:100%;margin-top:48px;page-break-inside:avoid">`;
            sigs.forEach((label) => {
              html += `
                <div style="display:table-cell;width:${Math.floor(100/sigs.length)}%;text-align:center;padding:0 16px;vertical-align:top">
                  <div style="border-top:1px solid #9ca3af;padding-top:10px;margin-top:64px">
                    <p style="font-weight:bold;font-size:12px;color:#1f2937;font-family:Arial,sans-serif;margin:0">${label}</p>
                  </div>
                </div>`;
            });
            html += `</div>`;
            i = j;
          } else {
            // Assinatura única — centraliza
            const label = sigs[0] || '';
            html += `
              <div style="text-align:center;margin-top:48px;page-break-inside:avoid">
                <div style="display:inline-block;width:60%;border-top:1px solid #9ca3af;padding-top:10px;margin-top:64px">
                  <p style="font-weight:bold;font-size:12px;color:#1f2937;font-family:Arial,sans-serif;margin:0">${label}</p>
                </div>
              </div>`;
            i = j;
          }
          continue;
        }

        // Nome - PAPEL (assinatura sem linha acima — ignora pois já foi consumido)
        if (/^[A-ZÀ-Úa-záéíóúâêîôûãõç][a-zA-ZÀ-ú\s]+\s*[-–]\s*(VENDEDOR|COMPRADOR|CONTRATANTE|CONTRATADO|LOCADOR|LOCATÁRIO|FREELANCER|PARTE [AB])$/i.test(stripped)) {
          i++; continue;
        }

        // Parágrafo normal
        const clean = stripped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html += `<p style="text-align:justify;margin:0 0 10px;color:#1f2937;line-height:1.9;font-family:Georgia,serif;font-size:13px">${clean}</p>`;
        i++;
      }

      return html;
    };

    const formattedHTML = formatText(contractText);

    // Extrai os nomes das partes do texto do contrato
    const extractNames = (text, contractId) => {
      const patterns = {
        'compra-venda':           [/VENDEDOR[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i, /COMPRADOR[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i],
        'prestacao-servicos':     [/CONTRATANTE[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i, /CONTRATADO[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i],
        'aluguel':                [/LOCADOR[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i, /LOCATÁRIO[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i],
        'trabalho-freelancer':    [/CONTRATANTE[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i, /FREELANCER[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i],
        'parceria':               [/PARTE A[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i, /PARTE B[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i],
        'confidencialidade':      [/REVELADORA[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i, /RECEPTORA[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i],
        'empreitada':             [/CONTRATANTE[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i, /EMPREITEIRO[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i],
        'sociedade':              [/SÓCIO A[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i, /SÓCIO B[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i],
        'representacao-comercial':[/REPRESENTADA[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i, /REPRESENTANTE[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i],
        'comodato':               [/COMODANTE[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i, /COMODATÁRIO[:\s,]+([A-ZÀ-Úa-záéíóúâêîôûãõç][^\n,;]+?)(?:\s*,|\s*CPF|\s*CNPJ|\s*telefone)/i],
      };
      const pats = patterns[contractId] || [];
      return pats.map(p => {
        const m = text.match(p);
        return m ? m[1].trim().replace(/\*\*/g, '') : '';
      });
    };

    const names = extractNames(contractText, selectedContract?.id);
    const colWidth = 50;

    const sigCells = names.map(name =>
      `<div style="display:table-cell;width:${colWidth}%;text-align:center;padding:0 24px;vertical-align:top">
        <div style="height:72px"></div>
        <div style="border-top:1px solid #9ca3af;padding-top:10px">
          <p style="font-size:12px;color:#1f2937;font-family:Georgia,serif;margin:0">${name}</p>
        </div>
      </div>`
    ).join('');

    const sigBlock = `<div style="margin-top:56px;page-break-inside:avoid"><div style="display:table;width:100%">${sigCells}</div></div>`;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding:40px 56px;background:white;font-family:Georgia,serif;max-width:800px;';
    wrapper.innerHTML = formattedHTML + sigBlock;

    const loadScript = (src) => new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js')
      .then(() => {
        const opt = {
          margin: [15, 15, 15, 15],
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        window.html2pdf().set(opt).from(wrapper).save();
      })
      .catch(() => {
        const blob = new Blob([contractText.replace(/\*\*/g, '')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = fileName.replace('.pdf', '.txt');
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      });
  };

  const isDesktop = windowWidth >= 1024;

  return (
    <div style={{
      height: 'calc(var(--vh, 1vh) * 100)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', backgroundColor: '#080d14',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {isDesktop && <ProgressSidebar currentStep={currentStep} contractType={selectedContract} />}

      <main style={{ flex: 1, marginLeft: isDesktop ? '260px' : 0, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

        {currentStep === 1 && (
          <div style={{
            flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch',
            backgroundImage: `linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}>
            <ChatUserAvatar showInChat={false} />
            <ContractTypeSelector onSelect={handleSelectContract} />
          </div>
        )}

        {currentStep >= 2 && selectedContract && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0a1018' }}>
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

            <div style={{ flexShrink: 0, position: 'sticky', bottom: 0, zIndex: 10 }}>
              <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSendMessage} disabled={isTyping || isGenerating} />
            </div>
          </div>
        )}
      </main>

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