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

    // Título principal do contrato (ex: CONTRATO DE PRESTAÇÃO DE SERVIÇOS)
    if (
      /^(CONTRATO|TERMO|ACORDO|INSTRUMENTO)\s+DE\s+/i.test(trimmed) &&
      trimmed === trimmed.toUpperCase()
    ) {
      html += `<p class="c-title">${trimmed}</p>`;
      continue;
    }

    // PREÂMBULO
    if (/^PREÂMBULO$/i.test(trimmed)) {
      html += `<p class="c-preamble">${trimmed}</p>`;
      continue;
    }

    // Cabeçalho de cláusula: CLÁUSULA Xª — ...
    if (/^CLÁUSULA\s+\d|^CLAUSULA\s+\d|^CL[ÁA]USULA\s+[IVXLC]+/i.test(trimmed)) {
      const clean = trimmed.replace(/\*\*/g, '');
      html += `<p class="c-clause">${clean}</p>`;
      continue;
    }

    // Parágrafos numerados: 1.1., 2.3., §1º, §2º
    if (/^(\d+\.\d+\.?|§\d+[º°]?)\s/.test(trimmed)) {
      const clean = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html += `<p class="c-para">${clean}</p>`;
      continue;
    }

    // Campos de qualificação (CONTRATANTE:, CPF:, etc.)
    if (
      /^(CONTRATANTE|CONTRATADO|LOCADOR|LOCATÁRIO|PARTE [AB]|REVELADORA|RECEPTORA|VENDEDOR|COMPRADOR|FREELANCER)\s*:/i.test(trimmed) ||
      /^(CPF|CNPJ|CPF\/CNPJ|TELEFONE|EMAIL|E-MAIL|ENDEREÇO|OBJETO|VALOR|FORMA DE PAGAMENTO|PRAZO|MULTA|CIDADE|ESTADO|IMÓVEL|BEM)\s*:/i.test(trimmed)
    ) {
      const colonIdx = trimmed.indexOf(':');
      const label = trimmed.substring(0, colonIdx);
      const value = trimmed.substring(colonIdx + 1).trim();
      html += `<p class="c-field"><strong>${label}:</strong> ${value}</p>`;
      continue;
    }

    // Linha de local e data / assinatura
    if (/^(local e data|e, por estarem|assim justas|em 2 \(duas\))/i.test(trimmed)) {
      const clean = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html += `<p class="c-center">${clean}</p>`;
      continue;
    }

    // Linha de assinatura ___
    if (/^_{3,}/.test(trimmed)) {
      html += `<p class="c-center">${trimmed}</p>`;
      continue;
    }

    // Parágrafo normal
    const clean = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
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

  // ← única alteração: normaliza aqui, o resto do componente usa ct
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
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* Reset e base */
        .cv-viewer *, .cv-viewer *::before, .cv-viewer *::after {
          box-sizing: border-box; margin: 0; padding: 0;
          font-family: 'DM Sans', sans-serif;
        }

        /* Layout raiz */
        .cv-viewer {
          background: #f4f5f3;
          min-height: 100vh;
          padding: 32px 16px 56px;
        }
        .cv-container {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Topbar ───────────────────────────────────────────── */
        .cv-topbar {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .cv-topbar-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 0;
        }
        .cv-topbar-icon {
          width: 42px; height: 42px; min-width: 42px;
          background: #ecfdf5;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .cv-topbar-title {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cv-topbar-sub {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #059669;
          font-weight: 500;
          margin-top: 3px;
        }

        /* ── Botão de pagamento / download ───────────────────── */
        .cv-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          border-radius: 10px;
          padding: 10px 22px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .cv-btn:hover  { opacity: 0.88; transform: translateY(-1px); }
        .cv-btn:active { transform: translateY(0); }
        .cv-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .cv-btn.locked {
          background: #f59e0b;
          color: #fff;
          box-shadow: 0 3px 12px rgba(245,158,11,0.28);
        }
        .cv-btn.unlocked {
          background: #059669;
          color: #fff;
          box-shadow: 0 3px 12px rgba(5,150,105,0.28);
        }

        /* ── Banner de aviso / pago ───────────────────────────── */
        .cv-notice {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          border-radius: 10px;
          padding: 12px 18px;
          font-size: 13px;
          font-weight: 500;
        }
        .cv-notice.pending {
          background: #fffbeb;
          border: 1px solid #fcd34d;
          color: #92400e;
        }
        .cv-notice.paid {
          background: #ecfdf5;
          border: 1px solid #6ee7b7;
          color: #065f46;
        }
        .cv-notice-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cv-notice-pay-btn {
          padding: 7px 16px;
          border-radius: 8px;
          background: #f59e0b;
          color: #fff;
          font-weight: 600;
          font-size: 12px;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .cv-notice-pay-btn:hover { opacity: 0.88; }

        /* ── Papel do contrato ────────────────────────────────── */
        .cv-paper {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
        }
        .cv-paper-strip {
          height: 3px;
          background: linear-gradient(90deg, #059669, #34d399);
        }

        /* Wrapper capturado pelo html2pdf */
        .cv-paper-inner { }

        /* Corpo com scroll */
        .cv-paper-scroll {
          padding: 52px 64px 40px;
          max-height: 64vh;
          overflow-y: auto;
          position: relative;
        }
        .cv-paper-scroll::-webkit-scrollbar { width: 4px; }
        .cv-paper-scroll::-webkit-scrollbar-track { background: transparent; }
        .cv-paper-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        .cv-paper-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

        /* Fade no rodapé quando não pago */
        .cv-paper.locked .cv-paper-scroll::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 140px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.97));
          pointer-events: none;
        }

        /* ── Tipografia do contrato ───────────────────────────── */
        .cv-contract-body {
          font-family: 'EB Garamond', Georgia, 'Times New Roman', serif;
          font-size: 13.5px;
          color: #1a1a1a;
          line-height: 1.9;
          word-wrap: break-word;
          overflow-wrap: break-word;
          width: 100%;
        }
        .cv-contract-body .c-title {
          text-align: center;
          font-weight: 600;
          font-size: 14.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 32px;
        }
        .cv-contract-body .c-preamble {
          text-align: center;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #6b7280;
          margin: 28px 0 16px;
        }
        .cv-contract-body .c-clause {
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin: 34px 0 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f0f0f0;
          color: #111827;
        }
        .cv-contract-body .c-para {
          text-align: justify;
          margin-bottom: 10px;
          hyphens: auto;
        }
        .cv-contract-body .c-field {
          margin-bottom: 5px;
          line-height: 1.7;
        }
        .cv-contract-body .c-field strong {
          font-weight: 600;
        }
        .cv-contract-body .c-center {
          text-align: center;
          margin: 14px 0 8px;
        }
        .cv-contract-body .c-spacer {
          height: 14px;
        }

        /* ── Seção de assinaturas ─────────────────────────────── */
        .cv-sig-section {
          padding: 0 64px 56px;
          border-top: 1px solid #f0f0f0;
        }
        .cv-sig-date {
          text-align: center;
          font-family: 'EB Garamond', serif;
          font-size: 13px;
          color: #9ca3af;
          font-style: italic;
          padding: 36px 0 52px;
        }
        .cv-sig-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 96px;
        }
        .cv-sig-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .cv-sig-space { height: 64px; }
        .cv-sig-line {
          width: 100%;
          height: 1px;
          background: #d1d5db;
        }
        .cv-sig-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #374151;
          text-align: center;
        }
        .cv-sig-sublabel {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #9ca3af;
          text-align: center;
          margin-top: -8px;
        }

        /* ── Botão voltar ─────────────────────────────────────── */
        .cv-back {
          text-align: center;
          padding-top: 4px;
        }
        .cv-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 10px 24px;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .cv-back-btn:hover {
          border-color: #059669;
          color: #059669;
        }

        /* ── Animação spin ────────────────────────────────────── */
        @keyframes cv-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .cv-spin { animation: cv-spin 1s linear infinite; }

        /* ── Responsivo ───────────────────────────────────────── */
        @media (max-width: 600px) {
          .cv-paper-scroll  { padding: 28px 20px 28px; }
          .cv-sig-section   { padding: 0 20px 36px; }
          .cv-sig-grid      { gap: 40px; }
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
              <FileText size={20} color="#059669" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="cv-topbar-title">
                {ct.name} — Documento Gerado
              </div>
              <div className="cv-topbar-sub">
                <Sparkles size={12} />
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
              <><Loader2 size={16} className="cv-spin" /><span>Gerando PDF...</span></>
            ) : downloaded ? (
              <><CheckCircle size={16} /><span>Baixado!</span></>
            ) : isPaid ? (
              <><Download size={16} /><span>Baixar PDF</span></>
            ) : (
              <><Lock size={16} /><span>Pagar R$ 19,90</span></>
            )}
          </button>
        </motion.div>

        {/* Banner de status */}
        <div className={`cv-notice ${isPaid ? 'paid' : 'pending'}`}>
          {isPaid ? (
            <div className="cv-notice-left">
              <CheckCircle size={15} />
              <span>Pagamento confirmado — Download liberado!</span>
            </div>
          ) : (
            <>
              <div className="cv-notice-left">
                <Lock size={14} />
                <span>Contrato pronto! Pague R$ 19,90 via Pix para liberar o download.</span>
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

          {/* Tudo dentro de paperRef é capturado pelo html2pdf */}
          <div ref={paperRef} className="cv-paper-inner">

            <div className="cv-paper-scroll">
              <div
                className="cv-contract-body"
                dangerouslySetInnerHTML={{ __html: formattedHTML }}
              />
            </div>

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
            <ArrowLeft size={15} />
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