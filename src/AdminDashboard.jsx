import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./config/AuthContext";
import { supabase } from "./config/supabase";

const ADMIN_EMAIL = "santosherenio76@gmail.com";

const CONTRACT_NAMES = {
  'prestacao-servicos': 'Prestação de Serviços',
  'aluguel': 'Aluguel',
  'parceria': 'Parceria',
  'confidencialidade': 'Confidencialidade',
  'trabalho-freelancer': 'Freelancer',
  'compra-venda': 'Compra e Venda',
  'empreitada': 'Empreitada',
  'sociedade': 'Sociedade',
  'representacao-comercial': 'Representação Comercial',
  'comodato': 'Comodato',
};

const fmtCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const fmtNum = (n) => new Intl.NumberFormat('pt-BR').format(n || 0);
const CHART_COLORS = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ec4899','#8b5cf6','#14b8a6','#f97316','#3b82f6','#84cc16'];

const thisMonth = () => {
  const t = new Date();
  const f = new Date(t.getFullYear(), t.getMonth(), 1);
  return { today: t.toISOString().split('T')[0], first: f.toISOString().split('T')[0] };
};

const greeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Bom dia';
  if (h >= 12 && h < 18) return 'Boa tarde';
  return 'Boa noite';
};

const lsGet = (key, fallback = '') => {
  try { const v = localStorage.getItem(key); return v !== null ? v : fallback; } catch { return fallback; }
};
const lsSet = (key, val) => { try { localStorage.setItem(key, val); } catch {} };

const Ic = ({ d, size = 16, color = 'currentColor', sw = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const I = {
  grid:    ['M3 3h7v7H3z','M14 3h7v7h-7z','M14 14h7v7h-7z','M3 14h7v7H3z'],
  file:    ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z','M14 2v6h6','M16 13H8','M16 17H8','M10 9H8'],
  card:    ['M1 4h22v16H1z','M1 10h22'],
  users:   ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M23 21v-2a4 4 0 00-3-3.87','M16 3.13a4 4 0 010 7.75','M9 11a4 4 0 100-8 4 4 0 000 8z'],
  bolt:    ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  moon:    ['M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z'],
  sun:     ['M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42','M12 17a5 5 0 100-10 5 5 0 000 10z'],
  left:    ['M15 18l-6-6 6-6'],
  refresh: ['M23 4v6h-6','M1 20v-6h6','M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15'],
  search:  ['M11 19a8 8 0 100-16 8 8 0 000 16z','M21 21l-4.35-4.35'],
  menu:    ['M3 12h18','M3 6h18','M3 18h18'],
  x:       ['M18 6L6 18','M6 6l12 12'],
  dollar:  ['M12 1v22','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'],
  trend:   ['M23 6l-9.5 9.5-5-5L1 18'],
  user:    ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2','M12 11a4 4 0 100-8 4 4 0 000 8z'],
  check:   ['M20 6L9 17l-5-5'],
  star:    ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  eye:     ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 100 6 3 3 0 000-6z'],
  eyeOff:  ['M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24','M1 1l22 22'],
  calendar:['M1 4h22v16H1z','M16 2v4','M8 2v4','M1 10h22'],
};

const DateFilter = ({ from, to, onFrom, onTo, onClear, th }) => (
  <div style={{ marginBottom:24, background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:'12px 16px' }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <Ic d={I.calendar} size={13} color={th.muted} />
        <span style={{ fontSize:11, color:th.muted, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>Período</span>
      </div>
      {(from||to) && (
        <button onClick={onClear}
          style={{ padding:'4px 12px', borderRadius:7, border:`1px solid ${th.border}`, background:'transparent', color:th.muted, fontSize:12, cursor:'pointer' }}>
          Limpar
        </button>
      )}
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        <span style={{ fontSize:11, color:th.muted, fontWeight:500 }}>De</span>
        <input type="date" value={from} onChange={e=>onFrom(e.target.value)}
          style={{ width:'100%', padding:'7px 10px', borderRadius:7, border:`1px solid ${th.border}`, background:th.input, color:th.text, fontSize:13, cursor:'pointer' }} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        <span style={{ fontSize:11, color:th.muted, fontWeight:500 }}>Até</span>
        <input type="date" value={to} onChange={e=>onTo(e.target.value)}
          style={{ width:'100%', padding:'7px 10px', borderRadius:7, border:`1px solid ${th.border}`, background:th.input, color:th.text, fontSize:13, cursor:'pointer' }} />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const revRef = useRef(null); const revInst = useRef(null);
  const barRef = useRef(null); const barInst = useRef(null);
  const pieRef = useRef(null); const pieInst = useRef(null);

  const [contracts, setContracts] = useState([]);
  const [payments,  setPayments]  = useState([]);
  const [users,     setUsers]     = useState([]);
  const [loading2,  setLoading2]  = useState(true);
  const [section,   setSection]   = useState('overview');
  const [sideOpen,  setSideOpen]  = useState(false);
  const [dark,      _setDark]     = useState(() => lsGet('adm_dark','false') === 'true');
  const setDark = v => { _setDark(v); lsSet('adm_dark', String(v)); };
  const [chartRdy,  setChartRdy]  = useState(false);
  const [search,    setSearch]    = useState('');
  const [hidden,    setHidden]    = useState(false);

  const { today, first } = thisMonth();
  const [oF, _setOF] = useState(() => lsGet('adm_oF', first));
  const [oT, _setOT] = useState(() => lsGet('adm_oT', today));
  const [cF, _setCF] = useState(() => lsGet('adm_cF', first));
  const [cT, _setCT] = useState(() => lsGet('adm_cT', today));
  const [pF, _setPF] = useState(() => lsGet('adm_pF', first));
  const [pT, _setPT] = useState(() => lsGet('adm_pT', today));
  const [uF, _setUF] = useState(() => lsGet('adm_uF', ''));
  const [uT, _setUT] = useState(() => lsGet('adm_uT', ''));

  const setOF = v => { _setOF(v); lsSet('adm_oF', v); };
  const setOT = v => { _setOT(v); lsSet('adm_oT', v); };
  const setCF = v => { _setCF(v); lsSet('adm_cF', v); };
  const setCT = v => { _setCT(v); lsSet('adm_cT', v); };
  const setPF = v => { _setPF(v); lsSet('adm_pF', v); };
  const setPT = v => { _setPT(v); lsSet('adm_pT', v); };
  const setUF = v => { _setUF(v); lsSet('adm_uF', v); };
  const setUT = v => { _setUT(v); lsSet('adm_uT', v); };

  const th = {
    bg:      dark ? '#0d1117' : '#f4f4f5',
    sidebar: dark ? '#010409' : '#ffffff',
    card:    dark ? '#161b22' : '#ffffff',
    border:  dark ? '#21262d' : '#e4e4e7',
    sub:     dark ? '#1c2128' : '#f1f1f2',
    text:    dark ? '#e6edf3' : '#18181b',
    mid:     dark ? '#8b949e' : '#52525b',
    muted:   dark ? '#484f58' : '#a1a1aa',
    row:     dark ? '#0d1117' : '#fafafa',
    rowAlt:  dark ? '#161b22' : '#ffffff',
    input:   dark ? '#0d1117' : '#f4f4f5',
    accent:  dark ? '#2f81f7' : '#18181b',
    accentBg:dark ? 'rgba(47,129,247,0.1)' : 'rgba(24,24,27,0.06)',
    green:   dark ? '#3fb950' : '#16a34a',
    greenBg: dark ? 'rgba(63,185,80,0.1)' : 'rgba(22,163,74,0.08)',
  };

  const mask    = v => hidden ? '••••••' : v;
  const maskNum = v => hidden ? '••••'   : v;

  useEffect(()=>{ if(!loading && (!user || user.email !== ADMIN_EMAIL)) navigate('/'); },[user,loading,navigate]);

  const load = async () => {
    setLoading2(true);
    try {
      const [{ data:c },{ data:p },{ data:u }] = await Promise.all([
        supabase.from('contracts').select('*').order('created_at',{ ascending:false }),
        supabase.from('payments').select('*').order('paid_at',{ ascending:false }),
        supabase.from('user_profiles').select('*').order('total_contracts',{ ascending:false }),
      ]);
      setContracts(c||[]); setPayments(p||[]); setUsers(u||[]);
    } catch(e) { console.error(e); }
    finally { setLoading2(false); }
  };
  useEffect(()=>{ if(user?.email === ADMIN_EMAIL) load(); },[user]);

  useEffect(()=>{
    if(window.Chart){ setChartRdy(true); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    s.onload = () => setChartRdy(true);
    document.head.appendChild(s);
  },[]);

  const inRange = (str, f, t) => {
    if(!f && !t) return true;
    const d = new Date(str);
    if(f && d < new Date(f+'T00:00:00')) return false;
    if(t && d > new Date(t+'T23:59:59')) return false;
    return true;
  };

  const fOC = contracts.filter(c => inRange(c.created_at, oF, oT));
  const fOP = payments.filter(p  => inRange(p.paid_at,    oF, oT));
  const fC  = contracts.filter(c => inRange(c.created_at, cF, cT));
  const fP  = payments.filter(p  => inRange(p.paid_at,    pF, pT));

  const totalC = fOC.length;
  const paidC  = fOC.filter(c => c.is_paid).length;
  const totalR = fOP.reduce((s,p) => s + Number(p.amount||0), 0);
  const conv   = totalC > 0 ? ((paidC/totalC)*100).toFixed(1) : 0;
  const avgT   = paidC  > 0 ? totalR/paidC : 0;
  const uniqU  = new Set(fOC.map(c => c.user_id)).size;

  // Gera todos os dias do período (máx 60), preenchendo zeros onde não há dados
  const buildDailyRange = (fromStr, toStr, maxDays = 60) => {
    const start = fromStr ? new Date(fromStr + 'T00:00:00') : new Date(Date.now() - 29*86400000);
    const end   = toStr   ? new Date(toStr   + 'T23:59:59') : new Date();
    const days  = [];
    const cur   = new Date(start);
    while (cur <= end && days.length < maxDays) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  };

  const revByDay = (() => {
    const totals = {};
    fOP.forEach(p => {
      const k = new Date(p.paid_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
      totals[k] = (totals[k]||0) + Number(p.amount||0);
    });
    const days   = buildDailyRange(oF, oT);
    const labels = days.map(d => d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}));
    const data   = labels.map(k => Math.round((totals[k]||0)*100)/100);
    return { labels, data };
  })();

  const cByDay = (() => {
    const totals = {};
    fOC.forEach(c => {
      const k = new Date(c.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
      totals[k] = (totals[k]||0) + 1;
    });
    const days   = buildDailyRange(oF, oT);
    const labels = days.map(d => d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}));
    const data   = labels.map(k => totals[k]||0);
    return { labels, data };
  })();

  const byType = (() => {
    const d = {};
    fOC.forEach(c => { const n = CONTRACT_NAMES[c.contract_type]||c.contract_type; d[n]=(d[n]||0)+1; });
    return Object.entries(d).sort((a,b)=>b[1]-a[1]).slice(0,6);
  })();

  const gc = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const tc = th.muted;

  useEffect(()=>{
    if(!chartRdy || section !== 'overview') return;
    const Ch = window.Chart;
    const accentLine = dark ? '#2f81f7' : '#3b82f6';
    const accentFill = dark ? 'rgba(47,129,247,0.07)' : 'rgba(59,130,246,0.06)';
    const barBg   = dark ? 'rgba(47,129,247,0.15)' : 'rgba(59,130,246,0.1)';
    const barBord = dark ? '#2f81f7' : '#93c5fd';
    setTimeout(()=>{
      if(revRef.current){
        if(revInst.current) revInst.current.destroy();
        revInst.current = new Ch(revRef.current,{ type:'line', data:{ labels:revByDay.labels, datasets:[{ data:revByDay.data, borderColor:accentLine, backgroundColor:accentFill, borderWidth:2, fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:accentLine, pointBorderColor:'transparent' }]}, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{ backgroundColor:dark?'#1c2128':'#fff', titleColor:th.text, bodyColor:th.mid, borderColor:th.border, borderWidth:1, callbacks:{ label:ctx=>`R$ ${ctx.parsed.y.toFixed(2)}` } } }, scales:{ x:{ grid:{color:gc}, ticks:{color:tc,font:{size:11}}, border:{display:false} }, y:{ grid:{color:gc}, ticks:{color:tc,font:{size:11},callback:v=>`R$${v}`}, border:{display:false} } } } });
      }
      if(barRef.current){
        if(barInst.current) barInst.current.destroy();
        barInst.current = new Ch(barRef.current,{ type:'line', data:{ labels:cByDay.labels, datasets:[{ data:cByDay.data, borderColor:barBord, backgroundColor:barBg, borderWidth:2, fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:barBord, pointBorderColor:'transparent' }]}, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{ backgroundColor:dark?'#1c2128':'#fff', titleColor:th.text, bodyColor:th.mid, borderColor:th.border, borderWidth:1 } }, scales:{ x:{ grid:{color:gc}, ticks:{color:tc,font:{size:11}}, border:{display:false} }, y:{ grid:{color:gc}, ticks:{color:tc,font:{size:11}}, border:{display:false} } } } });
      }
      if(pieRef.current && byType.length > 0){
        if(pieInst.current) pieInst.current.destroy();
        pieInst.current = new Ch(pieRef.current,{ type:'doughnut', data:{ labels:byType.map(([n])=>n), datasets:[{ data:byType.map(([,v])=>v), backgroundColor:CHART_COLORS.slice(0,byType.length), borderWidth:0, hoverOffset:4 }]}, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, cutout:'70%' } });
      }
    },100);
  },[chartRdy,fOC,fOP,section,dark]);

  if(loading || !user || user.email !== ADMIN_EMAIL) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f4f5' }}>
      <div style={{ width:24, height:24, border:'2px solid #e4e4e7', borderTopColor:'#18181b', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const navItems = [
    { id:'overview',  label:'Visão Geral', icon:I.grid  },
    { id:'contracts', label:'Contratos',   icon:I.file  },
    { id:'payments',  label:'Pagamentos',  icon:I.card  },
    { id:'users',     label:'Usuários',    icon:I.users },
  ];

  const avBg  = ['#e4e4e7','#dbeafe','#fce7f3','#d1fae5','#fef3c7'];
  const avTxt = ['#52525b','#1d4ed8','#be185d','#065f46','#92400e'];
  const initials = (name,email) => name ? name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase() : (email||'--').slice(0,2).toUpperCase();

  const filtUsers = users.filter(u =>
    (!search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase())) &&
    inRange(u.created_at, uF, uT)
  );
  const usersGen  = [...new Map(contracts.filter(c=>inRange(c.created_at,uF,uT)).map(c=>[c.user_id,c.user_email])).entries()]
    .map(([uid,email]) => ({ uid, email, count:contracts.filter(c=>c.user_id===uid&&inRange(c.created_at,uF,uT)).length }));
  const usersPaid = [...new Map(payments.filter(p=>inRange(p.paid_at,uF,uT)).map(p=>[p.user_id,p.user_email])).entries()]
    .map(([uid,email]) => ({ uid, email, count:payments.filter(p=>p.user_id===uid&&inRange(p.paid_at,uF,uT)).length, total:payments.filter(p=>p.user_id===uid&&inRange(p.paid_at,uF,uT)).reduce((s,p)=>s+Number(p.amount||0),0) }));

  const Card = ({ children, style={} }) => (
    <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:12, ...style }}>{children}</div>
  );

  const Badge = ({ children, v='n' }) => {
    const m = {
      n: { bg:th.input, c:th.mid },
      g: { bg:dark?'rgba(63,185,80,0.12)':'#dcfce7', c:dark?'#3fb950':'#16a34a' },
      a: { bg:dark?'rgba(230,155,60,0.12)':'#fef3c7', c:dark?'#e0a040':'#92400e' },
      b: { bg:dark?'rgba(47,129,247,0.12)':'#dbeafe', c:dark?'#2f81f7':'#1d4ed8' },
      p: { bg:dark?'rgba(167,139,250,0.12)':'#ede9fe', c:dark?'#a78bfa':'#6d28d9' },
    };
    const s = m[v] || m.n;
    return <span style={{ fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:6, background:s.bg, color:s.c, whiteSpace:'nowrap', letterSpacing:'0.01em' }}>{children}</span>;
  };

  const TH = ({ ch }) => (
    <th style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600, color:th.muted, textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:`1px solid ${th.border}`, whiteSpace:'nowrap', background:th.card }}>{ch}</th>
  );
  const TD = ({ children, style={} }) => (
    <td style={{ padding:'12px 16px', color:th.mid, fontSize:13, borderBottom:`1px solid ${th.sub}`, ...style }}>{children}</td>
  );

  const SectionHeader = ({ title, count }) => (
    <div style={{ padding:'16px 20px', borderBottom:`1px solid ${th.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <p style={{ fontSize:14, fontWeight:600, color:th.text }}>{title}</p>
      {count != null && <span style={{ fontSize:11, color:th.muted, background:th.input, padding:'3px 10px', borderRadius:20, border:`1px solid ${th.border}` }}>{count}</span>}
    </div>
  );

  const AvatarRow = ({ email, name, right, i }) => {
    const ci = i % avBg.length;
    return (
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:th.input, borderRadius:8, border:`1px solid ${th.border}` }}>
        <div style={{ width:32, height:32, borderRadius:'50%', background:avBg[ci], display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontSize:11, fontWeight:700, color:avTxt[ci] }}>{initials(name, email)}</span>
        </div>
        <p style={{ flex:1, fontSize:12, color:th.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', minWidth:0 }}>{email}</p>
        {right}
      </div>
    );
  };

  const StatCard = ({ label, value, sub, icon }) => (
    <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:12, padding:'18px 20px 16px' }}>
      <div style={{ marginBottom:14 }}>
        <div style={{ width:32, height:32, borderRadius:8, background:th.input, border:`1px solid ${th.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Ic d={icon} size={15} color={th.mid} sw={1.5} />
        </div>
      </div>
      <p style={{ fontSize:20, fontWeight:600, color:th.text, letterSpacing:'-0.02em', lineHeight:1, marginBottom:6 }}>
        {hidden ? <span style={{ letterSpacing:3, fontSize:14, color:th.muted }}>••••••</span> : value}
      </p>
      <p style={{ fontSize:12, color:th.text, fontWeight:500, marginBottom:3 }}>{label}</p>
      <p style={{ fontSize:11, color:th.muted }}>{sub}</p>
    </div>
  );

  const nav = id => { setSection(id); setSideOpen(false); };
  const clearTo = (setF, setT) => { const {today,first} = thisMonth(); setF(first); setT(today); };

  const activeColor = dark ? '#2f81f7' : '#18181b';
  const activeBg    = dark ? 'rgba(47,129,247,0.1)' : 'rgba(24,24,27,0.06)';

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:th.bg, fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,sans-serif' }}>
      <style>{`
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        * { box-sizing:border-box; margin:0; padding:0 }
        ::-webkit-scrollbar { width:4px; height:4px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:${th.border}; border-radius:4px }
        button, input { font-family:inherit; outline:none }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity:.5; cursor:pointer; filter:${dark?'invert(1)':''} }
        @media(max-width:768px){
          .hide-mobile { display:none!important }
          .mobile-full { width:100%!important; margin-left:0!important }
          .g2  { grid-template-columns:1fr!important }
          .g3  { grid-template-columns:1fr 1fr!important }
          .g5  { grid-template-columns:1fr 1fr!important }
          .gpie{ grid-template-columns:1fr!important }
        }
        .show-mob { display:flex }
        @media(min-width:769px){
          .show-mob { display:none!important }
          aside { transform:none!important }
        }
        @media(max-width:768px){
          aside { transform:translateX(-100%) }
        }
      `}</style>

      {/* Overlay mobile */}
      {sideOpen && <div onClick={()=>setSideOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:40, backdropFilter:'blur(3px)' }} />}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width:220, flexShrink:0, background:th.sidebar, borderRight:`1px solid ${th.border}`,
        display:'flex', flexDirection:'column', position:'fixed', top:0, bottom:0, left:0, zIndex:50,
        transition:'transform 0.22s cubic-bezier(0.4,0,0.2,1)',
        transform: sideOpen ? 'translateX(0)' : undefined,
      }}>

        {/* Logo */}
        <div style={{ padding:'20px 18px 16px', borderBottom:`1px solid ${th.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:dark?'#1c2128':'#18181b', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Ic d={I.bolt} size={15} color="#ffffff" sw={1.8} />
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:th.text, letterSpacing:'-0.02em' }}>Contratify</p>
              <p style={{ fontSize:11, color:th.muted, marginTop:1 }}>Painel Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding:'12px 10px', flex:1, overflowY:'auto' }}>
          <p style={{ fontSize:10, fontWeight:700, color:th.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6, padding:'0 8px' }}>Menu</p>
          {navItems.map(item => (
            <button key={item.id} onClick={()=>nav(item.id)} style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 12px', borderRadius:9, border:'none', textAlign:'left', marginBottom:2, fontSize:13, background:section===item.id ? activeBg : 'transparent', color:section===item.id ? activeColor : th.mid, fontWeight:section===item.id ? 600 : 400, cursor:'pointer', transition:'all 0.12s' }}>
              <Ic d={item.icon} size={15} color={section===item.id ? activeColor : th.muted} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div style={{ padding:'10px 10px 16px', borderTop:`1px solid ${th.border}` }}>
          <button onClick={()=>setDark(!dark)} style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'8px 12px', borderRadius:9, border:'none', background:'transparent', color:th.mid, fontSize:12, cursor:'pointer', marginBottom:2 }}>
            <Ic d={dark?I.sun:I.moon} size={14} color={th.muted} />
            {dark ? 'Modo claro' : 'Modo escuro'}
          </button>
          <button onClick={()=>navigate('/')} style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'8px 12px', borderRadius:9, border:'none', background:'transparent', color:th.mid, fontSize:12, cursor:'pointer' }}>
            <Ic d={I.left} size={14} color={th.muted} />
            Voltar ao site
          </button>
        </div>
      </aside>

      {/* ── CONTENT ── */}
      <div style={{ flex:1, marginLeft:220, display:'flex', flexDirection:'column', minHeight:'100vh' }} className="mobile-full">

        {/* Topbar */}
        <header style={{ position:'sticky', top:0, zIndex:30, background:th.sidebar, borderBottom:`1px solid ${th.border}`, padding:'0 28px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', backdropFilter:'blur(10px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={()=>setSideOpen(!sideOpen)} style={{ width:34, height:34, border:`1px solid ${th.border}`, borderRadius:8, background:th.input, alignItems:'center', justifyContent:'center', cursor:'pointer' }} className="show-mob">
              <Ic d={sideOpen?I.x:I.menu} size={16} color={th.mid} />
            </button>
            <div>
              <p style={{ fontSize:15, fontWeight:600, color:th.text, letterSpacing:'-0.01em' }}>
                {navItems.find(n=>n.id===section)?.label}
              </p>
              <p style={{ fontSize:11, color:loading2?th.muted:th.green, marginTop:1 }}>
                {loading2 ? 'Carregando...' : '● Dados em tempo real'}
              </p>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={()=>setHidden(!hidden)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'6px 14px', borderRadius:8, border:`1px solid ${th.border}`, background:hidden?th.accentBg:th.input, color:hidden?th.accent:th.mid, fontSize:12, fontWeight:500, cursor:'pointer', transition:'all 0.15s' }}>
              <Ic d={hidden?I.eyeOff:I.eye} size={13} color={hidden?th.accent:th.muted} />
              <span className="hide-mobile">{hidden?'Mostrar':'Ocultar'}</span>
            </button>
            <button onClick={load}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'6px 14px', borderRadius:8, border:`1px solid ${th.border}`, background:th.input, color:th.mid, fontSize:12, fontWeight:500, cursor:'pointer' }}>
              <span style={{ animation:loading2?'spin 0.7s linear infinite':'none', display:'inline-block' }}>
                <Ic d={I.refresh} size={13} color={th.muted} />
              </span>
              <span className="hide-mobile">Atualizar</span>
            </button>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main style={{ flex:1, padding:'28px 32px', overflowX:'hidden' }}>

          {/* ── OVERVIEW ── */}
          {section==='overview' && (<>

            {/* Greeting */}
            <div style={{ marginBottom:12, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
              <div>
                <p style={{ fontSize:22, fontWeight:700, color:th.text, letterSpacing:'-0.02em' }}>
                  {greeting()}, Daniel Herênio!
                </p>
                <p style={{ fontSize:13, color:th.muted, marginTop:4 }}>
                  {new Date().toLocaleDateString('pt-BR',{ weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                </p>
              </div>
            </div>

            <DateFilter from={oF} to={oT} onFrom={setOF} onTo={setOT} onClear={()=>clearTo(setOF,setOT)} th={th} />

            {/* KPI cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:20 }} className="g5">
              <StatCard label="Contratos gerados" value={fmtNum(totalC)}               sub={`${conv}% convertidos`}                      icon={I.file}  />
              <StatCard label="Contratos pagos"   value={fmtNum(paidC)}                sub={`de ${fmtNum(totalC)} gerados`}               icon={I.check} />
              <StatCard label="Faturamento"        value={mask(fmtCurrency(totalR))}   sub={`Ticket médio ${mask(fmtCurrency(avgT))}`}    icon={I.dollar}/>
              <StatCard label="Usuários únicos"   value={maskNum(fmtNum(uniqU))}       sub="com contratos no período"                     icon={I.user}  />
              <StatCard label="Plano premium"     value={maskNum(fmtNum(fOC.filter(c=>c.plan==='premium').length))} sub={`Padrão: ${maskNum(fmtNum(fOC.filter(c=>c.plan!=='premium').length))}`} icon={I.star} />
            </div>

            {/* Charts row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }} className="g2">
              <Card style={{ padding:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600, color:th.text }}>Faturamento por dia</p>
                    <p style={{ fontSize:11, color:th.muted, marginTop:2 }}>Últimos 14 dias com receita</p>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:th.text }}>{mask(fmtCurrency(totalR))}</span>
                </div>
                <div style={{ height:180 }}><canvas ref={revRef} /></div>
              </Card>
              <Card style={{ padding:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600, color:th.text }}>Contratos por dia</p>
                    <p style={{ fontSize:11, color:th.muted, marginTop:2 }}>Últimos 14 dias com geração</p>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:th.text }}>{fmtNum(totalC)} total</span>
                </div>
                <div style={{ height:180 }}><canvas ref={barRef} /></div>
              </Card>
            </div>

            {/* Bottom row: pie + resumo */}
            <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:12 }} className="gpie">
              <Card style={{ padding:20 }}>
                <p style={{ fontSize:13, fontWeight:600, color:th.text, marginBottom:16 }}>Tipos de contrato</p>
                {byType.length > 0 ? (<>
                  <div style={{ height:150, marginBottom:16 }}><canvas ref={pieRef} /></div>
                  <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                    {byType.map(([name,count],i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:8, height:8, borderRadius:2, background:CHART_COLORS[i], flexShrink:0 }} />
                          <span style={{ fontSize:12, color:th.mid }}>{name}</span>
                        </div>
                        <span style={{ fontSize:12, color:th.muted, fontWeight:500 }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </>) : (
                  <div style={{ height:150, display:'flex', alignItems:'center', justifyContent:'center', color:th.muted, fontSize:12 }}>Sem dados no período</div>
                )}
              </Card>

              <Card style={{ padding:20 }}>
                <p style={{ fontSize:13, fontWeight:600, color:th.text, marginBottom:16 }}>Resumo financeiro</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }} className="g3">
                  {[
                    { label:'Receita total',      value:mask(fmtCurrency(totalR)) },
                    { label:'Ticket médio',        value:mask(fmtCurrency(avgT)) },
                    { label:'Taxa de conversão',   value:`${conv}%` },
                    { label:'Contratos pendentes', value:maskNum(fmtNum(totalC-paidC)) },
                    { label:'Receita premium',     value:mask(fmtCurrency(fOP.filter(p=>p.plan==='premium').reduce((s,p)=>s+Number(p.amount||0),0))) },
                    { label:'Receita padrão',      value:mask(fmtCurrency(fOP.filter(p=>p.plan!=='premium').reduce((s,p)=>s+Number(p.amount||0),0))) },
                  ].map((item,i) => (
                    <div key={i} style={{ background:th.input, borderRadius:10, padding:'14px 16px', border:`1px solid ${th.border}` }}>
                      <p style={{ fontSize:11, color:th.muted, marginBottom:8, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.04em' }}>{item.label}</p>
                      <p style={{ fontSize:16, fontWeight:600, color:th.text, letterSpacing:'-0.02em' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>)}

          {/* ── CONTRACTS ── */}
          {section==='contracts' && (<>
            <DateFilter from={cF} to={cT} onFrom={setCF} onTo={setCT} onClear={()=>clearTo(setCF,setCT)} th={th} />
            <Card>
              <SectionHeader title="Contratos" count={`${fC.length} registros`} />
              {fC.length === 0
                ? <div style={{ padding:60, textAlign:'center', color:th.muted, fontSize:13 }}>Nenhum contrato no período</div>
                : <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                      <thead><tr><TH ch="Email" /><TH ch="Tipo" /><TH ch="Plano" /><TH ch="Status" /><TH ch="Valor" /><TH ch="Data" /></tr></thead>
                      <tbody>
                        {fC.map((c,i) => (
                          <tr key={c.id} style={{ background:i%2===0?th.rowAlt:th.row }}>
                            <TD style={{ color:th.text, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.user_email}</TD>
                            <TD style={{ whiteSpace:'nowrap' }}>{CONTRACT_NAMES[c.contract_type]||c.contract_type}</TD>
                            <td style={{ padding:'12px 16px', borderBottom:`1px solid ${th.sub}` }}><Badge v={c.plan==='premium'?'p':'n'}>{c.plan==='premium'?'Premium':'Padrão'}</Badge></td>
                            <td style={{ padding:'12px 16px', borderBottom:`1px solid ${th.sub}` }}><Badge v={c.is_paid?'g':'a'}>{c.is_paid?'Pago':'Pendente'}</Badge></td>
                            <TD style={{ fontWeight:600 }}>{mask(fmtCurrency(c.amount))}</TD>
                            <TD style={{ color:th.muted, whiteSpace:'nowrap' }}>{new Date(c.created_at).toLocaleDateString('pt-BR')}</TD>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
            </Card>
          </>)}

          {/* ── PAYMENTS ── */}
          {section==='payments' && (<>
            <DateFilter from={pF} to={pT} onFrom={setPF} onTo={setPT} onClear={()=>clearTo(setPF,setPT)} th={th} />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }} className="g3">
              {[
                { label:'Total recebido', value:mask(fmtCurrency(fP.reduce((s,p)=>s+Number(p.amount||0),0))), sub:`${fP.length} transações`, icon:I.dollar },
                { label:'Ticket médio',   value:mask(fmtCurrency(fP.length>0?fP.reduce((s,p)=>s+Number(p.amount||0),0)/fP.length:0)), sub:'por pagamento', icon:I.trend },
                { label:'Transações',     value:maskNum(fmtNum(fP.length)), sub:'no período selecionado', icon:I.card },
              ].map((s,i) => (
                <div key={i} style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:12, padding:'18px 20px 16px' }}>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:th.input, border:`1px solid ${th.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Ic d={s.icon} size={15} color={th.mid} sw={1.5} />
                    </div>
                  </div>
                  <p style={{ fontSize:20, fontWeight:600, color:th.text, letterSpacing:'-0.02em', lineHeight:1, marginBottom:6 }}>{s.value}</p>
                  <p style={{ fontSize:12, color:th.text, fontWeight:500, marginBottom:3 }}>{s.label}</p>
                  <p style={{ fontSize:11, color:th.muted }}>{s.sub}</p>
                </div>
              ))}
            </div>
            <Card>
              <SectionHeader title="Histórico de pagamentos" count={`${fP.length} transações`} />
              {fP.length === 0
                ? <div style={{ padding:60, textAlign:'center', color:th.muted, fontSize:13 }}>Nenhum pagamento no período</div>
                : <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                      <thead><tr><TH ch="Email" /><TH ch="Tipo" /><TH ch="Plano" /><TH ch="Método" /><TH ch="Valor" /><TH ch="Data" /></tr></thead>
                      <tbody>
                        {fP.map((p,i) => (
                          <tr key={p.id} style={{ background:i%2===0?th.rowAlt:th.row }}>
                            <TD style={{ color:th.text, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.user_email}</TD>
                            <TD>{CONTRACT_NAMES[p.contract_type]||p.contract_type}</TD>
                            <td style={{ padding:'12px 16px', borderBottom:`1px solid ${th.sub}` }}><Badge v={p.plan==='premium'?'p':'n'}>{p.plan==='premium'?'Premium':'Padrão'}</Badge></td>
                            <td style={{ padding:'12px 16px', borderBottom:`1px solid ${th.sub}` }}><Badge v="g">PIX</Badge></td>
                            <TD style={{ fontWeight:600 }}>{mask(fmtCurrency(p.amount))}</TD>
                            <TD style={{ color:th.muted, whiteSpace:'nowrap' }}>{new Date(p.paid_at).toLocaleDateString('pt-BR')}</TD>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
            </Card>
          </>)}

          {/* ── USERS ── */}
          {section==='users' && (<>
            <DateFilter from={uF} to={uT} onFrom={setUF} onTo={setUT} onClear={()=>clearTo(setUF,setUT)} th={th} />
            {(uF||uT) && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }} className="g2">
                {[
                  { title:'Geraram contratos', list:usersGen, right:u=><span style={{ fontSize:11, color:th.muted, flexShrink:0 }}>{u.count} contrato{u.count!==1?'s':''}</span>, empty:'Nenhum contrato no período' },
                  { title:'Realizaram pagamentos', list:usersPaid, right:u=><span style={{ fontSize:12, fontWeight:600, color:th.green, flexShrink:0 }}>{mask(fmtCurrency(u.total))}</span>, empty:'Nenhum pagamento no período' },
                ].map((panel,pi) => (
                  <Card key={pi} style={{ overflow:'hidden' }}>
                    <div style={{ padding:'14px 18px', borderBottom:`1px solid ${th.border}` }}>
                      <p style={{ fontSize:13, fontWeight:600, color:th.text }}>{panel.title}</p>
                      <p style={{ fontSize:11, color:th.muted, marginTop:2 }}>{panel.list.length} usuário{panel.list.length!==1?'s':''}</p>
                    </div>
                    {panel.list.length === 0
                      ? <div style={{ padding:28, textAlign:'center', color:th.muted, fontSize:12 }}>{panel.empty}</div>
                      : <div style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap:6, maxHeight:240, overflowY:'auto' }}>
                          {panel.list.map((u,i) => <AvatarRow key={u.uid} email={u.email} i={i} right={panel.right(u)} />)}
                        </div>
                    }
                  </Card>
                ))}
              </div>
            )}
            {!(uF||uT) && (
              <div style={{ padding:'12px 18px', background:th.card, border:`1px solid ${th.border}`, borderRadius:10, marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
                <Ic d={I.calendar} size={14} color={th.muted} />
                <p style={{ fontSize:12, color:th.muted }}>Selecione um período acima para ver os usuários que atuaram nesse intervalo.</p>
              </div>
            )}
            <Card>
              <div style={{ padding:'14px 18px', borderBottom:`1px solid ${th.border}`, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                <p style={{ fontSize:14, fontWeight:600, color:th.text, flexShrink:0 }}>Todos os usuários</p>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:'auto', background:th.input, borderRadius:8, padding:'6px 12px', minWidth:200, flex:1, maxWidth:260, border:`1px solid ${th.border}` }}>
                  <Ic d={I.search} size={13} color={th.muted} />
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar usuário..." style={{ border:'none', background:'transparent', fontSize:12, color:th.text, width:'100%' }} />
                </div>
                <span style={{ fontSize:11, color:th.muted, flexShrink:0, background:th.input, padding:'3px 10px', borderRadius:20, border:`1px solid ${th.border}` }}>{filtUsers.length} usuários</span>
              </div>
              {filtUsers.length === 0
                ? <div style={{ padding:60, textAlign:'center', color:th.muted, fontSize:13 }}>Nenhum usuário encontrado</div>
                : <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                      <thead><tr><TH ch="Usuário" /><TH ch="Email" /><TH ch="Contratos" /><TH ch="Pagos" /><TH ch="Gasto total" /><TH ch="Cadastro" /><TH ch="Último acesso" /></tr></thead>
                      <tbody>
                        {filtUsers.map((u,i) => {
                          const ci = i%avBg.length;
                          return (
                            <tr key={u.id} style={{ background:i%2===0?th.rowAlt:th.row }}>
                              <td style={{ padding:'12px 16px', borderBottom:`1px solid ${th.sub}` }}>
                                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                  <div style={{ width:30, height:30, borderRadius:'50%', background:avBg[ci], display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                    <span style={{ fontSize:10, fontWeight:700, color:avTxt[ci] }}>{initials(u.full_name,u.email)}</span>
                                  </div>
                                  <span style={{ color:th.text, fontWeight:500, fontSize:13, maxWidth:110, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                    {u.full_name||u.email?.split('@')[0]||'—'}
                                  </span>
                                </div>
                              </td>
                              <TD style={{ maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</TD>
                              <td style={{ padding:'12px 16px', borderBottom:`1px solid ${th.sub}` }}><Badge v={Number(u.total_contracts)>0?'b':'n'}>{maskNum(fmtNum(u.total_contracts))}</Badge></td>
                              <td style={{ padding:'12px 16px', borderBottom:`1px solid ${th.sub}` }}><Badge v={Number(u.paid_contracts)>0?'g':'n'}>{maskNum(fmtNum(u.paid_contracts))}</Badge></td>
                              <TD style={{ fontWeight:600 }}>{mask(fmtCurrency(u.total_spent))}</TD>
                              <TD style={{ color:th.muted, whiteSpace:'nowrap' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—'}</TD>
                              <TD style={{ color:th.muted, whiteSpace:'nowrap' }}>{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString('pt-BR') : '—'}</TD>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
              }
            </Card>
          </>)}

        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav style={{ display:'none', position:'fixed', bottom:0, left:0, right:0, background:th.sidebar, borderTop:`1px solid ${th.border}`, zIndex:40, padding:'8px 0', paddingBottom:'calc(8px + env(safe-area-inset-bottom,0px))' }} className="show-mob">
        {navItems.map(item => (
          <button key={item.id} onClick={()=>nav(item.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flex:1, padding:'6px 4px', border:'none', background:'transparent', color:section===item.id?activeColor:th.muted, cursor:'pointer' }}>
            <Ic d={item.icon} size={19} color={section===item.id?activeColor:th.muted} />
            <span style={{ fontSize:9, fontWeight:section===item.id?600:400 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        @media(max-width:768px){
          .hide-mobile { display:none!important }
          .show-mob { display:flex!important }
          main  { padding-bottom:80px!important }
          .g2   { grid-template-columns:1fr!important }
          .g3   { grid-template-columns:1fr 1fr!important }
          .g5   { grid-template-columns:1fr 1fr!important }
          .gpie { grid-template-columns:1fr!important }
        }
        @media(min-width:769px){ .show-mob { display:none!important } }
      `}</style>
    </div>
  );
}