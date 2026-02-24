import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import html2pdf from 'html2pdf.js';
const ContractViewer = ({ contract, contractType, onBack, onDownload }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const contractRef = useRef(null);
  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      if (onDownload) {
        await onDownload('pdf');
      } else if (contractRef.current) {
        const opt = {
          margin: [15, 15, 15, 15],
          filename: `${contractType?.name || 'contrato'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        await html2pdf().set(opt).from(contractRef.current).save();
      }
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } finally {
      setDownloading(false);
    }
  };
  return (
    <div className="contract-viewer" style={{ minHeight: '100vh', background: '#f8faf9' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .contract-viewer * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .contract-title { font-family: 'Playfair Display', Georgia, serif; }
        .contract-body {
          font-family: 'Georgia', 'Times New Roman', serif;
          line-height: 1.85;
          color: #1a1a1a;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .download-btn {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%);
          transition: all 0.3s ease;
          border: none; color: #fff; cursor: pointer;
          border-radius: 12px; font-weight: 600;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; font-size: 15px;
        }
        .download-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(5,150,105,0.35);
        }
        .download-btn:active { transform: translateY(0); }
        .download-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .cv-container {
          max-width: 900px; margin: 0 auto;
          padding: 16px;
        }
        @media (min-width: 640px) { .cv-container { padding: 24px; } }
        @media (min-width: 768px) { .cv-container { padding: 32px; } }
        .cv-header {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
        }
        @media (min-width: 640px) { .cv-header { padding: 24px; margin-bottom: 20px; } }
        .cv-header-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
        }
        .cv-header-info { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
        .cv-icon-box {
          width: 48px; height: 48px; min-width: 48px;
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .cv-header-text { min-width: 0; }
        .cv-header-title {
          font-size: 18px; font-weight: 700; color: #111;
          margin: 0 0 4px 0;
          overflow: hidden; text-overflow: ellipsis;
        }
        @media (min-width: 640px) { .cv-header-title { font-size: 22px; } }
        .cv-header-subtitle {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #059669; font-weight: 500;
          margin: 0;
        }
        .cv-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .cv-success {
          display: flex; align-items: flex-start; gap: 10px;
          background: #ecfdf5; border: 1px solid #a7f3d0;
          border-radius: 10px; padding: 12px 16px;
          margin-top: 16px;
        }
        .cv-success-text { font-size: 13px; color: #065f46; line-height: 1.5; margin: 0; }
        .cv-success-text strong { display: block; margin-bottom: 2px; }
        .cv-paper {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.05);
          margin-bottom: 20px;
        }
        .cv-paper-strip {
          height: 4px;
          background: linear-gradient(90deg, #059669, #10b981, #34d399);
        }
        .cv-paper-body {
          padding: 24px 20px;
          max-height: 60vh;
          overflow-y: auto;
        }
        @media (min-width: 640px) { .cv-paper-body { padding: 40px 48px; } }
        @media (min-width: 768px) { .cv-paper-body { padding: 48px 64px; max-height: 65vh; } }
        .cv-paper-body::-webkit-scrollbar { width: 5px; }
        .cv-paper-body::-webkit-scrollbar-track { background: #f1f5f4; border-radius: 10px; }
        .cv-paper-body::-webkit-scrollbar-thumb { background: #a7f3d0; border-radius: 10px; }
        .cv-paper-body::-webkit-scrollbar-thumb:hover { background: #6ee7b7; }
        .cv-signatures {
          padding: 24px 20px 32px;
          border-top: 1px solid #e5e7eb;
        }
        @media (min-width: 640px) { .cv-signatures { padding: 32px 48px 40px; } }
        @media (min-width: 768px) { .cv-signatures { padding: 40px 64px 48px; } }
        .cv-date {
          text-align: center; font-size: 14px; color: #6b7280;
          font-style: italic; margin-bottom: 32px;
        }
        .cv-sig-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }
        @media (min-width: 640px) { .cv-sig-grid { grid-template-columns: 1fr 1fr; gap: 48px; } }
        .cv-sig-block { text-align: center; }
        .cv-sig-label { font-weight: 700; font-size: 13px; letter-spacing: 0.05em; color: #374151; margin-bottom: 12px; }
        .cv-sig-line {
          height: 1px;
          background: linear-gradient(to right, #d1fae5, #6ee7b7, #d1fae5);
          margin-bottom: 6px;
        }
        .cv-sig-sublabel { font-size: 12px; color: #9ca3af; }
        .cv-witnesses { border-top: 1px dashed #e5e7eb; padding-top: 24px; }
        .cv-witnesses-title { font-weight: 700; font-size: 13px; letter-spacing: 0.05em; color: #374151; margin-bottom: 16px; }
        .cv-witness-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 640px) { .cv-witness-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
        .cv-witness-item { display: flex; align-items: flex-start; gap: 12px; }
        .cv-witness-num {
          width: 28px; height: 28px; min-width: 28px;
          border-radius: 50%; background: #ecfdf5;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #059669;
        }
        .cv-witness-fields { font-size: 13px; color: #4b5563; line-height: 1.8; }
        .cv-back {
          text-align: center; padding-bottom: 32px;
        }
        .cv-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: none; border: 1px solid #d1d5db;
          border-radius: 10px; padding: 10px 24px;
          font-size: 14px; font-weight: 500; color: #374151;
          cursor: pointer; transition: all 0.2s;
        }
        .cv-back-btn:hover { background: #fff; border-color: #059669; color: #059669; }
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
                className="download-btn"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Gerando...</span>
                  </>
                ) : downloaded ? (
                  <>
                    <CheckCircle size={18} />
                    <span>Baixado!</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Baixar PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="cv-success">
            <CheckCircle size={18} color="#059669" style={{ marginTop: 1, flexShrink: 0 }} />
            <p className="cv-success-text">
              <strong>Contrato gerado com sucesso!</strong>
              Revise o documento abaixo e faça o download em PDF quando estiver pronto.
            </p>
          </div>
        </motion.div>
        {/* Contract Paper */}
        <motion.div
          className="cv-paper"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="cv-paper-strip" />
          <div className="cv-paper-body">
            <div ref={contractRef} className="contract-body">
              {contract}
            </div>
          </div>
          {/* Signatures */}
          <div className="cv-signatures">
            <div className="cv-date">
              {new Date().toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <div className="cv-sig-grid">
              {[
                { label: 'CONTRATANTE', sublabel: 'Assinatura e Carimbo' },
                { label: 'CONTRATADO', sublabel: 'Assinatura e Carimbo' },
              ].map(({ label, sublabel }) => (
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
                {[1, 2].map((n) => (
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
        </motion.div>
        {/* Back Button */}
        <div className="cv-back">
          <button className="cv-back-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            Criar novo contrato
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default ContractViewer;