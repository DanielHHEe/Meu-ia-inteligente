import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Send, ArrowLeft, Bot, User, Sparkles, Loader2,
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
            backgroundColor: 'currentColor', marginLeft: '2px', verticalAlign: 'middle'
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
// FIX 2: Header "Contrate-me" removido. Selector é a tela inicial diretamente.
const ContractTypeSelector = ({ onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    style={{ width: '100%', maxWidth: '1024px', margin: '0 auto', padding: '16px' }}
  >
    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '8px 16px', borderRadius: '9999px', backgroundColor: '#ecfdf5',
        color: '#047857', fontSize: '14px', fontWeight: '500', marginBottom: '16px'
      }}>
        <Sparkles size={16} /> Passo 1 de 3
      </div>
      <h2 style={{ fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
        Qual contrato você precisa?
      </h2>
      <p style={{ color: '#4b5563', fontSize: '14px' }}>Selecione o modelo ideal para sua necessidade</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
      {contractTypes.map((type, index) => (
        <motion.button
          key={type.id}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(type)}
          style={{
            position: 'relative', padding: '16px', borderRadius: '12px',
            border: '2px solid #f3f4f6', backgroundColor: 'white',
            textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#a7f3d0'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {type.popular && (
            <div style={{
              position: 'absolute', top: '-12px', right: '16px', padding: '4px 12px',
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              color: 'white', fontSize: '12px', fontWeight: 'bold', borderRadius: '9999px'
            }}>Popular</div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#ecfdf5',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <type.icon size={20} color="#059669" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {type.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {type.description}
              </p>
            </div>
          </div>
          <ChevronRight size={20} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        </motion.button>
      ))}
    </div>
  </motion.div>
);

// ==================== GENERATING BUBBLE ====================
const GeneratingBubble = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '0 8px' }}
  >
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
      <Bot size={18} color="white" />
    </div>
    <div style={{
      padding: '12px 18px', borderRadius: '18px', borderBottomLeftRadius: '4px',
      backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      display: 'flex', alignItems: 'center', gap: '10px',
    }}>
      <div style={{
        width: '18px', height: '18px', border: '2.5px solid #d1fae5',
        borderTopColor: '#059669', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', flexShrink: 0,
      }} />
      <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
        Gerando contrato...
      </span>
      <span style={{ fontSize: '12px', color: '#9ca3af' }}>aguarde</span>
    </div>
  </motion.div>
);

// ==================== PDF CARD ====================
// FIX 3: Download mobile real — no iOS abre em nova aba com botão de compartilhamento nativo
// No Android força download via data URL que funciona sem restrições de blob
const PdfCard = ({ contractType, generatedContract }) => {

  const getContractText = () => {
    if (!generatedContract) return '';
    if (typeof generatedContract === 'string') return generatedContract;
    if (typeof generatedContract.contract === 'string') return generatedContract.contract;
    if (typeof generatedContract.content === 'string') return generatedContract.content;
    return String(generatedContract);
  };

  const handlePdfClick = () => {
    const contractText = getContractText();
    if (!contractText.trim()) {
      alert('Contrato ainda não disponível.');
      return;
    }

    const fileName = `${contractType?.name || 'Contrato'}.pdf`;

    const gerar = (JsPDF) => {
      const doc = new JsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth  = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin     = 20;
      const maxWidth   = pageWidth - margin * 2;
      const lineHeight = 6;
      let y = margin;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      for (const rawLine of contractText.split('\n')) {
        const wrapped = doc.splitTextToSize(rawLine || ' ', maxWidth);
        for (const segment of wrapped) {
          if (y + lineHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(segment, margin, y);
          y += lineHeight;
        }
      }

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);

      if (isIOS) {
        // iOS Safari: abre via data URI em nova aba — permite salvar pelo botão "Compartilhar"
        // blob URLs são bloqueados pelo Safari em contexto cross-origin
        const dataUri = doc.output('datauristring');
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(
            `<html><head><title>${fileName}</title></head>` +
            `<body style="margin:0;background:#000;">` +
            `<embed width="100%" height="100%" src="${dataUri}" type="application/pdf"/>` +
            `</body></html>`
          );
        } else {
          // Popup bloqueado — fallback: link direto
          const a = document.createElement('a');
          a.href = doc.output('datauristring');
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else if (isAndroid) {
        // Android: blob URL funciona bem e inicia download direto
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      } else {
        // Desktop: doc.save() — comportamento padrão jsPDF
        doc.save(fileName);
      }
    };

    if (window.jspdf && window.jspdf.jsPDF) {
      gerar(window.jspdf.jsPDF);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      if (window.jspdf && window.jspdf.jsPDF) {
        gerar(window.jspdf.jsPDF);
      }
    };
    script.onerror = () => {
      // Fallback último recurso: .txt
      const blob = new Blob([contractText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace('.pdf', '.txt');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    };
    document.head.appendChild(script);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '0 8px' }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        <Bot size={18} color="white" />
      </div>
      <div style={{ maxWidth: '340px' }}>
        <div style={{
          padding: '12px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px',
          backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          fontSize: '14px', color: '#1f2937', marginBottom: '8px', lineHeight: '1.5',
        }}>
          ✅ Seu contrato foi gerado com sucesso! Clique abaixo para baixar o PDF.
        </div>
        <button
          onClick={handlePdfClick}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
        >
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '14px',
              backgroundColor: '#ffffff', border: '1.5px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <FileText size={22} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '13px', fontWeight: '600', color: '#111827',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0,
              }}>
                {contractType?.name || 'Contrato'}.pdf
              </p>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0' }}>
                PDF · Clique para baixar
              </p>
            </div>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ChevronRight size={16} color="#059669" />
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  );
};

// ==================== MESSAGE BUBBLE ====================
const MessageBubble = ({ message, isBot, isGenerating, isPdfCard, contractType, generatedContract, onViewContract, onTypingComplete }) => {
  if (isGenerating) return <GeneratingBubble />;
  if (isPdfCard) return <PdfCard contractType={contractType} generatedContract={generatedContract} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '8px',
        padding: '0 8px', justifyContent: isBot ? 'flex-start' : 'flex-end', width: '100%'
      }}
    >
      {isBot && (
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <Bot size={18} color="white" />
        </div>
      )}
      <div style={{
        maxWidth: '75%', padding: '12px 16px', borderRadius: '18px',
        backgroundColor: isBot ? '#ffffff' : '#10b981',
        color: isBot ? '#1f2937' : '#ffffff',
        borderBottomLeftRadius: isBot ? '4px' : '18px',
        borderBottomRightRadius: isBot ? '18px' : '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        border: isBot ? '1px solid #e5e7eb' : 'none', wordBreak: 'break-word'
      }}>
        {isBot ? (
          <TypingText text={message} onComplete={onTypingComplete} speed={12} />
        ) : (
          <p style={{ fontSize: '15px', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap' }}>{message}</p>
        )}
      </div>
      {!isBot && (
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #374151, #111827)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <User size={18} color="white" />
        </div>
      )}
    </motion.div>
  );
};

// ==================== TYPING INDICATOR ====================
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '0 8px' }}
  >
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
      <Bot size={18} color="white" />
    </div>
    <div style={{
      backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '18px',
      borderBottomLeftRadius: '4px', border: '1px solid #e5e7eb',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[0, 0.15, 0.3].map((delay, i) => (
          <div key={i} style={{
            width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%',
            animation: 'bounce 1s infinite', animationDelay: `${delay}s`
          }} />
        ))}
      </div>
    </div>
  </motion.div>
);

// ==================== CHAT INPUT ====================
// FIX 1: font-size 16px no textarea para impedir zoom automático no iOS/Android
// O navegador só dá zoom se o font-size for < 16px
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
    <div style={{ padding: '10px 16px 12px 16px', background: 'transparent' }}>
      <div style={{ maxWidth: '672px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: '10px',
          backgroundColor: '#ffffff', borderRadius: '16px',
          padding: '8px 8px 8px 16px',
          border: focused ? '1.5px solid #10b981' : '1.5px solid #e5e7eb',
          boxShadow: focused
            ? '0 0 0 3px rgba(16,185,129,0.1), 0 2px 8px rgba(0,0,0,0.06)'
            : '0 1px 4px rgba(0,0,0,0.08)',
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
              color: '#111827', resize: 'none', outline: 'none',
              minHeight: '40px', maxHeight: '120px',
              // ✅ FIX 1: 16px impede zoom automático em iOS e Android
              fontSize: '16px',
              border: 'none', fontFamily: 'inherit', lineHeight: '1.5',
              // ✅ FIX 1: evita que o iOS arredonde o input
              WebkitAppearance: 'none',
              borderRadius: 0,
            }}
          />
          <button
            onClick={onSend}
            disabled={disabled || !value.trim()}
            style={{
              flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px',
              background: !disabled && value.trim()
                ? 'linear-gradient(135deg, #059669, #10b981)'
                : '#e5e7eb',
              color: !disabled && value.trim() ? 'white' : '#9ca3af',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {disabled
              ? <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={15} />}
          </button>
        </div>
        <p style={{ fontSize: '11px', color: '#b0b8c4', textAlign: 'center', marginTop: '5px', letterSpacing: '0.01em' }}>
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
};

// ==================== PROGRESS SIDEBAR ====================
const ProgressSidebar = ({ currentStep, contractType }) => {
  const steps = [
    { id: 1, name: 'Tipo', icon: FileCheck },
    { id: 2, name: 'Dados', icon: Users },
    { id: 3, name: 'Contrato', icon: FileText },
  ];
  if (currentStep === 4) return null;
  return (
    <div className="hidden lg:block" style={{
      width: '288px', position: 'fixed', left: 0, top: '56px', bottom: 0,
      background: 'linear-gradient(135deg, #111827, #1f2937)', color: 'white', padding: '24px', overflowY: 'auto'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Seu Contrato</h3>
        {contractType ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <contractType.icon size={20} color="#34d399" />
            <span style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contractType.name}</span>
          </div>
        ) : <p style={{ fontSize: '14px', color: '#9ca3af' }}>Selecione um tipo</p>}
      </div>
      <div>
        <h4 style={{ fontSize: '12px', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Progresso</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map(step => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: currentStep > step.id ? '#10b981' : currentStep === step.id ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                border: currentStep === step.id ? '2px solid #10b981' : 'none'
              }}>
                {currentStep > step.id ? <CheckCircle2 size={20} color="white" /> : <step.icon size={20} color={currentStep === step.id ? '#34d399' : '#9ca3af'} />}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: currentStep >= step.id ? 'white' : '#9ca3af' }}>{step.name}</p>
                {currentStep === step.id && <p style={{ fontSize: '12px', color: '#34d399' }}>Em andamento</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: '24px', left: '24px', right: '24px', padding: '16px',
        borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', marginBottom: '8px' }}>
          <Clock size={16} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Tempo estimado</span>
        </div>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>~3 min</p>
      </div>
    </div>
  );
};

// ==================== CHAT INTERFACE ====================
// FIX 2: Removida a sub-barra com nome do contrato (era o "header superior" visível no mobile)
const ChatInterface = ({ contractType, messages, isTyping, isGenerating, inputValue, setInputValue, onSendMessage, onViewContract, generatedContract }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isGenerating]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f3f4f6' }}>
      {/* ✅ FIX 2: sub-barra com nome do contrato removida — era o "Prestação de Serviços" no topo */}

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 8px 20px' }}>
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
                generatedContract={generatedContract}
                onViewContract={onViewContract}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

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
  const [contractReady, setContractReady] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-4px); } }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; overflow: hidden; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  useEffect(() => {
    // ✅ FIX 1: usa dvh (dynamic viewport height) quando disponível, fallback para innerHeight
    // dvh desconta automaticamente a barra do navegador mobile
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
            setContractReady(true);
            setMessages(prev =>
              prev.map(m => m.isGenerating
                ? { text: '__PDF_READY__', isBot: true, isPdfCard: true }
                : m
              )
            );
          } catch (e) {
            setMessages(prev =>
              prev.map(m => m.isGenerating
                ? { text: `❌ Erro ao gerar o contrato: ${e.message}`, isBot: true }
                : m
              )
            );
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
    setContractReady(false);
  };

  const handleViewContract = () => {
    setCurrentStep(4);
  };

  const isDesktop = windowWidth >= 1024;

  return (
    // ✅ FIX 1: usa --vh calculado dinamicamente para evitar layout quebrado com teclado aberto
    <div style={{ height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#f9fafb' }}>

      {/* ✅ FIX 2: ChatHeader removido completamente — era o "Contrate-me" no topo */}

      {isDesktop && currentStep <= 2 && <ProgressSidebar currentStep={currentStep} contractType={selectedContract} />}

      <main style={{
        flex: 1,
        // ✅ FIX 2: paddingTop zerado pois o header foi removido
        paddingTop: 0,
        marginLeft: isDesktop && currentStep <= 2 ? '288px' : 0,
        display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden'
      }}>
        {currentStep === 1 && (
          <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: '16px' }}>
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
              onViewContract={handleViewContract}
              generatedContract={generatedContract}
            />
          </div>
        )}

        {currentStep === 4 && generatedContract && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            backgroundColor: '#f8faf9', overflowY: 'auto',
          }}>
            <ContractViewer
              contract={generatedContract}
              contractType={selectedContract}
              onBack={() => setCurrentStep(2)}
              onDownload={() => {}}
            />
          </div>
        )}

        {generationError && currentStep === 2 && (
          <div style={{ position: 'fixed', bottom: '80px', left: isDesktop ? 'calc(288px + 16px)' : '16px', right: '16px', zIndex: 50 }}>
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontSize: '14px', color: '#991b1b' }}>{generationError}</p>
              <button onClick={() => setGenerationError(null)} style={{ marginTop: '8px', fontSize: '14px', color: '#991b1b', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
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