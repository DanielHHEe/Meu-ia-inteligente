import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Eye, Upload, Type, Palette,
  Image as ImageIcon,
} from "lucide-react";

const PersonalizationScreen = ({ onComplete, onSkip }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#10b981');
  const [fontChoice, setFontChoice] = useState('Georgia');
  const [fontSize, setFontSize] = useState('13');
  const [companyName, setCompanyName] = useState('');
  const [watermark, setWatermark] = useState(true);
  const fileRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Merriweather&family=Playfair+Display&family=Source+Serif+4&family=Lato&family=Nunito&display=swap';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch { } };
  }, []);

  const fonts = [
    { label: 'Georgia', value: 'Georgia', category: 'Serif clássica' },
    { label: 'Times New Roman', value: 'Times New Roman', category: 'Formal' },
    { label: 'Merriweather', value: 'Merriweather', category: 'Serif elegante' },
    { label: 'Playfair Display', value: 'Playfair Display', category: 'Premium' },
    { label: 'Source Serif Pro', value: 'Source Serif Pro', category: 'Jurídica' },
    { label: 'Lato', value: 'Lato', category: 'Sans moderna' },
    { label: 'Arial', value: 'Arial', category: 'Sans clean' },
    { label: 'Helvetica', value: 'Helvetica', category: 'Sans neutra' },
    { label: 'Nunito', value: 'Nunito', category: 'Amigável' },
  ];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleComplete = () => {
    onComplete({
      logo: logoPreview,
      primaryColor,
      fontFamily: fontChoice,
      fontSize: parseInt(fontSize),
      companyName,
      watermark,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '32px 32px 48px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '9999px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <Sparkles size={12} color="#a3e635" />
          <span style={{ color: '#a3e635', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Com Sua Marca</span>
        </div>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'white', margin: 0, lineHeight: 1.2 }}>Personalize seu contrato</h2>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* LINHA 1: Logo + Nome lado a lado */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Logo */}
          <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ImageIcon size={18} color="#22c55e" />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: '600', fontSize: '14px', margin: 0 }}>Logo da empresa</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Aparece no topo do contrato</p>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            {logoPreview ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={logoPreview} alt="Logo" style={{ height: '40px', maxWidth: '120px', objectFit: 'contain', borderRadius: '6px', background: 'white', padding: '4px' }} />
                <button onClick={() => { setLogoPreview(null); setLogoFile(null); }} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>
                  Remover
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} style={{
                width: '100%', padding: '28px 20px', borderRadius: '12px', cursor: 'pointer',
                background: 'rgba(34,197,94,0.04)', border: '1.5px dashed rgba(34,197,94,0.25)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              }}>
                <Upload size={24} color="rgba(34,197,94,0.6)" />
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Clique para enviar</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>PNG, JPG ou SVG</span>
              </button>
            )}
          </div>

          {/* Nome + Marca d'água */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Type size={14} color="#22c55e" />
                <div>
                  <p style={{ color: 'white', fontWeight: '600', fontSize: '14px', margin: 0 }}>Nome da empresa</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Para marca d'água e rodapé</p>
                </div>
              </div>
              <input
                type="text"
                placeholder="Ex: Minha Empresa Ltda."
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Marca d'água toggle */}
            <div style={{ padding: '20px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'white', fontWeight: '600', fontSize: '13px', margin: '0 0 2px' }}>Marca d'água</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Nome em marca d'água sutil</p>
              </div>
              <button onClick={() => setWatermark(!watermark)} style={{
                width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer', border: 'none',
                background: watermark ? '#22c55e' : 'rgba(255,255,255,0.1)',
                position: 'relative', transition: 'all 0.2s', flexShrink: 0,
              }}>
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                  position: 'absolute', top: '3px',
                  left: watermark ? '21px' : '3px', transition: 'left 0.2s',
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* LINHA 2: Cor + Fonte lado a lado */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Cor */}
          <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Palette size={18} color="#22c55e" />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: '600', fontSize: '14px', margin: 0 }}>Cor da marca</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Títulos e destaques</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                style={{ width: '52px', height: '52px', borderRadius: '10px', border: 'none', cursor: 'pointer', padding: '2px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'monospace' }}>{primaryColor}</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#1f2937'].map(c => (
                <button key={c} onClick={() => setPrimaryColor(c)} style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: c,
                  border: primaryColor === c ? '2px solid white' : '2px solid transparent', cursor: 'pointer',
                }} />
              ))}
            </div>
          </div>

          {/* Fonte */}
          <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Type size={14} color="#22c55e" />
              <div>
                <p style={{ color: 'white', fontWeight: '600', fontSize: '14px', margin: 0 }}>Fonte do contrato</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Estilo tipográfico</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
              {fonts.map(f => (
                <button key={f.value} onClick={() => setFontChoice(f.value)} style={{
                  padding: '8px 10px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                  background: fontChoice === f.value ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${fontChoice === f.value ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                  <p style={{ color: fontChoice === f.value ? '#22c55e' : 'rgba(255,255,255,0.7)', fontSize: '12px', fontFamily: f.value, margin: '0 0 2px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', margin: 0 }}>{f.category}</p>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>Tamanho:</span>
              {['11', '12', '13', '14'].map(s => (
                <button key={s} onClick={() => setFontSize(s)} style={{
                  width: '38px', height: '38px', borderRadius: '8px', cursor: 'pointer',
                  background: fontSize === s ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${fontSize === s ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: fontSize === s ? '#22c55e' : 'rgba(255,255,255,0.35)', fontSize: '12px',
                }}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={onSkip} style={{
            flex: 1, padding: '24px', borderRadius: '16px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: '600',
          }}>
            Pular personalização
          </button>
          <motion.button
            onClick={handleComplete}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              flex: 2, padding: '24px', borderRadius: '16px', cursor: 'pointer', border: 'none',
              background: 'linear-gradient(135deg, #22c55e, #a3e635)',
              color: '#0d2010', fontSize: '14px', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}
          >
            <Eye size={17} /> Gerar com minha marca
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalizationScreen;