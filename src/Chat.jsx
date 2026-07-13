// ============================================================
// Chat.jsx
// Componente principal — lógica de estado, API, PDF e Supabase.
// Componentes visuais importados de ChatComponents.jsx
// ============================================================

import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./config/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ChatService } from './chatService';
import { supabase } from "./config/supabase";
import PersonalizationScreen from "./PersonalizationScreen";
import {
  contractTypes,
  ChatUserAvatar,
  ContractTypeSelector,
  MessageBubble,
  TypingIndicator,
  ChatInput,
  ProgressSidebar,
  PaymentModal,
} from "./ChatComponents";

// ============================================================
// Chat — componente principal
// ============================================================
const Chat = () => {
  const location = useLocation();
  const plan = location.state?.plan || 'standard';
  const price = plan === 'premium' ? 49.90 : 39.90;
  const { user } = useAuth();

  // ── Estado ──────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedContract, setSelectedContract] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatService, setChatService] = useState(null);
  const [generatedContract, setGeneratedContract] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [brandingData, setBrandingData] = useState(null);
  const [completedMessages, setCompletedMessages] = useState(new Set());
  const [generationProgress, setGenerationProgress] = useState({ pct: 0, label: '' });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const contractIdRef = useRef(null);

  // ── Scroll automático ────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping, isGenerating]);

  // ── CSS global ───────────────────────────────────────────────
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; overflow: hidden; background: #080d14 !important; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      ::placeholder { color: rgba(255,255,255,0.5) !important; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // ── Viewport height (mobile) ─────────────────────────────────
  useEffect(() => {
    const setVh = () => { document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`); };
    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    return () => { window.removeEventListener('resize', setVh); window.removeEventListener('orientationchange', setVh); };
  }, []);

  // ── Largura da janela ────────────────────────────────────────
  useEffect(() => {
    const h = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // ============================================================
  // SUPABASE HELPERS
  // ============================================================
  const saveContractToDB = async (contractType, tokensUsed = 0) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          user_id: user.id,
          user_email: user.email,
          contract_type: contractType.id,
          plan: plan,
          is_paid: false,
          amount: price,
          tokens_used: tokensUsed,
        })
        .select()
        .single();
      if (error) throw error;
      contractIdRef.current = data.id;
      return data.id;
    } catch (e) {
      console.error('Erro ao salvar contrato:', e);
      return null;
    }
  };

  const savePaymentToDB = async () => {
    if (!user || !contractIdRef.current) return;
    try {
      await supabase
        .from('contracts')
        .update({ is_paid: true, paid_at: new Date().toISOString() })
        .eq('id', contractIdRef.current);

      await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          user_email: user.email,
          contract_id: contractIdRef.current,
          contract_type: selectedContract?.id,
          amount: price,
          plan: plan,
          payment_method: 'pix',
        });
    } catch (e) {
      console.error('Erro ao salvar pagamento:', e);
    }
  };

  // ============================================================
  // HANDLERS DE CHAT
  // ============================================================
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 50);

  const handleSelectContract = async (type) => {
    setSelectedContract(type);
    setCurrentStep(2);
    setMessages([]);
    setIsPaid(false);
    setGeneratedContract(null);
    setBrandingData(null);
    setCompletedMessages(new Set());
    contractIdRef.current = null;
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
    focusInput();
    try {
      const response = await chatService.sendUserMessage(userMessage);
      setMessages(prev => [...prev, { text: response.message, isBot: true }]);
      if (response.isComplete) {
        setTimeout(async () => {
          setIsGenerating(true);
          setGenerationProgress({ pct: 0, label: 'Iniciando...' });
          setMessages(prev => [...prev, { text: '__GENERATING__', isBot: true, isGenerating: true }]);
          try {
            const contract = await chatService.generateContract((pct, _total, label) => {
              setGenerationProgress({ pct, label });
            });
            setGeneratedContract(contract);
            setCurrentStep(3);
            await saveContractToDB(selectedContract);

            if (contract?.validationErrors?.length > 0) {
              console.warn('[Chat] Avisos de validação:', contract.validationErrors);
            }

            setMessages(prev => prev.map(m =>
              m.isGenerating ? { text: '__PDF_READY__', isBot: true, isPdfCard: true } : m
            ));
          } catch (e) {
            setMessages(prev => prev.map(m =>
              m.isGenerating ? { text: `❌ Erro ao gerar o contrato: ${e.message}`, isBot: true } : m
            ));
          } finally {
            setIsGenerating(false);
            setGenerationProgress({ pct: 0, label: '' });
          }
        }, 1000);
      }
    } catch (e) {
      setMessages(prev => [...prev, { text: `❌ Erro: ${e.message}`, isBot: true }]);
    } finally {
      setIsTyping(false);
      focusInput();
    }
  };

  // ============================================================
  // HANDLERS DE PAGAMENTO E PERSONALIZAÇÃO
  // ============================================================
  const handlePaymentConfirmed = async () => {
    await savePaymentToDB();
    setShowPaymentModal(false);
    if (plan === 'premium') {
      setShowPersonalization(true);
    } else {
      setIsPaid(true);
    }
  };

  const handlePersonalizationComplete = (branding) => {
    setBrandingData(branding);
    setShowPersonalization(false);
    setIsPaid(true);
    setTimeout(() => handleDownloadWithBranding(branding), 300);
  };

  const handlePersonalizationSkip = () => {
    setShowPersonalization(false);
    setIsPaid(true);
    setTimeout(() => handleDownloadWithBranding(null), 300);
  };

  const handleDownloadWithBranding = (brandingOverride) => {
    if (!generatedContract) return;
    const contractText = typeof generatedContract === 'string'
      ? generatedContract
      : generatedContract.contract || generatedContract.content || String(generatedContract);
    const activeBranding = brandingOverride !== undefined ? brandingOverride : brandingData;
    _generatePDF(contractText, {
      primaryColor: activeBranding?.primaryColor || '#10b981',
      fontFamily: activeBranding?.fontFamily || 'Lora',
      fontSize: activeBranding?.fontSize || 13,
      logoSrc: activeBranding?.logo || null,
      companyName: activeBranding?.companyName || '',
      watermark: activeBranding?.watermark ?? false,
    });
  };

  const handleDownload = () => {
    if (!generatedContract || !isPaid) return;
    const contractText = typeof generatedContract === 'string'
      ? generatedContract
      : generatedContract.contract || generatedContract.content || String(generatedContract);
    _generatePDF(contractText, {
      primaryColor: brandingData?.primaryColor || '#10b981',
      fontFamily: brandingData?.fontFamily || 'Lora',
      fontSize: brandingData?.fontSize || 13,
      logoSrc: brandingData?.logo || null,
      companyName: brandingData?.companyName || '',
      watermark: brandingData?.watermark ?? false,
    });
  };

  // ============================================================
  // _generatePDF — converte texto do contrato em PDF via html2pdf
  // ============================================================
  const _generatePDF = (contractText, { primaryColor, fontFamily, fontSize, logoSrc, companyName, watermark }) => {
    const fileName = `${selectedContract?.name || 'Contrato'}.pdf`;
    // Usa Lora + Inter para visual profissional
    const headingFont = `'Lora', Georgia, serif`;
    const bodyFont    = `'Inter', ${fontFamily}, sans-serif`;
    const serifFont   = `${fontFamily}, Georgia, serif`;

    // ----------------------------------------------------------
    // formatText — parser linha a linha com 5 tipos de bloco:
    //   1. Título do contrato  (CONTRATO DE / TERMO DE …)
    //   2. Bloco cabeçalho     (CONTRATANTE: X / CPF: Y …)
    //   3. Título de cláusula  (CLÁUSULA Xª —)
    //   4. Parágrafo §         (§1º, §2º …)
    //   5. Parágrafo comum     (texto corrido justificado)
    //
    // FIX de paginação: cada cláusula + seus §§ ficam dentro de
    // um <div style="page-break-inside:avoid"> para nunca separar
    // o título do seu conteúdo entre páginas.
    // FIX de espaçamento: eliminados os <div height:Npx> — espaço
    // vem de margin nos próprios elementos.
    // FIX de cabeçalho: CHAVE:valor renderizado em tabela alinhada.
    //
    // FIX de acentuação (aluguel/sociedade/comodato): os campos
    // gerados por buildHeader (a partir de locatario_nome,
    // socio_a_nome, socio_b_nome, comodatario_nome) NÃO têm acento
    // ("LOCATARIO", "SOCIO A", "SOCIO B", "COMODATARIO"), enquanto
    // as regex de separação de Parte A/B e o mapa de rótulos só
    // reconheciam as versões acentuadas ("LOCATÁRIO", "SÓCIO A",
    // "SÓCIO B", "COMODATÁRIO"). Isso fazia essas linhas caírem
    // todas no mesmo bloco (Parte A), gerando um card único
    // misturado em vez de dois cards lado a lado como nos demais
    // tipos de contrato. As versões sem acento foram adicionadas
    // como alternativas nas regex e nos mapas, mantendo o texto
    // exibido corretamente acentuado.
    // ----------------------------------------------------------
    const formatText = (text) => {
      const lines = text.split('\n');
      while (lines.length > 0 && !lines[lines.length - 1].trim()) lines.pop();

      let html = '';
      let i = 0;
      let inClauseBlock = false;

      const closeClauseBlock = () => {
        if (inClauseBlock) { html += '</div>'; inClauseBlock = false; }
      };

      while (i < lines.length) {
        const stripped = lines[i].trim().replace(/\*\*/g, '').trim();

        // ── linha em branco ──────────────────────────────────────
        if (!stripped) { i++; continue; }

        // ── 1. Título principal do contrato ──────────────────────
        // Aceita tanto "CONTRATO DE PRESTAÇÃO..." (maiúsculas) quanto
        // "Contrato de Prestação..." (capitalizado) para robustez.
        // FIX: restrito a i === 0 (primeira linha do documento) — o
        // título real é sempre a primeira linha (buildHeader garante
        // isso). Sem essa checagem, uma expressão de estilo no meio de
        // uma cláusula (ex.: "Contrato de Livre e Espontânea Vontade...")
        // batia com a mesma regex e era renderizada como se fosse o
        // título do documento inteiro.
        if (i === 0 && /^(CONTRATO|TERMO|ACORDO|INSTRUMENTO)\s+DE\s+/i.test(stripped)) {
          closeClauseBlock();
          // Título profissional: Lora centrado com linha decorativa
          // Converte título para Title Case adequado: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS" → "Contrato de Prestação de Serviços"
          const toTitleCase = (str) => {
            const lower_words = ['de','do','da','dos','das','e','em','a','o','as','os','para','por','com','sem','sob','sobre'];
            return str.toLowerCase().split(' ').map((w, i) =>
              (i === 0 || !lower_words.includes(w)) ? w.charAt(0).toUpperCase() + w.slice(1) : w
            ).join(' ');
          };
          html += `<div style="text-align:center;margin:0 0 36px;padding-bottom:24px;`
               + `border-bottom:1px solid #e2e8f0;">`
               + `<p style="font-size:10px;letter-spacing:0.14em;color:#94a3b8;`
               + `margin:0 0 10px;font-family:'Inter',sans-serif;text-transform:uppercase;">`
               + `Instrumento Particular</p>`
               + `<p style="font-family:'Lora',Georgia,serif;font-size:${fontSize + 6}px;`
               + `font-weight:600;color:#1e293b;margin:0 0 8px;line-height:1.3;`
               + `letter-spacing:0.01em;">${toTitleCase(stripped)}</p>`
               + (() => { let d=''; for(let li=i+1;li<Math.min(i+10,lines.length);li++){const ls=lines[li].trim(); if(/^DATA\s+DE\s+ASSINATURA\s*:/i.test(ls)){d=ls.split(':').slice(1).join(':').trim();break;}} return d?`<p style="font-size:11px;color:#94a3b8;margin:0;font-family:'Inter',sans-serif;">${d}</p>`:''; })()
               + `</div>`;
          i++; continue;
        }

        // ── 2. Bloco de cabeçalho CHAVE: valor ───────────────────
        // Detecta APENAS campos do cabeçalho do contrato:
        // - Chave totalmente em maiúsculas (ex: CONTRATANTE, CPF/CNPJ, EMAIL)
        // - Separados de texto corrido como "NOTA:", "IMPORTANTE:", "PARÁGRAFO ÚNICO:"
        // Critério: a chave antes dos ":" deve ser TODA EM MAIÚSCULAS e ter
        // no máximo 5 palavras (campos simples, não sentenças).
        const isHeaderLine = (s) => {
          if (/^(§|CL[ÁA]USULA)/i.test(s)) return false;
          if (/^(E,?\s+por\s+estarem|PARÁGRAFO\s+[ÚU]NICO|SUBCL)/i.test(s)) return false;
          const colonIdx = s.indexOf(':');
          if (colonIdx < 2) return false;
          const key = s.slice(0, colonIdx).trim();
          const val = s.slice(colonIdx + 1).trim();
          // Rejeita valores muito longos (>100 chars) — não ficam bem em tabela
          if (val.length > 100) return false;
          // Palavras isoladas que NÃO são campos — são marcadores de texto corrido
          const NOT_FIELDS = /^(NOTA|IMPORTANTE|OBSERVE|ATEN[ÇC][ÃA]O|EXEMPLO|OBS|RESSALVA|DESTAQUE|AVISO|LEMBRETE|CONSIDERANDO|PORTANTO|ASSIM|LOGO|OUTROSSIM)$/i;
          if (NOT_FIELDS.test(key)) return false;
          // Chave deve ser toda maiúscula (aceita /, -, espaço, números) e no máx 5 palavras
          if (!/^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ\s\/\-0-9]+$/.test(key)) return false;
          const wordCount = key.split(/\s+/).filter(Boolean).length;
          return wordCount <= 5;
        };

        if (isHeaderLine(stripped)) {
          closeClauseBlock();
          // Coleta todas as linhas de cabeçalho consecutivas
          const headerLines = [];
          while (i < lines.length) {
            const s = lines[i].trim().replace(/\*\*/g, '').trim();
            if (!s) { i++; break; }
            if (/^(CL[ÁA]USULA|§)/i.test(s)) break;
            if (headerLines.length > 0 && !isHeaderLine(s)) break;
            // Ignora linha de DATA DE ASSINATURA — aparece no título, não precisa no cabeçalho
            if (/^DATA\s+DE\s+ASSINATURA/i.test(s)) { i++; continue; }
            headerLines.push(s);
            i++;
          }
          if (headerLines.length > 0) {
            // Separa campos por parte (CONTRATANTE vs CONTRATADO/LOCADOR etc)
            const parteA = []; const parteB = []; const outros = [];
            // Todos os possíveis nomes de Parte A e Parte B em todos os tipos de contrato
            // FIX: adicionadas as variantes SEM acento (LOCATARIO, COMODATARIO,
            // SOCIO A, SOCIO B) — são as que realmente vêm de buildHeader.
            const parteAKeys = /^(CONTRATANTE|LOCADOR|PARTE A|VENDEDOR|REVELADOR|COMODANTE|REPRESENTADA|SÓCIO A|SOCIO A)/i;
            const parteBKeys = /^(CONTRATADO|LOCATÁRIO|LOCATARIO|PARTE B|COMPRADOR|RECEPTOR|FREELANCER|EMPREITEIRO|COMODATÁRIO|COMODATARIO|REPRESENTANTE|SÓCIO B|SOCIO B)/i;
            const dataKeys   = /^(DATA|MODALIDADE|CIDADE|ESTADO)/i;
            // Mapa de label amigável por chave detectada
            // FIX: adicionadas as chaves sem acento apontando para o
            // mesmo rótulo acentuado exibido na tela.
            const LABEL_MAP = {
              CONTRATANTE: 'Contratante', CONTRATADO: 'Contratado',
              LOCADOR: 'Locador', LOCATÁRIO: 'Locatário', LOCATARIO: 'Locatário',
              'PARTE A': 'Parte A', 'PARTE B': 'Parte B',
              VENDEDOR: 'Vendedor', COMPRADOR: 'Comprador',
              REVELADOR: 'Parte Reveladora', RECEPTOR: 'Parte Receptora',
              FREELANCER: 'Freelancer', EMPREITEIRO: 'Empreiteiro',
              COMODANTE: 'Comodante', COMODATÁRIO: 'Comodatário', COMODATARIO: 'Comodatário',
              REPRESENTADA: 'Representada', REPRESENTANTE: 'Representante',
              'SÓCIO A': 'Sócio A', 'SÓCIO B': 'Sócio B', 'SOCIO A': 'Sócio A', 'SOCIO B': 'Sócio B',
            };
            let currentSection = 'outros';
            let labelA = 'Contratante'; let labelB = 'Contratado';
            // FIX: antes, labelA/labelB eram sobrescritos a CADA linha do
            // cabeçalho pertencente àquela parte (ex.: primeiro "LOCADOR",
            // depois "LOCADOR CPF/CNPJ", depois "LOCADOR TELEFONE"...), e
            // como o rótulo ficava com o valor da ÚLTIMA linha processada,
            // o cartão acabava mostrando "LOCADOR ESTADO CIVIL" em vez de
            // apenas "Locador". Isso acontecia em TODOS os tipos de
            // contrato (ex.: "CONTRATANTE EMAIL" em prestação de serviços),
            // só era menos perceptível quando o último campo tinha um nome
            // mais discreto. Agora o rótulo só é definido UMA vez, na
            // primeira linha em que a parte é identificada (que é sempre a
            // linha do nome, pela ordem de campos em buildHeader).
            let labelASet = false; let labelBSet = false;
            headerLines.forEach(line => {
              const key = line.split(':')[0].trim().toUpperCase();
              if (parteAKeys.test(key)) {
                currentSection = 'a';
                if (!labelASet) {
                  labelA = LABEL_MAP[key] || key.charAt(0) + key.slice(1).toLowerCase();
                  labelASet = true;
                }
              } else if (parteBKeys.test(key)) {
                currentSection = 'b';
                if (!labelBSet) {
                  labelB = LABEL_MAP[key] || key.charAt(0) + key.slice(1).toLowerCase();
                  labelBSet = true;
                }
              } else if (dataKeys.test(key)) {
                currentSection = 'outros';
              }
              if (currentSection === 'a')      parteA.push(line);
              else if (currentSection === 'b') parteB.push(line);
              else                             outros.push(line);
            });

            const renderPartyCard = (lines, label, color) => {
              if (!lines.length) return '';
              const nameColonIdx = lines[0].indexOf(':');
              const name = nameColonIdx > 0 ? lines[0].slice(nameColonIdx + 1).trim() : lines[0];
              const initials = name.split(/\s+/).slice(0,2).map(w => w[0]||'').join('').toUpperCase();
              const rest = lines.slice(1);
              const bgMap  = { blue:'#eff6ff', green:'#f0fdf4' };
              const txtMap = { blue:'#1e40af', green:'#166534' };
              const brdMap = { blue:'#bfdbfe', green:'#bbf7d0' };
              // Mapa de labels curtos para os campos dentro do card
              const SHORT_LABELS = {
                'CPF': 'CPF', 'CNPJ': 'CNPJ', 'CPF/CNPJ': 'CPF/CNPJ',
                'TELEFONE': 'Telefone', 'EMAIL': 'E-mail',
                'ESTADO CIVIL': 'Estado civil', 'REGISTRO': 'Registro',
              };
              // Strip o prefixo da parte (ex: "CONTRATANTE CPF/CNPJ" → "CPF/CNPJ")
              // FIX: adicionadas as variantes sem acento (LOCATARIO,
              // COMODATARIO, SOCIO A, SOCIO B) para que o prefixo também
              // seja removido corretamente nesses casos.
              const cleanLabel = (rawKey) => {
                const partesPrefixos = ['CONTRATANTE','CONTRATADO','LOCADOR','LOCATÁRIO','LOCATARIO',
                  'PARTE A','PARTE B','VENDEDOR','COMPRADOR','REVELADOR','RECEPTOR',
                  'FREELANCER','EMPREITEIRO','COMODANTE','COMODATÁRIO','COMODATARIO',
                  'REPRESENTADA','REPRESENTANTE','SÓCIO A','SÓCIO B','SOCIO A','SOCIO B'];
                let k = rawKey.trim();
                partesPrefixos.forEach(p => {
                  if (k.toUpperCase().startsWith(p + ' ')) k = k.slice(p.length).trim();
                  else if (k.toUpperCase() === p) k = '';
                });
                return SHORT_LABELS[k.toUpperCase()] || (k.charAt(0).toUpperCase() + k.slice(1).toLowerCase());
              };
              return `<div style="flex:1;padding:14px 16px;border:1px solid ${brdMap[color]};`
                + `border-radius:8px;background:${bgMap[color]};page-break-inside:avoid;">`
                + `<p style="font-size:9px;letter-spacing:0.1em;color:${txtMap[color]};`
                + `margin:0 0 10px;font-family:'Inter',sans-serif;text-transform:uppercase;">${label}</p>`
                + `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">`
                + `<div style="width:32px;height:32px;border-radius:50%;background:${txtMap[color]};`
                + `display:flex;align-items:center;justify-content:center;font-size:11px;`
                + `font-weight:600;color:white;flex-shrink:0;">${initials}</div>`
                + `<p style="font-size:${fontSize - 1}px;font-weight:600;color:#1e293b;`
                + `margin:0;font-family:'Inter',sans-serif;line-height:1.3;">${name}</p>`
                + `</div>`
                + rest.map(line => {
                    const ci = line.indexOf(':');
                    if (ci < 0) return '';
                    const rawK = line.slice(0, ci).trim();
                    const v    = line.slice(ci + 1).trim();
                    const k    = cleanLabel(rawK);
                    if (!k) return '';
                    return `<div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px;">`
                         + `<span style="font-size:${fontSize - 2}px;color:#64748b;`
                         + `white-space:nowrap;min-width:55px;font-family:'Inter',sans-serif;">${k}:</span>`
                         + `<span style="font-size:${fontSize - 2}px;color:#374151;`
                         + `word-break:break-all;font-family:'Inter',sans-serif;flex:1;">${v}</span>`
                         + `</div>`;
                  }).join('')
                + `</div>`;
            };

            if (parteA.length || parteB.length) {
              html += `<div style="margin:0 0 24px;page-break-inside:avoid;">`
                    + `<div style="display:flex;gap:12px;">`
                    + renderPartyCard(parteA, labelA, 'blue')
                    + renderPartyCard(parteB, labelB, 'green')
                    + `</div>`;
              if (outros.length) {
                html += `<div style="margin-top:8px;padding:10px 16px;background:#f8fafc;`
                      + `border:1px solid #e2e8f0;border-radius:8px;`
                      + `display:flex;flex-wrap:wrap;gap:16px;">`;
                outros.forEach(line => {
                  const ci = line.indexOf(':');
                  if (ci < 0) return;
                  const k = line.slice(0, ci).trim();
                  const v = line.slice(ci + 1).trim();
                  html += `<div style="display:flex;gap:4px;">`
                       + `<span style="font-size:${fontSize - 2}px;color:#64748b;`
                       + `font-family:'Inter',sans-serif;">${k}:</span>`
                       + `<span style="font-size:${fontSize - 2}px;color:#1e293b;`
                       + `font-weight:500;font-family:'Inter',sans-serif;">${v}</span>`
                       + `</div>`;
                });
                html += `</div>`;
              }
              html += `</div>`;
            } else {
              // fallback: layout simples
              html += `<div style="margin:0 0 20px;padding:14px 18px;`
                   + `background:#f8fafc;border:1px solid #e2e8f0;`
                   + `border-radius:8px;page-break-inside:avoid;">`;
              headerLines.forEach(line => {
                const ci = line.indexOf(':');
                if (ci > 0) {
                  const k = line.slice(0, ci).trim();
                  const v = line.slice(ci + 1).trim();
                  html += `<div style="display:flex;gap:8px;margin-bottom:4px;">`
                        + `<span style="font-size:${fontSize - 1}px;font-weight:600;`
                        + `color:#374151;white-space:nowrap;min-width:160px;`
                        + `font-family:'Inter',sans-serif;">${k}:</span>`
                        + `<span style="font-size:${fontSize - 1}px;color:#1f2937;`
                        + `font-family:'Inter',sans-serif;">${v}</span>`
                        + `</div>`;
                }
              });
              html += `</div>`;
            }
          }
          continue;
        }

        // ── 3. Título de cláusula ─────────────────────────────────
        // FIX de paginação: html2pdf ignora page-break-inside:avoid em blocos
        // maiores que uma página. Solução: wrappear APENAS título + §1º juntos
        // (o que realmente não pode ser separado). Os §§ seguintes ficam livres.
        if (/^CL[ÁA]USULA\s+[\dIVXLC]/i.test(stripped)) {
          closeClauseBlock();
          // Pré-lê a próxima linha não-vazia para saber se é um §
          let nextContentLine = '';
          let lookahead = i + 1;
          while (lookahead < lines.length && !lines[lookahead].trim()) lookahead++;
          if (lookahead < lines.length) {
            nextContentLine = lines[lookahead].trim().replace(/\*\*/g, '').trim();
          }
          const hasImmediateParagraph = /^§\d+[º°]?\s/.test(nextContentLine);

          // Abre div da cláusula — sem page-break-inside no wrapper inteiro
          // (evita espaços em branco grandes). O page-break-inside:avoid
          // fica apenas no título (abaixo) para nunca deixar o título isolado.
          html += `<div style="margin-top:22px;">`;
          inClauseBlock = true;

          // Se há §1º logo após o título, emite os dois juntos num div
          // page-break-inside:avoid — solução confiável para html2pdf.
          // O page-break-after:avoid é ignorado pelo html2pdf (bug da lib).
          const titleHtml = `<p style="font-size:${fontSize - 2}px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:#1e293b;font-family:'Inter',sans-serif;margin:0 0 10px;padding:8px 14px;background:#f8fafc;border-left:3px solid ${primaryColor};line-height:1.4;word-wrap:break-word;overflow-wrap:break-word;white-space:normal;">${stripped}</p>`;

          if (hasImmediateParagraph) {
            // Avança i para o §1º
            i++;
            // Pula linhas em branco
            while (i < lines.length && !lines[i].trim()) i++;
            // Lê o §1º
            const firstParaLine = i < lines.length ? lines[i].trim().replace(/\*\*/g, '') : '';
            const firstParaClean = firstParaLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            const firstParaHtml = firstParaLine
              ? `<p style="text-align:justify;margin:0 0 10px;color:#334155;line-height:1.9;font-family:${fontFamily},Georgia,serif;font-size:${fontSize}px;text-indent:0;">${firstParaClean}</p>`
              : '';
            // Emite título + §1º no mesmo div page-break-inside:avoid
            html += `<div style="page-break-inside:avoid;">${titleHtml}${firstParaHtml}</div>`;
            if (firstParaLine) i++;
          } else {
            html += titleHtml;
            i++;
          }
          continue;
        }

        // ── 4. Parágrafo § ────────────────────────────────────────
        if (/^§\d+[º°]?\s/.test(stripped)) {
          const clean = stripped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          html += `<p style="text-align:justify;margin:0 0 10px;`
               + `color:#334155;line-height:1.9;`
               + `font-family:${fontFamily},Georgia,serif;font-size:${fontSize}px;`
               + `text-indent:0;page-break-inside:avoid;">${clean}</p>`;
          i++; continue;
        }

        // ── 5. Linha de assinatura (___) ──────────────────────────
        if (/^_{3,}/.test(stripped)) {
          closeClauseBlock();
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
          const colW = Math.floor(100 / Math.max(sigs.length, 1));
          html += `<div style="display:table;width:100%;margin-top:40px;page-break-inside:avoid;">`;
          sigs.forEach(label => {
            html += `<div style="display:table-cell;width:${colW}%;text-align:center;`
                  + `padding:0 20px;vertical-align:bottom;">`
                  + `<div style="border-top:1px solid #6b7280;padding-top:8px;margin-top:56px;">`
                  + `<p style="font-size:${fontSize - 1}px;color:#1f2937;`
                  + `font-family:${fontFamily},serif;margin:0;font-weight:500;">${label}</p>`
                  + `</div></div>`;
          });
          html += `</div>`;
          i = j; continue;
        }

        // ── Filtros: linhas de role de assinatura e testemunhas ───
        if (/^[A-ZÀ-Úa-záéíóúâêîôûãõç][a-zA-ZÀ-ú\s]+\s*[-–]\s*(VENDEDOR|COMPRADOR|CONTRATANTE|CONTRATADO|LOCADOR|LOCAT|FREELANCER|PARTE [AB])$/i.test(stripped)) { i++; continue; }
        if (/testemunha|witness/i.test(stripped)) { i++; continue; }

        // ── 5. Parágrafo comum (texto corrido) ────────────────────
        const clean = stripped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html += `<p style="text-align:justify;margin:0 0 10px;`
             + `color:#334155;line-height:1.9;`
             + `font-family:${fontFamily},Georgia,serif;font-size:${fontSize}px;">${clean}</p>`;
        i++;
      }

      closeClauseBlock(); // garante que o último bloco seja fechado
      return html;
    };

    // ----------------------------------------------------------
    // Bloco de assinaturas extraído dos signerNames
    // ----------------------------------------------------------
    const signerNames = (typeof generatedContract === 'object' && generatedContract?.signerNames)
      ? generatedContract.signerNames
      : [];

    const sigBlockHtml = signerNames.length > 0 ? `
      <div style="margin-top:48px;page-break-inside:avoid;page-break-before:avoid;">
        <div style="border-top:2px solid #e5e7eb;padding-top:32px;margin-bottom:8px;"></div>
        <div style="display:flex;gap:48px;justify-content:flex-start;">
          ${signerNames.map(name => `
            <div style="flex:1;max-width:260px;text-align:center;">
              <div style="border-top:1px solid #6b7280;padding-top:8px;margin-top:48px;">
                <p style="font-size:${fontSize - 1}px;color:#1e293b;`
              + `font-family:'Inter',${fontFamily},sans-serif;margin:0;font-weight:600;">${name}</p>
              </div>
            </div>`).join('')}
        </div>
      </div>` : '';

    // ----------------------------------------------------------
    // HTML decorativo (logo, empresa, marca d'água)
    // ----------------------------------------------------------
    const logoHtml = logoSrc
      ? `<div style="text-align:center;margin-bottom:24px;">`
      + `<img src="${logoSrc}" style="max-height:80px;max-width:240px;object-fit:contain;" /></div>`
      : '';

    const companyHtml = companyName
      ? `<p style="text-align:center;font-size:11px;color:#6b7280;`
      + `margin-bottom:24px;font-family:${fontFamily},serif;">${companyName}</p>`
      : '';

    const watermarkHtml = watermark && companyName
      ? `<div style="position:fixed;top:50%;left:50%;`
      + `transform:translate(-50%,-50%) rotate(-35deg);`
      + `font-size:72px;color:rgba(0,0,0,0.04);`
      + `font-family:${fontFamily},serif;pointer-events:none;`
      + `white-space:nowrap;z-index:0;">${companyName}</div>`
      : '';

    // ----------------------------------------------------------
    // Monta o wrapper e injeta o conteúdo
    // ----------------------------------------------------------
    const wrapper = document.createElement('div');
    // Injeta Google Fonts para Lora + Inter
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap';
    wrapper.appendChild(fontLink);
    wrapper.style.cssText = `padding:48px 56px 56px;background:white;`
      + `font-family:'Inter',${fontFamily},sans-serif;max-width:800px;`
      + `position:relative;font-size:${fontSize}px;line-height:1.8;`;

    let formattedContent = formatText(contractText);

    // Appenda bloco de assinaturas após o último parágrafo
    if (sigBlockHtml) {
      const lastPara = formattedContent.lastIndexOf('</p>');
      if (lastPara !== -1) {
        formattedContent = formattedContent.slice(0, lastPara + 4) + sigBlockHtml;
      } else {
        formattedContent += sigBlockHtml;
      }
    }

    wrapper.innerHTML = watermarkHtml + logoHtml + companyHtml + formattedContent;

    // ----------------------------------------------------------
    // Carrega html2pdf e gera o arquivo
    // ----------------------------------------------------------
    const loadScript = (src) => new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js')
      .then(() => {
        // Largura A4 menos margens de 15mm de cada lado
        const a4WidthPx = Math.floor((210 - 30) * 96 / 25.4);
        wrapper.style.width = a4WidthPx + 'px';
        wrapper.style.maxWidth = a4WidthPx + 'px';
        window.html2pdf().set({
          margin: [15, 15, 15, 15],
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, scrollY: 0, logging: false, width: a4WidthPx },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: 'css' },
        }).from(wrapper).save();
      })
      .catch(() => {
        // Fallback: baixa como .txt se html2pdf falhar
        const blob = new Blob([contractText.replace(/\*\*/g, '')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.replace('.pdf', '.txt');
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      });
  };

  // ============================================================
  // RENDER
  // ============================================================
  const isDesktop = windowWidth >= 1024;

  return (
    <div style={{ height: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#080d14' }}>
      {isDesktop && <ProgressSidebar currentStep={currentStep} contractType={selectedContract} plan={plan} />}

      <main style={{ flex: 1, marginLeft: isDesktop ? '260px' : 0, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

        {/* ── PASSO 1: Seleção de tipo ── */}
        {currentStep === 1 && (
          <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', backgroundImage: `linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)`, backgroundSize: '50px 50px' }}>
            <ChatUserAvatar showInChat={false} />
            <ContractTypeSelector onSelect={handleSelectContract} />
          </div>
        )}

        {/* ── PERSONALIZAÇÃO (plano premium pós-pagamento) ── */}
        {showPersonalization && (
          <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: '#080d14' }}>
            <PersonalizationScreen
              onComplete={handlePersonalizationComplete}
              onSkip={handlePersonalizationSkip}
            />
          </div>
        )}

        {/* ── PASSO 2+: Chat ── */}
        {currentStep >= 2 && selectedContract && !showPersonalization && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0a1018' }}>

            {/* Header do chat */}
            <div style={{ backgroundColor: 'rgba(8,13,20,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(12px)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <selectedContract.icon size={14} color="rgba(255,255,255,0.5)" />
              </div>
              <span style={{ fontWeight: '600', color: 'white', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedContract.name}</span>
              <div style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px',
                padding: '3px 10px', borderRadius: '9999px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {plan === 'premium' ? '✦ Com Marca' : 'Padrão'}
                </span>
              </div>
            </div>

            {/* Mensagens */}
            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px 8px 8px' }}>
              <div style={{ maxWidth: '672px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <MessageBubble key={`msg-${i}`} message={msg.text} isBot={msg.isBot} isGenerating={msg.isGenerating}
                      isPdfCard={msg.isPdfCard} contractType={selectedContract} isPaid={isPaid}
                      onOpenPayment={() => setShowPaymentModal(true)} onDownload={handleDownload} plan={plan}
                      isAnimationDone={completedMessages.has(i)}
                      onAnimationComplete={() => setCompletedMessages(prev => new Set([...prev, i]))}
                      generationProgress={msg.isGenerating ? generationProgress : null}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div style={{ flexShrink: 0, position: 'sticky', bottom: 0, zIndex: 10 }}>
              <ChatInput ref={inputRef} value={inputValue} onChange={setInputValue} onSend={handleSendMessage} disabled={isTyping || isGenerating} />
            </div>
          </div>
        )}
      </main>

      {/* Modal de pagamento */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentConfirmed={handlePaymentConfirmed}
        contractType={selectedContract}
        price={price}
      />
    </div>
  );
};

export default Chat;