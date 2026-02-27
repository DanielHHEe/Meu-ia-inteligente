// src/ContractViewer.jsx
// ContractViewer com gate de pagamento — download só liberado após Pix confirmado

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle, ArrowLeft, Loader2, Sparkles, Lock } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import PaymentModal from './PaymentModal';

const ContractViewer = ({ contract, contractType, onBack, onDownload }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const paperRef = useRef(null);

  // Dispara o download real em PDF
  const triggerDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      if (onDownload) {
        await onDownload('pdf');
      } else if (paperRef.current) {
        const opt = {
          margin: [15, 15, 15, 15],
          filename: `${contractType?.name || 'contrato'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
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

  // Botão de download clicado
  const handleDownloadClick = () => {
    if (isPaid) {
      // Já pagou — baixa direto
      triggerDownload();
    } else {
      // Ainda não pagou — abre modal de pagamento
      setShowPayment(true);
    }
  };

  // Chamado pelo PaymentModal quando pagamento é confirmado
  const handlePaymentConfirmed = () => {
    setIsPaid(true);
    setShowPayment(false);
    // Inicia o download automaticamente após pagamento
    setTimeout(() => triggerDownload(), 300);
  };

  return (
    <div className="contract-viewer" style={{ minHeight: '100vh', background: '#f8faf9' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .contract-viewer * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .contract-title { font-family: 'Playfair Display', Georgia, serif; }
        .contract-body {
          font-family: 'Georgia', 'Times New Roman', serif;
          line-height: 1.85; color: #1a1a1a;
          white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;
        }
        .download-btn {
          position: relative; overflow: hidden;
          transition: all 0.3s ease; border: none; color: #fff; cursor: pointer;
          border-radius: 12px; font-weight: 600;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; font-size: 15px;
        }
        .download-btn.locked {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 4px 16px rgba(245,158,11,0.3);
        }
        .download-btn.unlocked {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 4px 16px rgba(5,150,105,0.3);
        }
        .download-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .download-btn:active { transform: translateY(0); }
        .download-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .cv-container { max-width: 900px; margin: 0 auto; padding: 16px; }
        @media (min-width: 640px) { .cv-container { padding: 24px; } }
        @media (min-width: 768px) { .cv-container { padding: 32px; } }
        .cv-header {
          background: #fff; border-radius: 16px; padding: 20px; margin-bottom: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
        }
        @media (min-width: 640px) { .cv-header { padding: 24px; margin-bottom: 20px; } }
        .cv-header-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .cv-header-info { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
        .cv-icon-box {
          width: 48px; height: 48px; min-width: 48px;
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
        }
        .cv-header-text { min-width: 0; }
        .cv-header-title { font-size: 18px; font-weight: 700; color: #111; margin: 0 0 4px 0; overflow: hidden; text-overflow: ellipsis; }
        @media (min-width: 640px) { .cv-header-title { font-size: 22px; } }
        .cv-header-subtitle { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #059669; font-weight: 500; margin: 0; }
        .cv-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .cv-success {
          display: flex; align-items: flex-start; gap: 10px;
          background: #ecfdf5; border: 1px solid #a7f3d0;
          border-radius: 10px; padding: 12px 16px; margin-top: 16px;
        }
        .cv-success-text { font-size: 13px; color: #065f46; line-height: 1.5; margin: 0; }
        .cv-success-text strong { display: block; margin-bottom: 2px; }
        /* Banner de pagamento */
        .cv-payment-banner {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          border: 1px solid #fcd34d; border-radius: 10px;
          padding: 12px 16px; margin-top: 16px;
        }
        .cv-payment-banner.paid {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border-color: #6ee7b7;
        }
        .cv-paper {
          background: #fff; border-radius: 16px; overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.05);
          margin-bottom: 20px;
        }
        /* Preview bloqueado com blur */
        .cv-paper.locked .cv-paper-body { position: relative; }
        .cv-paper.locked .cv-paper-body::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 160px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.95));
          pointer-events: none;
        }
        .cv-paper-strip { height: 4px; background: linear-gradient(90deg, #059669, #10b981, #34d399); }
        .cv-paper-body { padding: 24px 20px; max-height: 60vh; overflow-y: auto; }
        @media (min-width: 640px) { .cv-paper-body { padding: 40px 48px; } }
        @media (min-width: 768px) { .cv-paper-body { padding: 48px 64px; max-height: 65vh; } }
        .cv-paper-body::-webkit-scrollbar { width: 5px; }
        .cv-paper-body::-webkit-scrollbar-track { background: #f1f5f4; border-radius: 10px; }
        .cv-paper-body::-webkit-scrollbar-thumb { background: #a7f3d0; border-radius: 10px; }
        .cv-paper-body::-webkit-scrollbar-thumb:hover { background: #6ee7b7; }
        .cv-signatures { padding: 24px 20px 32px; border-top: 1px solid #e5e7eb; }
        @media (min-width: 640px) { .cv-signatures { padding: 32px 48px 40px; } }
        @media (min-width: 768px) { .cv-signatures { padding: 40px 64px 48px; } }
        .cv-date { text-align: center; font-size: 14px; color: #6b7280; font-style: italic; margin-bottom: 32px; }
        .cv-sig-grid { display: grid; grid-template-columns: 1fr; gap: 32px; margin-bottom: 32px; }
        @media (min-width: 640px) { .cv-sig-grid { grid-template-columns: 1fr 1fr; gap: 48px; } }
        .cv-sig-block { text-align: center; }
        .cv-sig-label { font-weight: 700; font-size: 13px; letter-spacing: 0.05em; color: #374151; margin-bottom: 12px; }
        .cv-sig-line { height: 1px; background: linear-gradient(to right, #d1fae5, #6ee7b7, #d1fae5); margin-bottom: 6px; }
        .cv-sig-sublabel { font-size: 12px; color: #9ca3af; }
        .cv-witnesses { border-top: 1px dashed #e5e7eb; padding-top: 24px; }
        .cv-witnesses-title { font-weight: 700; font-size: 13px; letter-spacing: 0.05em; color: #374151; margin-bottom: 16px; }
        .cv-witness-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 640px) { .cv-witness-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
        .cv-witness-item { display: flex; align-items: flex-start; gap: 12px; }
        .cv-witness-num {
          width: 28px; height: 28px; min-width: 28px; border-radius: 50%;
          background: #ecfdf5; display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #059669;
        }
        .cv-witness-fields { font-size: 13px; color: #4b5563; line-height: 1.8; }
        .cv-back { text-align: center; padding-bottom: 32px; }
        .cv-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: none; border: 1px solid #d1d5db; border-radius: 10px;
          padding: 10px 24px; font-size: 14px; font-weight: 500; color: #374151;
          cursor: pointer; transition: all 0.2s;
        }
        .cv-back-btn:hover { background: #fff; border-color: #059669; color: #059669; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="cv-container">
        {/* Header */}
        <motion.div
          className="cv-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="cv-header-top">
            <div className="cv-header-info">
              <div className="cv-icon-box">
                <FileText size={24} color="#059669" />
              </div>
              <div className="cv-header-text">
                <h2 className="cv-header-title contract-title">
                  {contractType?.name || 'Contrato'} — Documento Gerado
                </h2>
                <p className="cv-header-subtitle">
                  <Sparkles size={14} />
                  Gerado por IA · Pronto para assinatura
                </p>
              </div>
            </div>
            <div className="cv-actions">
              <button
                className={`download-btn ${isPaid ? 'unlocked' : 'locked'}`}
                onClick={handleDownloadClick}
                disabled={downloading}
              >
                {downloading ? (
                  <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /><span>Gerando PDF...</span></>
                ) : downloaded ? (
                  <><CheckCircle size={18} /><span>Baixado!</span></>
                ) : isPaid ? (
                  <><Download size={18} /><span>Baixar PDF</span></>
                ) : (
                  <><Lock size={18} /><span>Pagar R$ 19,90</span></>
                )}
              </button>
            </div>
          </div>

          {/* Banner de status do pagamento */}
          <div className={`cv-payment-banner ${isPaid ? 'paid' : ''}`}>
            {isPaid ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} color="#059669" />
                  <span style={{ fontSize: '13px', color: '#065f46', fontWeight: '600' }}>
                    Pagamento confirmado — Download liberado!
                  </span>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} color="#d97706" />
                  <span style={{ fontSize: '13px', color: '#92400e', fontWeight: '600' }}>
                    Contrato pronto! Pague R$ 19,90 via Pix para liberar o download.
                  </span>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  style={{
                    padding: '8px 18px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white', fontWeight: '700', fontSize: '13px',
                    border: 'none', cursor: 'pointer', flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
                  }}
                >
                  Pagar agora
                </button>
              </>
            )}
          </div>

          <div className="cv-success">
            <CheckCircle size={18} color="#059669" style={{ marginTop: 1, flexShrink: 0 }} />
            <p className="cv-success-text">
              <strong>Contrato gerado com sucesso!</strong>
              Revise o documento abaixo. Após o pagamento, o PDF completo será liberado para download.
            </p>
          </div>
        </motion.div>

        {/* Contract Paper */}
        <motion.div
          className={`cv-paper ${isPaid ? '' : 'locked'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="cv-paper-strip" />

          {/* paperRef cobre tudo que entra no PDF */}
          <div ref={paperRef}>
            <div className="cv-paper-body">
              <div className="contract-body">
                {contract}
              </div>
            </div>

            {/* Assinaturas e testemunhas */}
            <div className="cv-signatures">
              <div className="cv-date">
                {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>

              <div className="cv-sig-grid">
                {getSignatureLabels(contractType?.id).map(({ label, sublabel }) => (
                  <div key={label} className="cv-sig-block">
                    <div className="cv-sig-label">{label}</div>
                    <div className="cv-sig-line" />
                    <div className="cv-sig-sublabel">{sublabel}</div>
                  </div>
                ))}
              </div>

              <div className="cv-witnesses">
                <div className="cv-witnesses-title">TESTEMUNHAS</div>
                <div className="cv-witness-grid">
                  {[1, 2].map(n => (
                    <div key={n} className="cv-witness-item">
                      <div className="cv-witness-num">{n}</div>
                      <div className="cv-witness-fields">
                        <div>Nome: ___________________________</div>
                        <div>CPF: ____________________________</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Botão voltar */}
        <div className="cv-back">
          <button className="cv-back-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            Criar novo contrato
          </button>
        </div>
      </div>

      {/* Modal de pagamento */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPaymentConfirmed={handlePaymentConfirmed}
        contractType={contractType}
      />
    </div>
  );
};

const getSignatureLabels = (contractTypeId) => {
  const labels = {
    'aluguel':             [{ label: 'LOCADOR',          sublabel: 'Assinatura e Carimbo' }, { label: 'LOCATÁRIO',        sublabel: 'Assinatura e Carimbo' }],
    'prestacao-servicos':  [{ label: 'CONTRATANTE',      sublabel: 'Assinatura e Carimbo' }, { label: 'CONTRATADO',       sublabel: 'Assinatura e Carimbo' }],
    'trabalho-freelancer': [{ label: 'CONTRATANTE',      sublabel: 'Assinatura e Carimbo' }, { label: 'FREELANCER',       sublabel: 'Assinatura e Carimbo' }],
    'compra-venda':        [{ label: 'VENDEDOR',         sublabel: 'Assinatura e Carimbo' }, { label: 'COMPRADOR',        sublabel: 'Assinatura e Carimbo' }],
    'parceria':            [{ label: 'PARTE A',          sublabel: 'Assinatura e Carimbo' }, { label: 'PARTE B',          sublabel: 'Assinatura e Carimbo' }],
    'confidencialidade':   [{ label: 'PARTE REVELADORA', sublabel: 'Assinatura e Carimbo' }, { label: 'PARTE RECEPTORA',  sublabel: 'Assinatura e Carimbo' }],
  };
  return labels[contractTypeId] || [{ label: 'CONTRATANTE', sublabel: 'Assinatura e Carimbo' }, { label: 'CONTRATADO', sublabel: 'Assinatura e Carimbo' }];
};

export default ContractViewer;