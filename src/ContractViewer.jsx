// src/ContractViewer.jsx
// ContractViewer com gate de pagamento — download só liberado após Pix confirmado

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle, ArrowLeft, Loader2, Sparkles, Lock } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import PaymentModal from './PaymentModal';

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
      html += '<div style="height:14px"></div>';
      continue;
    }

    // Título principal do contrato
    if (
      /^(CONTRATO|TERMO|ACORDO|INSTRUMENTO)\s+DE\s+/i.test(trimmed) &&
      trimmed === trimmed.toUpperCase()
    ) {
      html += `<p class="doc-title">${trimmed}</p>`;
      continue;
    }

    // PREÂMBULO
    if (/^PREÂMBULO$/i.test(trimmed)) {
      html += `<p class="doc-section-label">${trimmed}</p>`;
      continue;
    }

    // Cabeçalho de cláusula
    if (/^CLÁUSULA\s+\d|^CLAUSULA\s+\d|^CL[ÁA]USULA\s+[IVXLC]+/i.test(trimmed)) {
      const clean = trimmed.replace(/\*\*/g, '');
      html += `<p class="doc-clause-title">${clean}</p>`;
      continue;
    }

    // Parágrafos numerados
    if (/^(\d+\.\d+\.?|§\d+[º°]?)\s/.test(trimmed)) {
      const clean = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html += `<p class="doc-paragraph">${clean}</p>`;
      continue;
    }

    // Campos de qualificação
    if (
      /^(CONTRATANTE|CONTRATADO|LOCADOR|LOCATÁRIO|PARTE [AB]|REVELADORA|RECEPTORA|VENDEDOR|COMPRADOR|FREELANCER|EMPREITEIRO|SÓCIO [AB]|REPRESENTADA|REPRESENTANTE|COMODANTE|COMODATÁRIO)\s*:/i.test(trimmed) ||
      /^(CPF|CNPJ|CPF\/CNPJ|TELEFONE|EMAIL|E-MAIL|ENDEREÇO|OBJETO|VALOR|FORMA DE PAGAMENTO|PRAZO|MULTA|CIDADE|ESTADO|IMÓVEL|BEM|REGIME FISCAL|RETENÇÃO)\s*:/i.test(trimmed)
    ) {
      const colonIdx = trimmed.indexOf(':');
      const label = trimmed.substring(0, colonIdx);
      const value = trimmed.substring(colonIdx + 1).trim();
      html += `<p class="doc-field"><span class="doc-field-label">${label}:</span> <span class="doc-field-value">${value}</span></p>`;
      continue;
    }

    // Linha de local e data / fechamento
    if (/^(local e data|e, por estarem|assim justas|em 2 \(duas\))/i.test(trimmed)) {
      const clean = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html += `<p class="doc-closing">${clean}</p>`;
      continue;
    }

    // Linha de assinatura ___
    if (/^_{3,}/.test(trimmed)) {
      html += `<p class="doc-sig-line">${trimmed}</p>`;
      continue;
    }

    // Parágrafo normal
    const clean = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html += `<p class="doc-text">${clean}</p>`;
  }

  return html;
};

const ContractViewer = ({ contract, contractType, onBack, onDownload }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const paperRef = useRef(null);

  const getDateString = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const triggerDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      if (onDownload) {
        await onDownload('pdf');
      } else if (paperRef.current) {
        const opt = {
          margin: [20, 20, 20, 20],
          filename: `${contractType?.name || 'contrato'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
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
    if (isPaid) {
      triggerDownload();
    } else {
      setShowPayment(true);
    }
  };

  const handlePaymentConfirmed = () => {
    setIsPaid(true);
    setShowPayment(false);
    setTimeout(() => triggerDownload(), 300);
  };

  const formattedHTML = formatContractText(contract);

  return (
    <div className="cv-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

        /* ── Reset & Root ── */
        .cv-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .cv-root {
          min-height: 100vh;
          background: #f4f3f0;
          font-family: 'DM Sans', sans-serif;
          color: #1c1c1c;
        }

        /* ── Layout Shell ── */
        .cv-shell {
          max-width: 860px;
          margin: 0 auto;
          padding: 28px 16px 60px;
        }
        @media (min-width: 640px) { .cv-shell { padding: 36px 24px 80px; } }
        @media (min-width: 768px) { .cv-shell { padding: 48px 32px 100px; } }

        /* ── Top Bar ── */
        .cv-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .cv-topbar-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cv-topbar-icon {
          width: 44px; height: 44px;
          background: #1c1c1c;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cv-topbar-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 3px;
        }
        .cv-topbar-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          color: #1c1c1c;
          line-height: 1.2;
        }
        @media (min-width: 640px) { .cv-topbar-title { font-size: 26px; } }

        /* ── Download Button ── */
        .cv-btn-download {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .cv-btn-download.locked {
          background: #1c1c1c;
          color: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.18);
        }
        .cv-btn-download.unlocked {
          background: #18794e;
          color: #fff;
          box-shadow: 0 2px 12px rgba(24,121,78,0.25);
        }
        .cv-btn-download:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.08); }
        .cv-btn-download:active:not(:disabled) { transform: translateY(0); }
        .cv-btn-download:disabled { opacity: 0.65; cursor: not-allowed; }

        /* ── Status Banner ── */
        .cv-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          border-radius: 10px;
          padding: 14px 18px;
          margin-bottom: 20px;
          font-size: 13px;
          font-weight: 500;
        }
        .cv-banner.pending {
          background: #fdf8f0;
          border: 1px solid #e8d9b8;
          color: #6b4c1e;
        }
        .cv-banner.confirmed {
          background: #f0faf4;
          border: 1px solid #b3dfc7;
          color: #145a35;
        }
        .cv-banner-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cv-banner-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .cv-banner.pending .cv-banner-dot { background: #c87941; }
        .cv-banner.confirmed .cv-banner-dot { background: #18794e; }
        .cv-banner-pay-btn {
          padding: 8px 16px;
          border-radius: 6px;
          background: #1c1c1c;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .cv-banner-pay-btn:hover { background: #333; }

        /* ── Document Card ── */
        .cv-document {
          background: #fff;
          border-radius: 4px;
          box-shadow:
            0 1px 2px rgba(0,0,0,0.04),
            0 4px 16px rgba(0,0,0,0.06),
            0 0 0 1px rgba(0,0,0,0.04);
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle top rule */
        .cv-document::before {
          content: '';
          display: block;
          height: 3px;
          background: linear-gradient(90deg, #1c1c1c 0%, #555 60%, #ccc 100%);
        }

        /* Lock overlay */
        .cv-document.locked .cv-doc-body::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 200px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.97));
          pointer-events: none;
          border-radius: 0 0 4px 4px;
        }

        /* ── Document Body (scrollable preview) ── */
        .cv-doc-body {
          position: relative;
          padding: 40px 36px;
          max-height: 62vh;
          overflow-y: auto;
        }
        @media (min-width: 640px) { .cv-doc-body { padding: 52px 60px; } }
        @media (min-width: 768px) { .cv-doc-body { padding: 64px 80px; max-height: 68vh; } }

        .cv-doc-body::-webkit-scrollbar { width: 4px; }
        .cv-doc-body::-webkit-scrollbar-track { background: transparent; }
        .cv-doc-body::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        .cv-doc-body::-webkit-scrollbar-thumb:hover { background: #bbb; }

        /* ── Document Typography ── */
        .doc-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 17px;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0.06em;
          color: #1c1c1c;
          margin-bottom: 28px;
          line-height: 1.4;
        }
        .doc-section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-align: center;
          color: #888;
          margin: 28px 0 16px;
        }
        .doc-clause-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #1c1c1c;
          margin: 32px 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e8e8e8;
        }
        .doc-paragraph {
          font-size: 13.5px;
          line-height: 1.9;
          color: #2c2c2c;
          text-align: justify;
          margin-bottom: 10px;
          hyphens: auto;
        }
        .doc-field {
          font-size: 13px;
          line-height: 1.75;
          color: #2c2c2c;
          margin-bottom: 5px;
        }
        .doc-field-label {
          font-weight: 600;
          color: #1c1c1c;
        }
        .doc-field-value {
          color: #444;
        }
        .doc-text {
          font-size: 13.5px;
          line-height: 1.9;
          color: #2c2c2c;
          text-align: justify;
          margin-bottom: 10px;
          hyphens: auto;
        }
        .doc-closing {
          font-size: 13.5px;
          line-height: 1.9;
          color: #2c2c2c;
          text-align: center;
          margin: 20px 0 10px;
        }
        .doc-sig-line {
          text-align: center;
          font-size: 13px;
          color: #aaa;
          margin: 8px 0;
        }

        /* ── Signature Section (PDF only, inside paperRef) ── */
        .cv-sig-section {
          padding: 48px 80px 60px;
          border-top: 1px solid #ececec;
        }
        @media (max-width: 640px) { .cv-sig-section { padding: 36px 36px 48px; } }

        .cv-sig-date {
          text-align: center;
          font-size: 13px;
          color: #888;
          font-style: italic;
          margin-bottom: 72px;
          letter-spacing: 0.02em;
        }

        .cv-sig-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 80px;
        }

        .cv-sig-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        /* Big spacer above line — gives breathing room */
        .cv-sig-space {
          height: 80px;
        }

        .cv-sig-rule {
          width: 100%;
          height: 1px;
          background: #1c1c1c;
          margin-bottom: 12px;
        }

        .cv-sig-name {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1c1c1c;
          text-align: center;
          margin-bottom: 4px;
        }

        .cv-sig-role {
          font-size: 11px;
          color: #aaa;
          letter-spacing: 0.04em;
          text-align: center;
        }

        /* ── Back Button ── */
        .cv-back-wrap {
          text-align: center;
          padding-top: 8px;
        }
        .cv-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          border-radius: 8px;
          background: none;
          border: 1px solid #d4d4d4;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .cv-back-btn:hover {
          border-color: #1c1c1c;
          color: #1c1c1c;
          background: #fafafa;
        }

        /* ── Spinner ── */
        @keyframes cv-spin { to { transform: rotate(360deg); } }
        .cv-spin { animation: cv-spin 0.9s linear infinite; }

        /* ── Print ── */
        @media print {
          .cv-topbar, .cv-banner, .cv-back-wrap { display: none !important; }
          .cv-document { box-shadow: none !important; }
          .cv-doc-body { max-height: none !important; overflow: visible !important; }
          .cv-sig-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div className="cv-shell">

        {/* ── Top Bar ── */}
        <motion.div
          className="cv-topbar"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="cv-topbar-left">
            <div className="cv-topbar-icon">
              <FileText size={22} color="#fff" />
            </div>
            <div>
              <div className="cv-topbar-label">Documento Gerado</div>
              <div className="cv-topbar-title">
                {contractType?.name || 'Contrato'}
              </div>
            </div>
          </div>

          <button
            className={`cv-btn-download ${isPaid ? 'unlocked' : 'locked'}`}
            onClick={handleDownloadClick}
            disabled={downloading}
          >
            {downloading ? (
              <><Loader2 size={16} className="cv-spin" /><span>Gerando PDF…</span></>
            ) : downloaded ? (
              <><CheckCircle size={16} /><span>Baixado!</span></>
            ) : isPaid ? (
              <><Download size={16} /><span>Baixar PDF</span></>
            ) : (
              <><Lock size={16} /><span>Pagar R$ 19,90</span></>
            )}
          </button>
        </motion.div>

        {/* ── Status Banner ── */}
        <motion.div
          className={`cv-banner ${isPaid ? 'confirmed' : 'pending'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="cv-banner-left">
            <div className="cv-banner-dot" />
            {isPaid ? (
              <span>Pagamento confirmado — download liberado.</span>
            ) : (
              <span>Contrato pronto. Pague <strong>R$ 19,90 via Pix</strong> para liberar o download em PDF.</span>
            )}
          </div>
          {!isPaid && (
            <button className="cv-banner-pay-btn" onClick={() => setShowPayment(true)}>
              Pagar agora
            </button>
          )}
        </motion.div>

        {/* ── Document Card ── */}
        <motion.div
          className={`cv-document ${isPaid ? '' : 'locked'}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {/* paperRef envolve tudo que vai para o PDF */}
          <div ref={paperRef}>

            {/* Scrollable body */}
            <div className="cv-doc-body">
              <div
                dangerouslySetInnerHTML={{ __html: formattedHTML }}
              />
            </div>

            {/* ── Signature Section ── */}
            <div className="cv-sig-section">

              <div className="cv-sig-date">
                {getDateString()}
              </div>

              <div className="cv-sig-grid">
                {getSignatureLabels(contractType?.id).map(({ label, sublabel }) => (
                  <div key={label} className="cv-sig-block">
                    {/* Generous vertical space — breathing room above line */}
                    <div className="cv-sig-space" />
                    <div className="cv-sig-rule" />
                    <div className="cv-sig-name">{label}</div>
                    <div className="cv-sig-role">{sublabel}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </motion.div>

        {/* ── Back Button ── */}
        <div className="cv-back-wrap">
          <button className="cv-back-btn" onClick={onBack}>
            <ArrowLeft size={15} />
            Criar novo contrato
          </button>
        </div>
      </div>

      {/* ── Payment Modal ── */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPaymentConfirmed={handlePaymentConfirmed}
        contractType={contractType}
      />
    </div>
  );
};

// ── Signature labels por tipo de contrato ──
const getSignatureLabels = (contractTypeId) => {
  const labels = {
    'aluguel':                [{ label: 'LOCADOR',           sublabel: 'Assinatura e Carimbo' }, { label: 'LOCATÁRIO',         sublabel: 'Assinatura e Carimbo' }],
    'prestacao-servicos':     [{ label: 'CONTRATANTE',       sublabel: 'Assinatura e Carimbo' }, { label: 'CONTRATADO',        sublabel: 'Assinatura e Carimbo' }],
    'trabalho-freelancer':    [{ label: 'CONTRATANTE',       sublabel: 'Assinatura e Carimbo' }, { label: 'FREELANCER',        sublabel: 'Assinatura e Carimbo' }],
    'compra-venda':           [{ label: 'VENDEDOR',          sublabel: 'Assinatura e Carimbo' }, { label: 'COMPRADOR',         sublabel: 'Assinatura e Carimbo' }],
    'parceria':               [{ label: 'PARTE A',           sublabel: 'Assinatura e Carimbo' }, { label: 'PARTE B',           sublabel: 'Assinatura e Carimbo' }],
    'confidencialidade':      [{ label: 'PARTE REVELADORA',  sublabel: 'Assinatura e Carimbo' }, { label: 'PARTE RECEPTORA',   sublabel: 'Assinatura e Carimbo' }],
    'empreitada':             [{ label: 'CONTRATANTE',       sublabel: 'Assinatura e Carimbo' }, { label: 'EMPREITEIRO',       sublabel: 'Assinatura e Carimbo' }],
    'sociedade':              [{ label: 'SÓCIO A',           sublabel: 'Assinatura e Carimbo' }, { label: 'SÓCIO B',           sublabel: 'Assinatura e Carimbo' }],
    'representacao-comercial':[{ label: 'REPRESENTADA',      sublabel: 'Assinatura e Carimbo' }, { label: 'REPRESENTANTE',     sublabel: 'Assinatura e Carimbo' }],
    'comodato':               [{ label: 'COMODANTE',         sublabel: 'Assinatura e Carimbo' }, { label: 'COMODATÁRIO',       sublabel: 'Assinatura e Carimbo' }],
  };
  return labels[contractTypeId] || [
    { label: 'CONTRATANTE', sublabel: 'Assinatura e Carimbo' },
    { label: 'CONTRATADO',  sublabel: 'Assinatura e Carimbo' },
  ];
};

export default ContractViewer;