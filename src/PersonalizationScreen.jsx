import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Eye, Upload, Type, Palette,
  Image as ImageIcon, FileText, Wand2,
} from "lucide-react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return isMobile;
};

/* ── Extrai cores dominantes do logo via canvas ── */
const extractColorsFromImage = (imgSrc, count = 6) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 80;
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      const colorMap = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const a = data[i + 3];
        if (a < 128) continue;
        if (r > 220 && g > 220 && b > 220) continue;
        if (r < 30 && g < 30 && b < 30) continue;
        const key = `${r},${g},${b}`;
        colorMap[key] = (colorMap[key] || 0) + 1;
      }
      const sorted = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([key]) => {
          const [r, g, b] = key.split(',').map(Number);
          return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
        });
      resolve(sorted.length ? sorted : ['#10b981']);
    };
    img.onerror = () => resolve(['#10b981']);
    img.src = imgSrc;
  });
};

/* ── formatText: replica exatamente _generatePDF do Chat.jsx ── */
const formatPreviewHTML = (text, { primaryColor, fontFamily, fontSize }) => {
  if (!text) return '';
  const lines = text.split('\n');
  let html = '';
  let i = 0;

  while (lines.length > 0 && !lines[lines.length - 1].trim()) lines.pop();

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    const stripped = trimmed.replace(/\*\*/g, '').trim();

    if (!stripped) {
      let blanks = 0;
      while (i < lines.length && !lines[i].trim()) { blanks++; i++; }
      if (blanks > 0) html += '<div style="height:4px"></div>';
      continue;
    }

    if (/^(CONTRATO|TERMO|ACORDO|INSTRUMENTO)\s+DE\s+/i.test(stripped) && stripped === stripped.toUpperCase()) {
      html += `<p style="text-align:center;font-weight:bold;font-size:${fontSize + 1}px;letter-spacing:1px;text-transform:uppercase;color:${primaryColor};margin:0 0 18px;padding-bottom:14px;border-bottom:2px solid ${primaryColor}44;line-height:1.5;font-family:${fontFamily},serif">${stripped}</p>`;
      i++; continue;
    }

    if (/^CL[ÁA]USULA\s+[\dIVXLC]/i.test(stripped)) {
      html += `<p style="font-size:${Math.max(fontSize - 2, 9)}px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#374151;font-family:Arial,sans-serif;margin:16px 0 6px;padding:6px 10px;background:#f9fafb;border-left:3px solid ${primaryColor};line-height:1.4">${stripped}</p>`;
      i++; continue;
    }

    if (/^_{3,}/.test(stripped)) {
      const sigs = [];
      let j = i;
      while (j < lines.length) {
        const s = lines[j].trim().replace(/\*\*/g, '').trim();
        if (/^_{3,}/.test(s)) {
          let nameLabel = '';
          if (j + 1 < lines.length) {
            const next = lines[j + 1].trim().replace(/\*\*/g, '').trim();
            if (/^[A-ZÀ-Úa-z]/.test(next) && next !== '') { nameLabel = next; j++; }
          }
          sigs.push(nameLabel); j++;
        } else if (s === '') { j++; }
        else { break; }
      }
      html += `<div style="display:flex;gap:24px;margin-top:24px">`;
      sigs.forEach(label => {
        html += `<div style="flex:1;text-align:center">
          <div style="border-top:1px solid #9ca3af;padding-top:4px;margin-top:32px">
            <p style="font-size:${fontSize - 1}px;color:#1f2937;font-family:${fontFamily},serif;margin:0">${label}</p>
          </div>
        </div>`;
      });
      html += `</div>`;
      i = j; continue;
    }

    if (/^[A-ZÀ-Úa-záéíóúâêîôûãõç][a-zA-ZÀ-ú\s]+\s*[-–]\s*(VENDEDOR|COMPRADOR|CONTRATANTE|CONTRATADO|LOCADOR|LOCATÁRIO|FREELANCER|PARTE [AB])$/i.test(stripped)) { i++; continue; }
    if (/testemunha|witness/i.test(stripped)) { i++; continue; }

    const clean = stripped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html += `<p style="text-align:justify;margin:0 0 6px;color:#1f2937;line-height:1.75;font-family:${fontFamily},serif;font-size:${fontSize}px">${clean}</p>`;
    i++;
  }
  return html;
};

/* ── Preview que replica fielmente o PDF gerado ── */
const ContractPreview = ({ logo, primaryColor, fontFamily, fontSize, companyName, watermark }) => {
  const fs = fontSize || 13;

  const sampleText = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento particular, as partes abaixo qualificadas celebram o presente contrato, que se regerá pelas cláusulas e condições seguintes.

CONTRATANTE: Empresa Exemplo Ltda., CNPJ 00.000.000/0001-00

CONTRATADO: Prestador de Serviços ME, CNPJ 11.111.111/0001-11

CLÁUSULA 1ª – DO OBJETO
O presente contrato tem por objeto a prestação de serviços conforme especificado entre as partes, observadas as condições estabelecidas neste instrumento.

CLÁUSULA 2ª – DO PRAZO
O prazo de vigência deste contrato é de 12 (doze) meses, com início na data de assinatura, podendo ser renovado mediante acordo.

CLÁUSULA 3ª – DO VALOR E PAGAMENTO
Pela execução dos serviços, a CONTRATANTE pagará à CONTRATADA o valor mensal conforme acordado entre as partes.`;

  const bodyHTML = formatPreviewHTML(sampleText, { primaryColor, fontFamily, fontSize: fs });

  // Usamos um wrapper externo com overflow:hidden para clipar,
  // e um inner com zoom para escalar tudo proporcionalmente (inclusive marca d'água)
  return (
    <div style={{
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
      background: '#fff',
      maxHeight: '600px',
      overflowY: 'auto',
    }}>
      {/* Inner com zoom — reduz todo o conteúdo a ~60% */}
      <div style={{ zoom: 0.75, position: 'relative', padding: '32px 28px 28px', fontFamily: fontFamily || 'Georgia' }}>

        {/* Marca d'água — dentro do inner para ser afetada pelo zoom */}
        {watermark && companyName && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) rotate(-35deg)',
            pointerEvents: 'none', zIndex: 0,
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              fontSize: '72px', fontWeight: '800', color: primaryColor,
              opacity: 0.05, letterSpacing: '4px', textTransform: 'uppercase',
              fontFamily: fontFamily,
            }}>{companyName}</span>
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          {logo && (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <img src={logo} alt="logo" style={{ maxHeight: '64px', maxWidth: '200px', objectFit: 'contain' }} />
            </div>
          )}

          {/* Nome da empresa */}
          {companyName && (
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#6b7280', marginBottom: '16px', fontFamily }}>{companyName}</p>
          )}

          {/* Corpo formatado igual ao PDF */}
          <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />

          {/* Assinaturas */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '32px' }}>
            {['CONTRATANTE', 'CONTRATADO'].map(party => (
              <div key={party} style={{ flex: 1 }}>
                <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '6px', marginTop: '48px' }}>
                  <p style={{ fontSize: `${fs - 1}px`, color: '#4b5563', margin: 0, fontFamily }}>Nome / Assinatura</p>
                  <p style={{ fontSize: `${fs - 2}px`, color: '#9ca3af', margin: '2px 0 0', fontFamily }}>{party}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {companyName && (
            <p style={{ textAlign: 'center', fontSize: '10px', color: '#d1d5db', marginTop: '20px', fontFamily }}>{companyName}</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const PersonalizationScreen = ({ onComplete, onSkip }) => {
  const isMobile = useIsMobile();
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#10b981');
  const [fontChoice, setFontChoice] = useState('Georgia');
  const [fontSize, setFontSize] = useState('13');
  const [companyName, setCompanyName] = useState('');
  const [watermark, setWatermark] = useState(true);
  const [extractedColors, setExtractedColors] = useState([]);
  const [extracting, setExtracting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Merriweather&family=Playfair+Display&family=Source+Serif+4&family=Lato&family=Nunito&display=swap';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
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

  const fallbackColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#1f2937'];

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const src = ev.target.result;
      setLogoPreview(src);
      setExtracting(true);
      try {
        const colors = await extractColorsFromImage(src, 6);
        setExtractedColors(colors);
        if (colors.length > 0) setPrimaryColor(colors[0]);
      } catch {
        setExtractedColors([]);
      } finally {
        setExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleComplete = () => {
    onComplete({ logo: logoPreview, primaryColor, fontFamily: fontChoice, fontSize: parseInt(fontSize), companyName, watermark });
  };

  const previewProps = { logo: logoPreview, primaryColor, fontFamily: fontChoice, fontSize: parseInt(fontSize), companyName, watermark };
  const paletteColors = extractedColors.length > 0 ? extractedColors : fallbackColors;

  const card = {
    padding: isMobile ? '16px' : '20px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxSizing: 'border-box',
  };

  const cardHeader = {
    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
  };

  const iconBox = {
    width: '32px', height: '32px', borderRadius: '10px',
    background: 'rgba(34,197,94,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '20px 14px 40px' : '28px 28px 48px', boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '8px' : '12px', marginBottom: isMobile ? '18px' : '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 12px', borderRadius: '9999px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', alignSelf: 'flex-start' }}>
          <Sparkles size={11} color="#a3e635" />
          <span style={{ color: '#a3e635', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Com Sua Marca</span>
        </div>
        <h2 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: '800', color: 'white', margin: 0, lineHeight: 1.2 }}>Personalize seu contrato</h2>
      </div>

      {/* Master layout: controles | preview */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: '20px', alignItems: 'start' }}>

        {/* ── Controles ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Linha 1: Logo + Nome/Marca */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>

            {/* Logo */}
            <div style={card}>
              <div style={cardHeader}>
                <div style={iconBox}><ImageIcon size={15} color="#22c55e" /></div>
                <div>
                  <p style={{ color: 'white', fontWeight: '600', fontSize: '13px', margin: 0 }}>Logo da empresa</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Aparece no topo do contrato</p>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              {logoPreview ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: extractedColors.length || extracting ? '12px' : 0 }}>
                    <img src={logoPreview} alt="Logo" style={{ height: '34px', maxWidth: '110px', objectFit: 'contain', borderRadius: '6px', background: 'white', padding: '4px' }} />
                    <button onClick={() => { setLogoPreview(null); setLogoFile(null); setExtractedColors([]); }}
                      style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>
                      Remover
                    </button>
                  </div>
                  <AnimatePresence>
                    {(extractedColors.length > 0 || extracting) && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                          <Wand2 size={11} color="#a3e635" />
                          <span style={{ color: '#a3e635', fontSize: '10px', fontWeight: '700', letterSpacing: '0.05em' }}>
                            {extracting ? 'EXTRAINDO CORES...' : 'CORES DO SEU LOGO'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {extracting
                            ? [1,2,3,4,5,6].map(i => <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />)
                            : extractedColors.map(c => (
                              <button key={c} onClick={() => setPrimaryColor(c)} title={c} style={{
                                width: '24px', height: '24px', borderRadius: '50%', background: c,
                                border: primaryColor === c ? '2.5px solid white' : '2px solid rgba(255,255,255,0.15)',
                                cursor: 'pointer', transform: primaryColor === c ? 'scale(1.18)' : 'scale(1)', transition: 'transform 0.15s',
                              }} />
                            ))
                          }
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} style={{
                  width: '100%', padding: '20px 12px', borderRadius: '12px', cursor: 'pointer',
                  background: 'rgba(34,197,94,0.04)', border: '1.5px dashed rgba(34,197,94,0.25)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', boxSizing: 'border-box',
                }}>
                  <Upload size={20} color="rgba(34,197,94,0.6)" />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Clique para enviar</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>PNG, JPG ou SVG</span>
                </button>
              )}
            </div>

            {/* Nome + Marca d'água */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ ...card, flex: 1 }}>
                <div style={cardHeader}>
                  <Type size={14} color="#22c55e" style={{ flexShrink: 0 }} />
                  <div>
                    <p style={{ color: 'white', fontWeight: '600', fontSize: '13px', margin: 0 }}>Nome da empresa</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Marca d'água e rodapé</p>
                  </div>
                </div>
                <input type="text" placeholder="Ex: Minha Empresa Ltda." value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <p style={{ color: 'white', fontWeight: '600', fontSize: '13px', margin: '0 0 2px' }}>Marca d'água</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Nome sutil nas páginas</p>
                </div>
                <button onClick={() => setWatermark(!watermark)} style={{
                  width: '42px', height: '24px', borderRadius: '12px', cursor: 'pointer', border: 'none',
                  background: watermark ? '#22c55e' : 'rgba(255,255,255,0.1)',
                  position: 'relative', transition: 'all 0.2s', flexShrink: 0,
                }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: watermark ? '21px' : '3px', transition: 'left 0.2s' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Linha 2: Cor + Fonte */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>

            {/* Cor */}
            <div style={card}>
              <div style={cardHeader}>
                <div style={iconBox}><Palette size={15} color="#22c55e" /></div>
                <div>
                  <p style={{ color: 'white', fontWeight: '600', fontSize: '13px', margin: 0 }}>Cor da marca</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Títulos e destaques</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                  style={{ width: '44px', height: '44px', borderRadius: '10px', border: 'none', cursor: 'pointer', padding: '2px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'monospace' }}>{primaryColor}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {paletteColors.map(c => (
                  <button key={c} onClick={() => setPrimaryColor(c)} style={{
                    width: '28px', height: '28px', borderRadius: '50%', background: c,
                    border: primaryColor === c ? '2.5px solid white' : '2px solid transparent',
                    cursor: 'pointer', transform: primaryColor === c ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.15s',
                  }} />
                ))}
              </div>
            </div>

            {/* Fonte */}
            <div style={card}>
              <div style={cardHeader}>
                <Type size={14} color="#22c55e" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ color: 'white', fontWeight: '600', fontSize: '13px', margin: 0 }}>Fonte do contrato</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Estilo tipográfico</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '5px', marginBottom: '10px' }}>
                {fonts.map(f => (
                  <button key={f.value} onClick={() => setFontChoice(f.value)} style={{
                    padding: '7px 6px', borderRadius: '9px', cursor: 'pointer', textAlign: 'left',
                    background: fontChoice === f.value ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${fontChoice === f.value ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                    <p style={{ color: fontChoice === f.value ? '#22c55e' : 'rgba(255,255,255,0.7)', fontSize: '11px', fontFamily: f.value, margin: '0 0 1px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: '9px', margin: 0 }}>{f.category}</p>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>Tamanho:</span>
                {['11', '12', '13', '14'].map(sv => (
                  <button key={sv} onClick={() => setFontSize(sv)} style={{
                    width: '34px', height: '34px', borderRadius: '7px', cursor: 'pointer',
                    background: fontSize === sv ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${fontSize === sv ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: fontSize === sv ? '#22c55e' : 'rgba(255,255,255,0.35)', fontSize: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{sv}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', marginTop: '4px' }}>
            <button onClick={onSkip} style={{
              flex: isMobile ? 'none' : 1, padding: isMobile ? '14px' : '18px', borderRadius: '16px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: '600',
            }}>Pular personalização</button>
            <motion.button onClick={handleComplete} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
              flex: isMobile ? 'none' : 2, padding: isMobile ? '16px' : '18px', borderRadius: '16px', cursor: 'pointer', border: 'none',
              background: 'linear-gradient(135deg, #22c55e, #a3e635)', color: '#0d2010', fontSize: '14px', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <Eye size={16} /> Gerar com minha marca
            </motion.button>
          </div>
        </div>

        {/* ── Preview ao vivo (desktop) ── */}
        {!isMobile && (
          <div style={{ position: 'sticky', top: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
              <FileText size={13} color="rgba(255,255,255,0.4)" />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Preview ao vivo</span>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
            </div>
            <motion.div
              key={`${primaryColor}-${fontChoice}-${fontSize}-${companyName}-${watermark}-${logoPreview ? 'logo' : 'nologo'}`}
              initial={{ opacity: 0.75, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18 }}
            >
              <ContractPreview {...previewProps} />
            </motion.div>
            <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '10px', textAlign: 'center', marginTop: '8px' }}>
              Atualiza em tempo real conforme você edita
            </p>
          </div>
        )}

        {/* Mobile: dica */}
        {isMobile && (
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={15} color="#22c55e" style={{ flexShrink: 0 }} />
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', margin: 0 }}>
              O preview ao vivo aparece no desktop. No celular, clique em <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Gerar</strong> para ver o resultado.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PersonalizationScreen;