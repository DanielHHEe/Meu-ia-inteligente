// src/ContractViewer.jsx
// ContractViewer com gate de pagamento — download só liberado após Pix confirmado
// Layout reestruturado: premium, minimalista, sem seção de testemunhas

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle, ArrowLeft, Loader2, Sparkles, Lock } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import PaymentModal from './PaymentModal';

// ============================================================
// Títulos por tipo de contrato (para resolver contractType string)
// ============================================================
const CONTRACT_TITLES = {
  'prestacao-servicos':    'Contrato de Prestação de Serviços',
  'aluguel':               'Contrato de Locação de Imóvel',
  'parceria':              'Contrato de Parceria Comercial',
  'confidencialidade':     'Acordo de Confidencialidade (NDA)',
  'trabalho-freelancer':   'Contrato de Trabalho Freelancer',
  'compra-venda':          'Contrato de Compra e Venda',
  'empreitada':            'Contrato de Empreitada',
  'sociedade':             'Contrato Social de Sociedade Simples',
  'representacao-comercial': 'Contrato de Representação Comercial',
  'comodato':              'Contrato de Comodato',
};

// Normaliza contractType para sempre ser { id, name }
const normalizeContractType = (contractType) => {
  if (!contractType) return { id: '', name: 'Contrato' };
  if (typeof contractType === 'string') {
    return { id: contractType, name: CONTRACT_TITLES[contractType] || 'Contrato' };
  }
  return contractType;
};

// ============================================================
// Formata o texto do contrato em HTML com negritos e parágrafos
// ============================================================
const formatContractText = (text) => {
  if (!text) return '';

  const lines = text.split('\n');
  let html = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      html += '<div class="c-spacer"></div>';
      continue;
    }

    // Remove asteriscos de markdown para fazer os testes de padrão
    const stripped = trimmed.replace(/\*\*/g, '').trim();

    // Título principal do contrato — com ou sem asteriscos
    // Ex: **CONTRATO DE COMPRA E VENDA** ou CONTRATO DE COMPRA E VENDA
    if (
      /^(CONTRATO|TERMO|ACORDO|INSTRUMENTO)\s+DE\s+/i.test(stripped) &&
      stripped === stripped.toUpperCase()
    ) {
      html += `<p class="c-title">${stripped}</p>`;
      continue;
    }

    // PREÂMBULO — com ou sem asteriscos
    if (/^PREÂMBULO$/i.test(stripped)) {
      html += `<p class="c-preamble">${stripped}</p>`;
      continue;
    }

    // Cabeçalho de cláusula — detecta mesmo com **asteriscos** ao redor
    // Ex: **CLÁUSULA 1ª — DO OBJETO** ou CLÁUSULA 1ª — DO OBJETO
    if (/^CL[ÁA]USULA\s+[\dIVXLC]/i.test(stripped)) {
      html += `<p class="c-clause">${stripped}</p>`;
      continue;
    }

    // Parágrafos numerados: 1.1., 2.3., §1º, §2º
    if (/^(\d+\.\d+\.?|§\d+[º°]?)\s/.test(stripped)) {
      const clean = stripped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html += `<p class="c-para">${clean}</p>`;
      continue;
    }

    // Campos de qualificação (CONTRATANTE:, CPF:, etc.)
    if (
      /^(CONTRATANTE|CONTRATADO|LOCADOR|LOCATÁRIO|PARTE [AB]|REVELADORA|RECEPTORA|VENDEDOR|COMPRADOR|FREELANCER)\s*:/i.test(stripped) ||
      /^(CPF|CNPJ|CPF\/CNPJ|TELEFONE|EMAIL|E-MAIL|ENDEREÇO|OBJETO|VALOR|FORMA DE PAGAMENTO|PRAZO|MULTA|CIDADE|ESTADO|IMÓVEL|BEM)\s*:/i.test(stripped)
    ) {
      const colonIdx = stripped.indexOf(':');
      const label = stripped.substring(0, colonIdx);
      const value = stripped.substring(colonIdx + 1).trim();
      html += `<p class="c-field"><strong>${label}:</strong> ${value}</p>`;
      continue;
    }

    // Linha de local e data / assinatura
    if (/^(local e data|e, por estarem|assim justas|em 2 \(duas\)|imperatriz|são paulo|rio de janeiro)/i.test(stripped)) {
      html += `<p class="c-center">${stripped}</p>`;
      continue;
    }

    // Linha de assinatura ___  ou nome - PAPEL
    if (/^_{3,}/.test(stripped)) {
      html += `<p class="c-center">${stripped}</p>`;
      continue;
    }

    // Linha com nome e papel de assinatura: "Daniel Herenio - VENDEDOR"
    if (/^[A-ZÀ-Ú][a-zA-ZÀ-ú\s]+\s*[-–]\s*(VENDEDOR|COMPRADOR|CONTRATANTE|CONTRATADO|LOCADOR|LOCATÁRIO|FREELANCER|PARTE [AB])$/i.test(stripped)) {
      html += `<p class="c-center" style="font-weight:600;">${stripped}</p>`;
      continue;
    }

    // Parágrafo normal — mantém bold inline se houver
    const clean = stripped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html += `<p class="c-para">${clean}</p>`;
  }

  return html;
};

// ============================================================
// Rótulos de assinatura por tipo de contrato
// ============================================================
const getSignatureLabels = (contractTypeId) => {
  const labels = {
    'aluguel':             [{ label: 'LOCADOR',          sublabel: 'Assinatura e Carimbo' }, { label: 'LOCATÁRIO',       sublabel: 'Assinatura e Carimbo' }],
    'prestacao-servicos':  [{ label: 'CONTRATANTE',      sublabel: 'Assinatura e Carimbo' }, { label: 'CONTRATADO',      sublabel: 'Assinatura e Carimbo' }],
    'trabalho-freelancer': [{ label: 'CONTRATANTE',      sublabel: 'Assinatura e Carimbo' }, { label: 'FREELANCER',      sublabel: 'Assinatura e Carimbo' }],
    'compra-venda':        [{ label: 'VENDEDOR',         sublabel: 'Assinatura e Carimbo' }, { label: 'COMPRADOR',       sublabel: 'Assinatura e Carimbo' }],
    'parceria':            [{ label: 'PARTE A',          sublabel: 'Assinatura e Carimbo' }, { label: 'PARTE B',         sublabel: 'Assinatura e Carimbo' }],
    'confidencialidade':   [{ label: 'PARTE REVELADORA', sublabel: 'Assinatura e Carimbo' }, { label: 'PARTE RECEPTORA', sublabel: 'Assinatura e Carimbo' }],
  };
  return labels[contractTypeId] || [
    { label: 'CONTRATANTE', sublabel: 'Assinatura e Carimbo' },
    { label: 'CONTRATADO',  sublabel: 'Assinatura e Carimbo' },
  ];
};

// ============================================================
// Componente principal
// ============================================================
const ContractViewer = ({ contract, contractType, onBack, onDownload }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded]   = useState(false);
  const [isPaid, setIsPaid]           = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const paperRef = useRef(null);

  const ct = normalizeContractType(contractType);

  const getDateTimeString = () => {
    const now  = new Date();
    const data = now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    const hora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${data} às ${hora}`;
  };

  const triggerDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      if (onDownload) {
        await onDownload('pdf');
      } else if (paperRef.current) {
        const opt = {
          margin:     [15, 15, 15, 15],
          filename:   `${ct.name || 'contrato'}.pdf`,
          image:      { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          jsPDF:      { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        await html2pdf().set(opt).from(paperRef.current).save();
      }
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadClick = () => {
    if (isPaid) triggerDownload();
    else setShowPayment(true);
  };

  const handlePaymentConfirmed = () => {
    setIsPaid(true);
    setShowPayment(false);
    setTimeout(() => triggerDownload(), 300);
  };

  const formattedHTML    = formatContractText(contract);
  const signatureLabels  = getSignatureLabels(ct.id);

  return (
    <div className="cv-viewer">

      {/* ── Estilos ───────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        /* Reset e base */
        .cv-viewer *, .cv-viewer *::before, .cv-viewer *::after {
          box-sizing: border-box; margin: 0; padding: 0;
        }

        /* Layout raiz */
        .cv-viewer {
          background: #f0f2ef;
          min-height: 100vh;
          padding: 36px 16px 64px;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .cv-container {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ── Topbar ───────────────────────────────────────────── */
        .cv-topbar {
          background: #ffffff;
          border: 1px solid #e2e5e0;
          border-radius: 12px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cv-topbar-left {
          display: flex;
          align-items: center;
          gap: 13px;
          flex: 1;
          min-width: 0;
        }
        .cv-topbar-icon {
          width: 40px; height: 40px; min-width: 40px;
          background: #f0faf5;
          border: 1px solid #d1f0e2;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }
        .cv-topbar-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cv-topbar-sub {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #059669;
          font-weight: 500;
          margin-top: 3px;
          letter-spacing: 0.01em;
        }

        /* ── Botão de pagamento / download ───────────────────── */
        .cv-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: none;
          border-radius: 9px;
          padding: 9px 20px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.12s;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .cv-btn:hover  { opacity: 0.87; transform: translateY(-1px); }
        .cv-btn:active { transform: translateY(0); }
        .cv-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .cv-btn.locked {
          background: #d97706;
          color: #fff;
        }
        .cv-btn.unlocked {
          background: #059669;
          color: #fff;
        }

        /* ── Banner de aviso / pago ───────────────────────────── */
        .cv-notice {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          border-radius: 9px;
          padding: 11px 16px;
          font-size: 12.5px;
          font-weight: 500;
        }
        .cv-notice.pending {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #78350f;
        }
        .cv-notice.paid {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #064e3b;
        }
        .cv-notice-left {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .cv-notice-pay-btn {
          padding: 6px 14px;
          border-radius: 7px;
          background: #d97706;
          color: #fff;
          font-weight: 600;
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .cv-notice-pay-btn:hover { opacity: 0.87; }

        /* ── Papel do contrato ────────────────────────────────── */
        .cv-paper {
          background: #ffffff;
          border: 1px solid #e2e5e0;
          border-radius: 12px;
          overflow: hidden;
        }

        /* Faixa decorativa superior */
        .cv-paper-strip {
          height: 2px;
          background: linear-gradient(90deg, #059669 0%, #34d399 60%, #6ee7b7 100%);
        }

        /* Wrapper capturado pelo html2pdf */
        .cv-paper-inner { }

        /* Cabeçalho interno do papel */
        .cv-paper-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 52px 0;
          border-bottom: 1px solid #f3f4f2;
          padding-bottom: 16px;
          margin-bottom: 4px;
        }
        .cv-paper-header-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9ca3af;
          font-family: 'Inter', sans-serif;
        }
        .cv-paper-header-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #34d399;
        }
        .cv-paper-header-num {
          font-size: 10.5px;
          color: #d1d5db;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          letter-spacing: 0.05em;
        }

        /* Corpo com scroll */
        .cv-paper-scroll {
          padding: 44px 64px 40px;
          max-height: 62vh;
          overflow-y: auto;
          position: relative;
        }
        .cv-paper-scroll::-webkit-scrollbar { width: 3px; }
        .cv-paper-scroll::-webkit-scrollbar-track { background: transparent; }
        .cv-paper-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        .cv-paper-scroll::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

        /* Fade no rodapé quando não pago */
        .cv-paper.locked .cv-paper-scroll::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 160px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.98));
          pointer-events: none;
        }

        /* ── Tipografia do contrato ───────────────────────────── */
        .cv-contract-body {
          font-family: 'EB Garamond', Georgia, 'Times New Roman', serif;
          font-size: 14px;
          color: #1c1c1c;
          line-height: 2;
          word-wrap: break-word;
          overflow-wrap: break-word;
          width: 100%;
        }

        /* Título principal */
        .cv-contract-body .c-title {
          text-align: center;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #111827;
          margin-bottom: 36px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f0f0ee;
          line-height: 1.6;
        }

        /* Preâmbulo */
        .cv-contract-body .c-preamble {
          text-align: center;
          font-weight: 500;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin: 32px 0 20px;
          font-family: 'Inter', sans-serif;
        }

        /* Cabeçalho de cláusula */
        .cv-contract-body .c-clause {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #374151;
          font-family: 'Inter', sans-serif;
          margin: 40px 0 16px;
          padding: 12px 16px;
          background: #f9fafb;
          border-left: 3px solid #059669;
          border-radius: 0 6px 6px 0;
          line-height: 1.5;
        }

        /* Parágrafos numerados */
        .cv-contract-body .c-para {
          text-align: justify;
          margin-bottom: 12px;
          hyphens: auto;
          color: #1f2937;
          line-height: 2;
        }

        /* Campos de qualificação */
        .cv-contract-body .c-field {
          margin-bottom: 6px;
          line-height: 1.8;
          padding: 2px 0;
          color: #1f2937;
        }
        .cv-contract-body .c-field strong {
          font-weight: 600;
          color: #111827;
        }

        /* Centro (local/data, assinatura) */
        .cv-contract-body .c-center {
          text-align: center;
          margin: 16px 0 10px;
          color: #4b5563;
        }

        /* Espaçador */
        .cv-contract-body .c-spacer {
          height: 10px;
        }

        /* Bloco de qualificação das partes — agrupamento visual */
        .cv-contract-body .c-field + .c-field {
          border-top: none;
        }

        /* ── Divisor antes das assinaturas ───────────────────── */
        .cv-sig-divider {
          margin: 0 52px;
          border: none;
          border-top: 1px solid #f0f0ee;
        }

        /* ── Seção de assinaturas ─────────────────────────────── */
        .cv-sig-section {
          padding: 0 64px 52px;
        }
        .cv-sig-date {
          text-align: center;
          font-family: 'EB Garamond', serif;
          font-size: 13px;
          color: #9ca3af;
          font-style: italic;
          padding: 32px 0 48px;
          line-height: 1.6;
        }
        .cv-sig-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
        }
        .cv-sig-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .cv-sig-space { height: 72px; }
        .cv-sig-line {
          width: 100%;
          height: 1px;
          background: #d1d5db;
        }
        .cv-sig-label {
          font-family: 'Inter', sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1f2937;
          text-align: center;
        }
        .cv-sig-sublabel {
          font-family: 'Inter', sans-serif;
          font-size: 10.5px;
          color: #9ca3af;
          text-align: center;
          margin-top: -4px;
          letter-spacing: 0.02em;
        }

        /* ── Rodapé do papel ──────────────────────────────────── */
        .cv-paper-footer {
          border-top: 1px solid #f3f4f2;
          margin: 0 52px;
          padding: 14px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 10.5px;
          color: #d1d5db;
          letter-spacing: 0.04em;
        }
        .cv-paper-footer-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #e5e7eb;
        }

        /* ── Botão voltar ─────────────────────────────────────── */
        .cv-back {
          text-align: center;
          padding-top: 8px;
        }
        .cv-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: 1px solid #e2e5e0;
          border-radius: 9px;
          padding: 9px 22px;
          font-size: 12.5px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          color: #6b7280;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          letter-spacing: -0.01em;
        }
        .cv-back-btn:hover {
          border-color: #059669;
          color: #059669;
          background: #f0faf5;
        }

        /* ── Animação spin ────────────────────────────────────── */
        @keyframes cv-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .cv-spin { animation: cv-spin 1s linear infinite; }

        /* ── Responsivo ───────────────────────────────────────── */
        @media (max-width: 600px) {
          .cv-paper-header  { padding: 16px 20px 14px; }
          .cv-paper-scroll  { padding: 28px 22px 28px; }
          .cv-sig-section   { padding: 0 22px 36px; }
          .cv-sig-divider   { margin: 0 20px; }
          .cv-sig-grid      { gap: 40px; }
          .cv-paper-footer  { margin: 0 20px; }
          .cv-topbar-title  { font-size: 13px; }
        }

        /* ── Impressão / PDF ──────────────────────────────────── */
        @media print {
          .cv-paper-scroll { max-height: none; overflow: visible; }
          .cv-paper-scroll::after { display: none; }
          .cv-sig-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── Container ───────────────────────────────────────────── */}
      <div className="cv-container">

        {/* Topbar */}
        <motion.div
          className="cv-topbar"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="cv-topbar-left">
            <div className="cv-topbar-icon">
              <FileText size={18} color="#059669" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="cv-topbar-title">
                {ct.name} — Documento Gerado
              </div>
              <div className="cv-topbar-sub">
                <Sparkles size={11} />
                Gerado por IA · Pronto para assinatura
              </div>
            </div>
          </div>

          <button
            className={`cv-btn ${isPaid ? 'unlocked' : 'locked'}`}
            onClick={handleDownloadClick}
            disabled={downloading}
          >
            {downloading ? (
              <><Loader2 size={14} className="cv-spin" /><span>Gerando PDF...</span></>
            ) : downloaded ? (
              <><CheckCircle size={14} /><span>Baixado!</span></>
            ) : isPaid ? (
              <><Download size={14} /><span>Baixar PDF</span></>
            ) : (
              <><Lock size={14} /><span>Pagar R$ 29,90</span></>
            )}
          </button>
        </motion.div>

        {/* Banner de status */}
        <div className={`cv-notice ${isPaid ? 'paid' : 'pending'}`}>
          {isPaid ? (
            <div className="cv-notice-left">
              <CheckCircle size={14} />
              <span>Pagamento confirmado — Download liberado!</span>
            </div>
          ) : (
            <>
              <div className="cv-notice-left">
                <Lock size={13} />
                <span>Contrato pronto! Pague R$ 29,90 via Pix para liberar o download.</span>
              </div>
              <button className="cv-notice-pay-btn" onClick={() => setShowPayment(true)}>
                Pagar agora
              </button>
            </>
          )}
        </div>

        {/* Papel do contrato */}
        <motion.div
          className={`cv-paper ${isPaid ? '' : 'locked'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="cv-paper-strip" />

          {/* Cabeçalho interno do papel */}
          <div className="cv-paper-header">
            <div className="cv-paper-header-badge">
              <div className="cv-paper-header-dot" />
              Documento válido
            </div>
            <div className="cv-paper-header-num">
              {getDateTimeString()}
            </div>
          </div>

          {/* Tudo dentro de paperRef é capturado pelo html2pdf */}
          <div ref={paperRef} className="cv-paper-inner">

            <div className="cv-paper-scroll">
              <div
                className="cv-contract-body"
                dangerouslySetInnerHTML={{ __html: formattedHTML }}
              />
            </div>

            {/* Divisor */}
            <hr className="cv-sig-divider" />

            {/* Assinaturas — sem testemunhas */}
            <div className="cv-sig-section">
              <div className="cv-sig-date">
                {getDateTimeString()}
              </div>

              <div className="cv-sig-grid">
                {signatureLabels.map(({ label, sublabel }) => (
                  <div key={label} className="cv-sig-block">
                    <div className="cv-sig-space" />
                    <div className="cv-sig-line" />
                    <div className="cv-sig-label">{label}</div>
                    <div className="cv-sig-sublabel">{sublabel}</div>
                  </div>
                ))}
              </div>
            </div>



          </div>
        </motion.div>

        {/* Voltar */}
        <div className="cv-back">
          <button className="cv-back-btn" onClick={onBack}>
            <ArrowLeft size={14} />
            Criar novo contrato
          </button>
        </div>

      </div>

      {/* Modal de pagamento */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPaymentConfirmed={handlePaymentConfirmed}
        contractType={ct}
      />
    </div>
  );
};

export default ContractViewer;