// src/PaymentModal.jsx
// Modal de pagamento Pix — aparece quando o cliente tenta baixar o contrato
// Exibe QR Code, código Pix copia-e-cola, e polling automático de confirmação

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Loader2, CheckCircle2, Clock, Sparkles, RefreshCw } from 'lucide-react';

const PRICE = 19.90;
const POLL_INTERVAL = 3000;    // Verifica a cada 3 segundos
const MAX_POLL_TIME = 30 * 60; // Para de verificar após 30 minutos

const PaymentModal = ({ isOpen, onClose, onPaymentConfirmed, contractType }) => {
  const [step, setStep] = useState('loading'); // loading | qrcode | confirmed | expired | error
  const [paymentData, setPaymentData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutos em segundos
  const [pollCount, setPollCount] = useState(0);

  const pollRef = useRef(null);
  const timerRef = useRef(null);
  const externalRefRef = useRef(null);

  // Cria o pagamento ao abrir o modal
  const createPayment = useCallback(async () => {
    setStep('loading');
    setTimeLeft(30 * 60);
    setPollCount(0);

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: contractType?.name || 'Contrato' }),
      });

      const data = await response.json();

      if (!response.ok || !data.qrCode) {
        throw new Error(data.error || 'Erro ao gerar QR Code');
      }

      setPaymentData(data);
      externalRefRef.current = data.externalReference;
      setStep('qrcode');

    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      setStep('error');
    }
  }, [contractType]);

  // Inicia criação do pagamento quando o modal abre
  useEffect(() => {
    if (isOpen) {
      createPayment();
    } else {
      // Limpa tudo ao fechar
      clearInterval(pollRef.current);
      clearInterval(timerRef.current);
      setStep('loading');
      setPaymentData(null);
      setPollCount(0);
    }
  }, [isOpen, createPayment]);

  // Polling — verifica se pagamento foi aprovado
  useEffect(() => {
    if (step !== 'qrcode' || !externalRefRef.current) return;

    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-payment?ref=${externalRefRef.current}`);
        const data = await response.json();

        setPollCount(c => c + 1);

        if (data.paid) {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setStep('confirmed');

          // Aguarda 2s mostrando confirmação, depois libera o download
          setTimeout(() => {
            onPaymentConfirmed();
          }, 2000);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(pollRef.current);
  }, [step, onPaymentConfirmed]);

  // Timer de countdown
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

  // Formata o tempo restante como MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Copia o código Pix para o clipboard
  const handleCopy = async () => {
    if (!paymentData?.qrCode) return;
    try {
      await navigator.clipboard.writeText(paymentData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback para navegadores que bloqueiam clipboard
      const el = document.createElement('textarea');
      el.value = paymentData.qrCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step !== 'confirmed' ? onClose : undefined}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              backgroundColor: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px',
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '420px',
                backgroundColor: '#0d1520',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              {/* Header do modal */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 20px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 16px rgba(16,185,129,0.3)',
                  }}>
                    <span style={{ fontSize: '16px' }}>💳</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'white', margin: 0, lineHeight: 1.2 }}>
                      Pagamento via Pix
                    </h3>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                      {contractType?.name || 'Contrato'}
                    </p>
                  </div>
                </div>

                {step !== 'confirmed' && (
                  <button onClick={onClose} style={{
                    width: '30px', height: '30px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Conteúdo dinâmico por step */}
              <div style={{ padding: '20px' }}>

                {/* LOADING */}
                {step === 'loading' && (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}>
                      <Loader2 size={24} color="#10b981" style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>
                      Gerando QR Code Pix...
                    </p>
                  </div>
                )}

                {/* QR CODE */}
                {step === 'qrcode' && paymentData && (
                  <>
                    {/* Valor */}
                    <div style={{
                      textAlign: 'center',
                      padding: '16px',
                      borderRadius: '16px',
                      background: 'rgba(16,185,129,0.06)',
                      border: '1px solid rgba(16,185,129,0.15)',
                      marginBottom: '20px',
                    }}>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Valor a pagar
                      </p>
                      <p style={{
                        fontSize: '36px', fontWeight: '800', color: 'white',
                        margin: 0, letterSpacing: '-0.02em', lineHeight: 1,
                      }}>
                        R$ 19<span style={{ fontSize: '22px' }}>,90</span>
                      </p>
                    </div>

                    {/* QR Code image */}
                    {paymentData.qrCodeBase64 && (
                      <div style={{
                        display: 'flex', justifyContent: 'center',
                        marginBottom: '16px',
                      }}>
                        <div style={{
                          padding: '12px', borderRadius: '16px',
                          backgroundColor: 'white',
                          boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
                        }}>
                          <img
                            src={`data:image/png;base64,${paymentData.qrCodeBase64}`}
                            alt="QR Code Pix"
                            style={{ width: '180px', height: '180px', display: 'block' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Instrução */}
                    <p style={{
                      textAlign: 'center', fontSize: '13px',
                      color: 'rgba(255,255,255,0.4)', marginBottom: '14px',
                    }}>
                      Escaneie o QR Code ou copie o código abaixo
                    </p>

                    {/* Copia e cola */}
                    <button
                      onClick={handleCopy}
                      style={{
                        width: '100%', padding: '12px 16px',
                        borderRadius: '12px', cursor: 'pointer',
                        background: copied ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${copied ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: '10px', transition: 'all 0.2s', marginBottom: '16px',
                      }}
                    >
                      <span style={{
                        fontSize: '11px', color: 'rgba(255,255,255,0.4)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        flex: 1, textAlign: 'left', fontFamily: 'monospace',
                      }}>
                        {paymentData.qrCode?.slice(0, 50)}...
                      </span>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        color: copied ? '#10b981' : 'rgba(255,255,255,0.5)',
                        flexShrink: 0, fontSize: '12px', fontWeight: '600',
                      }}>
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copiado!' : 'Copiar'}
                      </div>
                    </button>

                    {/* Status de verificação */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '7px', height: '7px', borderRadius: '50%',
                          backgroundColor: '#10b981',
                          boxShadow: '0 0 8px rgba(16,185,129,0.6)',
                          animation: 'pulse 2s infinite',
                        }} />
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                          Aguardando pagamento...
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.25)' }}>
                        <Clock size={12} />
                        <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                    </div>

                    <p style={{
                      textAlign: 'center', fontSize: '11px',
                      color: 'rgba(255,255,255,0.2)', marginTop: '12px',
                    }}>
                      O download será liberado automaticamente após o pagamento
                    </p>
                  </>
                )}

                {/* CONFIRMADO */}
                {step === 'confirmed' && (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                      style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 0 40px rgba(16,185,129,0.4)',
                      }}
                    >
                      <CheckCircle2 size={36} color="white" />
                    </motion.div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>
                      Pagamento confirmado!
                    </h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                      Seu contrato está sendo liberado...
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '8px 16px', borderRadius: '9999px',
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.2)',
                    }}>
                      <Sparkles size={14} color="#10b981" />
                      <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '600' }}>
                        R$ 19,90 recebido via Pix
                      </span>
                    </div>
                  </div>
                )}

                {/* EXPIRADO */}
                {step === 'expired' && (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      background: 'rgba(245,158,11,0.1)',
                      border: '1px solid rgba(245,158,11,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}>
                      <Clock size={28} color="#f59e0b" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
                      QR Code expirado
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                      O código Pix expirou após 30 minutos. Gere um novo para continuar.
                    </p>
                    <button
                      onClick={createPayment}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '12px 24px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white', fontWeight: '700', fontSize: '14px',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
                      }}
                    >
                      <RefreshCw size={16} />
                      Gerar novo QR Code
                    </button>
                  </div>
                )}

                {/* ERRO */}
                {step === 'error' && (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}>
                      <X size={28} color="#ef4444" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
                      Erro ao gerar pagamento
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                      Não foi possível conectar com o Mercado Pago. Tente novamente.
                    </p>
                    <button
                      onClick={createPayment}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '12px 24px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white', fontWeight: '700', fontSize: '14px',
                        border: 'none', cursor: 'pointer',
                      }}
                    >
                      <RefreshCw size={16} />
                      Tentar novamente
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* CSS animations globais */}
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;