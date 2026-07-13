// ============================================================
// ChatComponents.jsx
// Todos os componentes visuais puros do Chat.
// Nenhuma lógica de estado global, API ou PDF aqui.
// ============================================================

import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Send, Bot, User, Sparkles, Loader2,
  FileCheck, Building2, Users, Briefcase, Home, Shield,
  FileSignature, ChevronRight, CheckCircle2, Clock,
  X, Copy, Check, RefreshCw, Download, Lock, LogOut,
} from "lucide-react";
import { useAuth } from "./config/AuthContext";
import { useNavigate } from "react-router-dom";

// Arquivos dentro de public/ são servidos na raiz do site e referenciados
// por caminho de texto (não por import de módulo) — mesmo padrão já usado
// pelo logo "/contrati.png" no ProgressSidebar, mais abaixo neste arquivo.
const botAvatarImg = "/simbolo_contrati.svg";

// ============================================================
// BotAvatar — círculo com a foto de perfil do assistente.
// Centralizado aqui para que trocar a imagem no futuro baste
// alterar o import acima, em vez de editar 4 lugares diferentes.
// ============================================================
const BotAvatar = ({ size = 34 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: '#0f1419',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, overflow: 'hidden',
  }}>
    <img
      src={botAvatarImg}
      alt="Assistente"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  </div>
);

// ============================================================
// CONTRACT TYPES — lista estática de tipos de contrato
// ============================================================
export const contractTypes = [
  {
    id: "prestacao-servicos",
    name: "Prestação de Serviços",
    icon: Briefcase,
    description: "Ideal para freelancers e prestadores de serviço",
    popular: true,
  },
  {
    id: "aluguel",
    name: "Contrato de Aluguel",
    icon: Home,
    description: "Para locação de imóveis",
    popular: true,
  },
  {
    id: "parceria",
    name: "Acordo de Parceria",
    icon: Users,
    description: "Para parcerias comerciais",
    popular: false,
  },
  {
    id: "confidencialidade",
    name: "Termo de Confidencialidade",
    icon: Shield,
    description: "Proteção de informações sigilosas",
    popular: true,
  },
  {
    id: "trabalho-freelancer",
    name: "Contrato Freelancer",
    icon: FileSignature,
    description: "Para profissionais autônomos",
    popular: false,
  },
  {
    id: "compra-venda",
    name: "Compra e Venda",
    icon: Building2,
    description: "Para transações de bens",
    popular: false,
  },
  {
    id: "empreitada",
    name: "Contrato de Empreitada",
    icon: Building2,
    description: "Obras e construção civil — art. 618 CC",
    popular: false,
  },
  {
    id: "sociedade",
    name: "Sociedade Simples",
    icon: Users,
    description: "Abertura de empresa entre sócios — CC arts. 997-1038",
    popular: false,
  },
  {
    id: "representacao-comercial",
    name: "Representação Comercial",
    icon: Briefcase,
    description: "Representantes comerciais — Lei 4.886/65",
    popular: false,
  },
  {
    id: "comodato",
    name: "Contrato de Comodato",
    icon: FileText,
    description: "Empréstimo gratuito de bem — CC arts. 579-585",
    popular: false,
  },
];

// ============================================================
// TypingText — efeito de digitação caractere a caractere
// ============================================================
export const TypingText = ({ text, onComplete, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const prevTextRef = useRef('');

  useEffect(() => {
    if (prevTextRef.current !== text) {
      prevTextRef.current = text;
      setDisplayedText('');
      setCurrentIndex(0);
      setIsComplete(false);
    }
  }, [text]);

  useEffect(() => {
    if (isComplete) return;
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

// ============================================================
// PaymentModal — modal de pagamento via Pix
// ============================================================
export const PaymentModal = ({ isOpen, onClose, onPaymentConfirmed, contractType, price }) => {
  const [step, setStep] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const pollRef = useRef(null);
  const timerRef = useRef(null);
  const externalRefRef = useRef(null);

  const createPayment = useCallback(async () => {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDev) {
      setStep('confirmed');
      setTimeout(() => onPaymentConfirmed(), 1500);
      return;
    }

    setStep('loading');
    setTimeLeft(30 * 60);
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: contractType?.name || 'Contrato', amount: price }),
      });
      const data = await response.json();
      if (!response.ok || !data.qrCode) throw new Error(data.error || 'Erro ao gerar QR Code');
      setPaymentData(data);
      externalRefRef.current = data.externalReference;
      setStep('qrcode');
    } catch {
      setStep('error');
    }
  }, [contractType, price]);

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
      } catch { }
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [step, onPaymentConfirmed]);

  useEffect(() => {
    if (step !== 'qrcode') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); clearInterval(pollRef.current); setStep('expired'); return 0; }
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

  const priceDisplay = price ? price.toFixed(2).replace('.', ',') : '39,90';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={step !== 'confirmed' ? onClose : undefined}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '400px', backgroundColor: '#0f1419',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
              overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'white', margin: 0 }}>Pagamento via Pix</h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>{contractType?.name || 'Contrato'}</p>
              </div>
              {step !== 'confirmed' && (
                <button onClick={onClose} style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: '18px 20px 22px' }}>
              {step === 'loading' && (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <Loader2 size={22} color="#10b981" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 14px', display: 'block' }} />
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: 0 }}>Gerando QR Code Pix...</p>
                </div>
              )}

              {step === 'qrcode' && paymentData && (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px',
                  }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>Total a pagar</span>
                    <span style={{ fontSize: '22px', fontWeight: '700', color: 'white' }}>R$ {priceDisplay}</span>
                  </div>

                  {paymentData.qrCodeBase64 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                      <div style={{ padding: '10px', borderRadius: '14px', backgroundColor: 'white' }}>
                        <img src={`data:image/png;base64,${paymentData.qrCodeBase64}`} alt="QR Code Pix" style={{ width: '164px', height: '164px', display: 'block' }} />
                      </div>
                    </div>
                  )}

                  <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                    Escaneie o QR Code ou copie o código abaixo
                  </p>

                  <button onClick={handleCopy} style={{
                    width: '100%', padding: '11px 14px', borderRadius: '11px', cursor: 'pointer',
                    background: copied ? 'rgba(34,197,94,0.09)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px',
                  }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left', fontFamily: 'monospace' }}>
                      {paymentData.qrCode?.slice(0, 46)}...
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: copied ? '#22c55e' : 'rgba(255,255,255,0.4)', flexShrink: 0, fontSize: '12px', fontWeight: '600' }}>
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
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)', animation: 'pulse 2s infinite' }} />
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)' }}>Aguardando pagamento...</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.22)' }}>
                      <Clock size={11} />
                      <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                </>
              )}

              {step === 'confirmed' && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #1FB676)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(16,185,129,0.28)',
                    }}
                  >
                    <CheckCircle2 size={32} color="white" />
                  </motion.div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>Pagamento confirmado!</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', marginBottom: '16px' }}>
                    {price === 49.90 ? 'Preparando sua personalização...' : 'Seu download está sendo liberado...'}
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '7px 14px', borderRadius: '9999px',
                    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                  }}>
                    <Sparkles size={13} color="#22c55e" />
                    <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>R$ {priceDisplay} recebido via Pix</span>
                  </div>
                </div>
              )}

              {step === 'expired' && (
                <div style={{ textAlign: 'center', padding: '22px 0' }}>
                  <Clock size={26} color="#f59e0b" style={{ margin: '0 auto 14px', display: 'block' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>QR Code expirado</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '18px' }}>O código Pix expirou após 30 minutos.</p>
                  <button onClick={createPayment} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 22px', borderRadius: '11px',
                    background: 'linear-gradient(135deg, #22c55e, #a3e635)', color: '#0d2010', fontWeight: '700', fontSize: '13px', border: 'none', cursor: 'pointer',
                  }}>
                    <RefreshCw size={14} /> Gerar novo QR Code
                  </button>
                </div>
              )}

              {step === 'error' && (
                <div style={{ textAlign: 'center', padding: '22px 0' }}>
                  <X size={26} color="#ef4444" style={{ margin: '0 auto 14px', display: 'block' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>Erro ao gerar pagamento</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '18px' }}>Não foi possível conectar com o Mercado Pago.</p>
                  <button onClick={createPayment} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 22px', borderRadius: '11px',
                    background: 'linear-gradient(135deg, #22c55e, #a3e635)', color: '#0d2010', fontWeight: '700', fontSize: '13px', border: 'none', cursor: 'pointer',
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

// ============================================================
// ChatUserAvatar — avatar do usuário com menu de logout
// ============================================================
export const ChatUserAvatar = ({ showInChat }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário";
  const initials = name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  const handleSignOut = async () => { await signOut(); localStorage.removeItem("token"); setMenuOpen(false); navigate("/"); };

  return (
    <div ref={menuRef} style={{ display: 'flex', justifyContent: 'flex-end', padding: showInChat ? '0' : '16px 20px 0', maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px 6px 8px', borderRadius: '12px',
          backgroundColor: menuOpen ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${menuOpen ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', outline: 'none',
        }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'white' }}>{initials}</span>
          </div>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '500', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '180px', backgroundColor: '#0d1520', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100 }}>
              <button onClick={handleSignOut} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <LogOut size={14} /> Sair da conta
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================================
// ContractTypeSelector — grid de seleção de tipo de contrato
// ============================================================
export const ContractTypeSelector = ({ onSelect }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '24px 16px 32px' }}>
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>

      <h2 style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: '800', color: 'white', marginBottom: '8px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
        Qual contrato você precisa?
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Selecione o modelo ideal para sua necessidade</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
      {contractTypes.map((type, index) => (
        <motion.button key={type.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
          onClick={() => onSelect(type)}
          style={{ position: 'relative', padding: '18px 16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', backgroundColor: 'rgba(255,255,255,0.03)', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)'; e.currentTarget.style.backgroundColor = 'rgba(16,185,129,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          {type.popular && (
            <div style={{ position: 'absolute', top: '-10px', right: '14px', padding: '3px 10px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', fontSize: '10px', fontWeight: '700', borderRadius: '9999px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Popular</div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingRight: '20px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <type.icon size={18} color="#10b981" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontWeight: '700', color: 'white', marginBottom: '4px', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{type.name}</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{type.description}</p>
            </div>
          </div>
          <ChevronRight size={15} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
        </motion.button>
      ))}
    </div>
  </motion.div>
);

// ============================================================
// GeneratingBubble — indicador de geração de contrato
// ============================================================
export const GeneratingBubble = ({ progress }) => {
  const pct = progress?.pct || 0;
  const label = progress?.label || 'Gerando contrato...';
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px' }}>
      <BotAvatar />
      <div style={{ padding: '14px 18px', borderRadius: '18px', borderBottomLeftRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', minWidth: '260px', maxWidth: '320px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: pct > 0 ? '10px' : '0' }}>
          <div style={{ width: '16px', height: '16px', border: '2px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontWeight: '500', flex: 1 }}>{label}</span>
          {pct > 0 && <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', flexShrink: 0 }}>{pct}%</span>}
        </div>
        {pct > 0 && (
          <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: pct + '%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #a3e635)', borderRadius: '2px' }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================
// PdfCard — card de download / pagamento do PDF
//
// FIX (a pedido do usuário): o quadrado de ícone (download/cadeado)
// usava um gradiente muito saturado (verde-limão / laranja forte).
// Trocado por um estilo neutro e discreto — fundo sutil translúcido
// com borda fina, mesmo padrão já usado nos ícones do
// ContractTypeSelector — mantendo a cor do ícone em si (verde quando
// pago, âmbar quando pendente) só que sem o gradiente vibrante ao redor.
// ============================================================
export const PdfCard = ({ contractType, isPaid, onOpenPayment, onDownload, plan }) => {
  const price = plan === 'premium' ? 'R$ 49,90' : 'R$ 39,90';
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px' }}>
      <BotAvatar />
      <div style={{ maxWidth: '340px' }}>
        <div style={{ padding: '11px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginBottom: '8px', lineHeight: '1.5' }}>
          {isPaid
            ? '✅ Pagamento confirmado! Clique abaixo para baixar seu contrato.'
            : plan === 'premium'
              ? '✅ Contrato gerado! Pague para personalizar e baixar com sua marca.'
              : '✅ Contrato gerado! Clique abaixo para pagar e baixar o PDF.'}
        </div>
        <button onClick={isPaid ? onDownload : onOpenPayment} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${isPaid ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = isPaid ? 'rgba(16,185,129,0.55)' : 'rgba(245,158,11,0.45)'; e.currentTarget.style.backgroundColor = isPaid ? 'rgba(16,185,129,0.07)' : 'rgba(245,158,11,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isPaid ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
          >
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
              background: isPaid ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isPaid ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isPaid ? <Download size={20} color="#10b981" /> : <Lock size={20} color="rgba(255,255,255,0.45)" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                {contractType?.name || 'Contrato'}.pdf
              </p>
              <p style={{ fontSize: '11px', color: isPaid ? '#22c55e' : 'rgba(255,255,255,0.35)', margin: '2px 0 0', fontWeight: isPaid ? '600' : '400' }}>
                {isPaid ? 'Download liberado — clique para baixar' : `Pagar ${price} via Pix para baixar`}
              </p>
            </div>
            <ChevronRight size={14} color={isPaid ? '#22c55e' : '#f59e0b'} />
          </div>
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================
// MessageBubble — balão de mensagem (bot ou usuário)
//
// FIX (a pedido do usuário): a resposta do bot não deve mais ficar
// dentro de um "balãozinho" com fundo/borda — agora aparece como
// texto solto, com fundo transparente e sem borda. O balão do
// USUÁRIO continua exatamente igual (fundo verde escuro #059669,
// cor de texto branca), nada nele foi alterado.
// ============================================================
export const MessageBubble = ({ message, isBot, isGenerating, isPdfCard, contractType, isPaid, onOpenPayment, onDownload, plan, isAnimationDone, onAnimationComplete, generationProgress }) => {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { }
  };

  if (isGenerating) return <GeneratingBubble progress={generationProgress} />;
  if (isPdfCard) return <PdfCard contractType={contractType} isPaid={isPaid} onOpenPayment={onOpenPayment} onDownload={onDownload} plan={plan} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px', justifyContent: isBot ? 'flex-start' : 'flex-end', width: '100%', position: 'relative' }}>
      {isBot && <BotAvatar />}
      <div style={{ position: 'relative', maxWidth: '75%' }}>
        <div style={{
          padding: isBot ? '12px 16px' : '9px 15px', borderRadius: '20px',
          backgroundColor: isBot ? 'transparent' : '#059669',
          color: isBot ? 'rgba(255,255,255,0.85)' : 'white',
          borderBottomLeftRadius: isBot ? '4px' : '20px',
          borderBottomRightRadius: isBot ? '18px' : '20px',
          border: 'none',
          wordBreak: 'break-word', fontSize: '14px', lineHeight: '1.55'
        }}>
          {isBot
            ? (isAnimationDone
              ? <span>{message}</span>
              : <TypingText text={message} speed={12} onComplete={onAnimationComplete} />)
            : <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message}</p>}
        </div>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            onClick={handleCopy}
            title={copied ? 'Copiado!' : 'Copiar mensagem'}
            style={{
              position: 'absolute', top: '-10px',
              right: isBot ? 'auto' : '-10px', left: isBot ? '-10px' : 'auto',
              width: '26px', height: '26px', borderRadius: '8px',
              background: copied ? 'rgba(16,185,129,0.9)' : 'rgba(30,40,55,0.92)',
              border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {copied ? <Check size={12} color="white" /> : <Copy size={12} color="rgba(255,255,255,0.7)" />}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================
// TypingIndicator — três bolinhas animadas enquanto IA processa
// ============================================================
export const TypingIndicator = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '0 8px' }}>
    <BotAvatar />
    <div style={{ padding: '14px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        {[0, 0.15, 0.3].map((delay, i) => (
          <div key={i} style={{ width: '7px', height: '7px', backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: '50%', animation: 'bounce 1s infinite', animationDelay: `${delay}s` }} />
        ))}
      </div>
    </div>
  </motion.div>
);

// ============================================================
// ChatInput — campo de texto + botão de envio
// ============================================================
export const ChatInput = forwardRef(({ value, onChange, onSend, disabled }, ref) => {
  const textareaRef = useRef(null);
  const [focused, setFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }));

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  return (
    <div style={{ padding: '10px 16px 14px', paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))', background: 'linear-gradient(to top, rgba(8,13,20,1) 60%, rgba(8,13,20,0))' }}>
      <div style={{ maxWidth: '672px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '28px', padding: '8px 8px 8px 18px', border: focused ? '1.5px solid rgba(16,185,129,0.5)' : '1.5px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', transition: 'border-color 0.2s' }}>
          <textarea ref={textareaRef} value={value} onChange={e => onChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Digite sua resposta..." disabled={disabled} rows={1}
            style={{ flex: 1, backgroundColor: 'transparent', padding: '6px 0', color: 'white', resize: 'none', outline: 'none', minHeight: '40px', maxHeight: '120px', fontSize: '16px', border: 'none', fontFamily: 'inherit', lineHeight: '1.5' }} />
          <button onClick={onSend} disabled={disabled || !value.trim()} style={{
            flexShrink: 0, width: '36px', height: '36px', borderRadius: '18px',
            background: !disabled && value.trim() ? 'linear-gradient(135deg, #22c55e, #a3e635)' : 'rgba(255,255,255,0.07)',
            color: !disabled && value.trim() ? '#0d2010' : 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
          }}>
            {disabled ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={14} />}
          </button>
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '6px' }}>Enter para enviar · Shift+Enter para nova linha</p>
      </div>
    </div>
  );
});

// ============================================================
// ProgressSidebar — barra lateral de progresso (desktop only)
// ============================================================
export const ProgressSidebar = ({ currentStep, contractType, plan }) => {
  const steps = [
    { id: 1, name: 'Tipo de Contrato', icon: FileCheck },
    { id: 2, name: 'Dados', icon: Users },
    { id: 3, name: 'Contrato Pronto', icon: FileText },
  ];
  return (
    <div className="hidden lg:flex" style={{ width: '260px', position: 'fixed', left: 0, top: 0, bottom: 0, backgroundColor: '#060b11', borderRight: '1px solid rgba(255,255,255,0.06)', flexDirection: 'column', padding: '10px 20px' }}>
      <div style={{ marginBottom: '5px' }}>
        <img
          src="/contrati.png"
          alt="Contratify"
          style={{ width: '190px', height: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* Badge de plano — clean e discreto */}
      {plan && (
        <div style={{
          marginBottom: '20px', padding: '6px 10px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: '7px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: '500', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.02em' }}>
            {plan === 'premium' ? 'Com Sua Marca · R$ 49,90' : 'Padrão · R$ 39,90'}
          </span>
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
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
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tempo max estimado</span>
        </div>
        <p style={{ fontSize: '26px', fontWeight: '400', color: 'white', letterSpacing: '-0.02em' }}>3 min</p>
      </div>
    </div>
  );
};