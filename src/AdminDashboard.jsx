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
const CHART_COLORS = ['#94a3b8','#7dd3fc','#86efac','#fca5a5','#c4b5fd','#fdba74','#6ee7b7','#f9a8d4','#a5b4fc','#fde68a'];

const Ic = ({ d, size = 16, color = 'currentColor', sw = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const I = {
  grid:    'M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z',
  file:    ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z','M14 2v6h6'],
  card:    ['M1 4h22v16H1z','M1 10h22'],
  users:   ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M23 21v-2a4 4 0 00-3-3.87','M16 3.13a4 4 0 010 7.75','M9 11a4 4 0 100-8 4 4 0 000 8z'],
  bolt:    'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  moon:    'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  sun:     ['M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42','M12 17a5 5 0 100-10 5 5 0 000 10z'],
  left:    'M15 18l-6-6 6-6',
  refresh: ['M23 4v6h-6','M1 20v-6h6','M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15'],
  search:  ['M11 19a8 8 0 100-16 8 8 0 000 16z','M21 21l-4.35-4.35'],
  menu:    ['M3 12h18','M3 6h18','M3 18h18'],
  x:       ['M18 6L6 18','M6 6l12 12'],
  dollar:  ['M12 1v22','M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'],
  trend:   'M23 6l-9.5 9.5-5-5L1 18',
  user:    ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2','M12 11a4 4 0 100-8 4 4 0 000 8z'],
  check:   'M20 6L9 17l-5-5',
  star:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  eye:     ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 100 6 3 3 0 000-6z'],
  eyeOff:  ['M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24','M1 1l22 22'],
};

const DateFilter = ({ from, to, onFrom, onTo, onClear, th }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18, flexWrap:'wrap' }}>
    <span style={{ fontSize:12, color:th.muted }}>De</span>
    <input type="date" value={from} onChange={e=>onFrom(e.target.value)}
      style={{ padding:'5px 9px', borderRadius:6, border:`1px solid ${th.border}`, background:th.input, color:th.text, fontSize:12 }} />
    <span style={{ fontSize:12, color:th.muted }}>Até</span>
    <input type="date" value={to} onChange={e=>onTo(e.target.value)}
      style={{ padding:'5px 9px', borderRadius:6, border:`1px solid ${th.border}`, background:th.input, color:th.text, fontSize:12 }} />
    {(from||to) && (
      <button onClick={onClear}
        style={{ padding:'5px 10px', borderRadius:6, border:`1px solid ${th.border}`, background:'transparent', color:th.muted, fontSize:12, cursor:'pointer' }}>
        Limpar
      </button>
    )}
  </div>
);

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const revRef  = useRef(null); const revInst  = useRef(null);
  const barRef  = useRef(null); const barInst  = useRef(null);
  const pieRef  = useRef(null); const pieInst  = useRef(null);

  const [contracts, setContracts] = useState([]);
  const [payments,  setPayments]  = useState([]);
  const [users,     setUsers]     = useState([]);
  const [loading2,  setLoading2]  = useState(true);
  const [section,   setSection]   = useState('overview');
  const [sideOpen,  setSideOpen]  = useState(false);
  const [dark,      setDark]      = useState(false);
  const [chartRdy,  setChartRdy]  = useState(false);
  const [search,    setSearch]    = useState('');
  const [hidden,    setHidden]    = useState(false); // ocultar valores

  const [oF,setOF]=useState(''); const [oT,setOT]=useState('');
  const [cF,setCF]=useState(''); const [cT,setCT]=useState('');
  const [pF,setPF]=useState(''); const [pT,setPT]=useState('');
  const [uF,setUF]=useState(''); const [uT,setUT]=useState('');
  const [tF,setTF]=useState(''); const [tT,setTT]=useState('');

  const th = {
    bg:      dark?'#0f1419':'#f6f5f2',
    sidebar: dark?'#0a0e14':'#ffffff',
    card:    dark?'#141c24':'#ffffff',
    border:  dark?'#1e2a36':'#e4e2dc',
    sub:     dark?'#172030':'#eeece6',
    text:    dark?'#dedad2':'#18181a',
    mid:     dark?'#7a7870':'#6a6860',
    muted:   dark?'#3a4450':'#aaa8a0',
    row:     dark?'#111820':'#fafaf8',
    rowAlt:  dark?'#141c24':'#ffffff',
    input:   dark?'#111820':'#f0eeea',
  };

  // Paleta de cores dos cards
  const cardColors = {
    green:  { val: dark?'#4ade80':'#16a34a', bg: dark?'rgba(74,222,128,0.1)':'rgba(22,163,74,0.08)', border: dark?'rgba(74,222,128,0.2)':'rgba(22,163,74,0.15)' },
    blue:   { val: dark?'#60a5fa':'#2563eb', bg: dark?'rgba(96,165,250,0.1)':'rgba(37,99,235,0.07)', border: dark?'rgba(96,165,250,0.2)':'rgba(37,99,235,0.15)' },
    amber:  { val: dark?'#fbbf24':'#d97706', bg: dark?'rgba(251,191,36,0.1)':'rgba(217,119,6,0.07)',  border: dark?'rgba(251,191,36,0.2)':'rgba(217,119,6,0.15)'  },
    purple: { val: dark?'#a78bfa':'#7c3aed', bg: dark?'rgba(167,139,250,0.1)':'rgba(124,58,237,0.07)', border: dark?'rgba(167,139,250,0.2)':'rgba(124,58,237,0.15)' },
    teal:   { val: dark?'#2dd4bf':'#0d9488', bg: dark?'rgba(45,212,191,0.1)':'rgba(13,148,136,0.07)', border: dark?'rgba(45,212,191,0.2)':'rgba(13,148,136,0.15)' },
  };

  const mask = (v) => hidden ? '••••••' : v;
  const maskNum = (v) => hidden ? '••••' : v;

  useEffect(()=>{
    if(!loading && (!user||user.email!==ADMIN_EMAIL)) navigate('/');
  },[user,loading,navigate]);

  const load = async()=>{
    setLoading2(true);
    try{
      const [{ data:c },{ data:p },{ data:u }] = await Promise.all([
        supabase.from('contracts').select('*').order('created_at',{ascending:false}),
        supabase.from('payments').select('*').order('paid_at',{ascending:false}),
        supabase.from('user_profiles').select('*').order('total_contracts',{ascending:false}),
      ]);
      setContracts(c||[]); setPayments(p||[]); setUsers(u||[]);
    }catch(e){ console.error(e); }
    finally{ setLoading2(false); }
  };
  useEffect(()=>{ if(user?.email===ADMIN_EMAIL) load(); },[user]);

  useEffect(()=>{
    if(window.Chart){ setChartRdy(true); return; }
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    s.onload=()=>setChartRdy(true);
    document.head.appendChild(s);
  },[]);

  const inRange=(str,f,t)=>{
    if(!f&&!t) return true;
    const d=new Date(str);
    if(f&&d<new Date(f+'T00:00:00')) return false;
    if(t&&d>new Date(t+'T23:59:59')) return false;
    return true;
  };

  const fOC=contracts.filter(c=>inRange(c.created_at,oF,oT));
  const fOP=payments.filter(p=>inRange(p.paid_at,oF,oT));
  const fC =contracts.filter(c=>inRange(c.created_at,cF,cT));
  const fP =payments.filter(p=>inRange(p.paid_at,pF,pT));
  const fT =contracts.filter(c=>inRange(c.created_at,tF,tT));

  const totalC=fOC.length, paidC=fOC.filter(c=>c.is_paid).length;
  const totalR=fOP.reduce((s,p)=>s+Number(p.amount||0),0);
  const conv=totalC>0?((paidC/totalC)*100).toFixed(1):0;
  const avgT=paidC>0?totalR/paidC:0;
  const uniqU=new Set(fOC.map(c=>c.user_id)).size;

  const revByDay=(()=>{
    const d={};
    fOP.forEach(p=>{ const k=new Date(p.paid_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}); d[k]=(d[k]||0)+Number(p.amount||0); });
    const e=Object.entries(d).slice(-14);
    return { labels:e.map(([k])=>k), data:e.map(([,v])=>Math.round(v*100)/100) };
  })();

  const cByDay=(()=>{
    const d={};
    fOC.forEach(c=>{ const k=new Date(c.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}); d[k]=(d[k]||0)+1; });
    const e=Object.entries(d).slice(-14);
    return { labels:e.map(([k])=>k), data:e.map(([,v])=>v) };
  })();

  const byType=(()=>{
    const d={};
    fOC.forEach(c=>{ const n=CONTRACT_NAMES[c.contract_type]||c.contract_type; d[n]=(d[n]||0)+1; });
    return Object.entries(d).sort((a,b)=>b[1]-a[1]).slice(0,6);
  })();

  const gc=dark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.04)';
  const tc=th.muted;

  useEffect(()=>{
    if(!chartRdy||section!=='overview') return;
    const Ch=window.Chart;
    const ga=dark?'rgba(58,130,100,0.08)':'rgba(30,100,70,0.06)';
    const lc=dark?'#4a9e7a':'#2d6a50';
    const bc=dark?'rgba(80,110,160,0.2)':'rgba(70,100,150,0.1)';
    const bl=dark?'#506090':'#8090b0';
    setTimeout(()=>{
      if(revRef.current){
        if(revInst.current) revInst.current.destroy();
        revInst.current=new Ch(revRef.current,{ type:'line', data:{ labels:revByDay.labels, datasets:[{ data:revByDay.data, borderColor:lc, backgroundColor:ga, borderWidth:1.5, fill:true, tension:0.4, pointRadius:2, pointBackgroundColor:lc }]}, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:ctx=>`R$ ${ctx.parsed.y.toFixed(2)}` } } }, scales:{ x:{ grid:{color:gc}, ticks:{color:tc,font:{size:10}}, border:{display:false} }, y:{ grid:{color:gc}, ticks:{color:tc,font:{size:10},callback:v=>`R$${v}`}, border:{display:false} } } } });
      }
      if(barRef.current){
        if(barInst.current) barInst.current.destroy();
        barInst.current=new Ch(barRef.current,{ type:'bar', data:{ labels:cByDay.labels, datasets:[{ data:cByDay.data, backgroundColor:bc, borderColor:bl, borderWidth:1, borderRadius:3 }]}, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ x:{ grid:{display:false}, ticks:{color:tc,font:{size:10}}, border:{display:false} }, y:{ grid:{color:gc}, ticks:{color:tc,font:{size:10}}, border:{display:false} } } } });
      }
      if(pieRef.current&&byType.length>0){
        if(pieInst.current) pieInst.current.destroy();
        pieInst.current=new Ch(pieRef.current,{ type:'doughnut', data:{ labels:byType.map(([n])=>n), datasets:[{ data:byType.map(([,v])=>v), backgroundColor:CHART_COLORS.slice(0,byType.length), borderWidth:2, borderColor:th.card }]}, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, cutout:'65%' } });
      }
    },100);
  },[chartRdy,fOC,fOP,section,dark]);

  if(loading||!user||user.email!==ADMIN_EMAIL) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f6f5f2' }}>
      <div style={{ width:22, height:22, border:'1.5px solid #ddd', borderTopColor:'#555', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const navItems=[
    { id:'overview',  label:'Visão Geral', icon:I.grid },
    { id:'contracts', label:'Contratos',   icon:I.file },
    { id:'payments',  label:'Pagamentos',  icon:I.card },
    { id:'users',     label:'Usuários',    icon:I.users },
    { id:'tokens',    label:'Tokens',      icon:I.bolt },
  ];

  const avBg  =['#e8e6e0','#dde8f0','#e8dde8','#dde8e0','#e8e0dd'];
  const avTxt =['#5a5850','#3a5a7a','#6a3a6a','#3a6a5a','#6a4a3a'];
  const initials=(name,email)=>name ? name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase() : (email||'--').slice(0,2).toUpperCase();

  const filtUsers=users.filter(u=>
    (!search||u.email?.toLowerCase().includes(search.toLowerCase())||u.full_name?.toLowerCase().includes(search.toLowerCase()))&&
    inRange(u.created_at,uF,uT)
  );

  const usersGen=[...new Map(contracts.filter(c=>inRange(c.created_at,uF,uT)).map(c=>[c.user_id,c.user_email])).entries()]
    .map(([uid,email])=>({ uid, email, count:contracts.filter(c=>c.user_id===uid&&inRange(c.created_at,uF,uT)).length }));

  const usersPaid=[...new Map(payments.filter(p=>inRange(p.paid_at,uF,uT)).map(p=>[p.user_id,p.user_email])).entries()]
    .map(([uid,email])=>({ uid, email,
      count:payments.filter(p=>p.user_id===uid&&inRange(p.paid_at,uF,uT)).length,
      total:payments.filter(p=>p.user_id===uid&&inRange(p.paid_at,uF,uT)).reduce((s,p)=>s+Number(p.amount||0),0),
    }));

  const tokTotal=fT.reduce((s,c)=>s+Number(c.tokens_used||0),0);
  const tokCost=(tokTotal/1_000_000)*0.15*5.1;

  const Card=({children,style={}})=>(
    <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, ...style }}>{children}</div>
  );

  const Badge=({children,v='n'})=>{
    const m={ n:{bg:th.input,c:th.mid}, g:{bg:dark?'#1a2e20':'#e4f0e6',c:dark?'#5aaa7a':'#2a6a3a'}, a:{bg:dark?'#2e2010':'#f0e8d8',c:dark?'#b08040':'#7a5010'}, b:{bg:dark?'#101e30':'#dce8f4',c:dark?'#4a80b0':'#1a4a7a'}, p:{bg:dark?'#1e1030':'#ece8f8',c:dark?'#8060c0':'#4a2a8a'} };
    const s=m[v]||m.n;
    return <span style={{ fontSize:11, fontWeight:500, padding:'2px 7px', borderRadius:5, background:s.bg, color:s.c, whiteSpace:'nowrap' }}>{children}</span>;
  };

  const TH=({ch})=>(
    <th style={{ padding:'8px 13px', textAlign:'left', fontSize:10, fontWeight:600, color:th.muted, textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:`1px solid ${th.border}`, whiteSpace:'nowrap', background:th.row }}>{ch}</th>
  );
  const TD=({children,style={}})=>(
    <td style={{ padding:'10px 13px', color:th.mid, fontSize:13, ...style }}>{children}</td>
  );

  const SectionHeader=({title,count})=>(
    <div style={{ padding:'13px 16px', borderBottom:`1px solid ${th.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <p style={{ fontSize:13, fontWeight:600, color:th.text }}>{title}</p>
      {count!=null&&<span style={{ fontSize:11, color:th.muted, background:th.input, padding:'2px 8px', borderRadius:5 }}>{count}</span>}
    </div>
  );

  const AvatarRow=({email,name,right,i})=>{
    const ci=i%avBg.length;
    return(
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:th.input, borderRadius:7 }}>
        <div style={{ width:30, height:30, borderRadius:'50%', background:avBg[ci], display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontSize:10, fontWeight:700, color:avTxt[ci] }}>{initials(name,email)}</span>
        </div>
        <p style={{ flex:1, fontSize:12, color:th.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', minWidth:0 }}>{email}</p>
        {right}
      </div>
    );
  };

  // Card colorido com ocultar
  const StatCard=({ label, value, sub, color, icon })=>{
    const c = cardColors[color] || cardColors.green;
    return(
      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:c.val, opacity:0.6, borderRadius:'10px 10px 0 0' }} />
        <div style={{ width:26, height:26, borderRadius:6, background:c.bg, border:`1px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
          <Ic d={icon} size={13} color={c.val} />
        </div>
        <p style={{ fontSize:20, fontWeight:700, color:c.val, letterSpacing:'-0.02em', lineHeight:1, marginBottom:4, transition:'color 0.2s' }}>
          {hidden ? <span style={{ letterSpacing:2, fontSize:16 }}>••••••</span> : value}
        </p>
        <p style={{ fontSize:12, color:th.mid, marginBottom:2 }}>{label}</p>
        <p style={{ fontSize:11, color:th.muted }}>{sub}</p>
      </div>
    );
  };

  const nav=(id)=>{ setSection(id); setSideOpen(false); };

  return(
    <div style={{ display:'flex', minHeight:'100vh', background:th.bg, fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <style>{`
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:${th.border};border-radius:3px}
        button,input{font-family:inherit;outline:none}
        input[type="date"]::-webkit-calendar-picker-indicator{opacity:.4;cursor:pointer;filter:${dark?'invert(1)':''}}
        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .mobile-full{width:100%!important}
          .grid-2{grid-template-columns:1fr!important}
          .grid-3{grid-template-columns:1fr!important}
          .grid-5{grid-template-columns:1fr 1fr!important}
          .pie-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {sideOpen&&<div onClick={()=>setSideOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:40, backdropFilter:'blur(2px)' }} />}

      <aside style={{
        width:200, flexShrink:0, background:th.sidebar, borderRight:`1px solid ${th.border}`,
        display:'flex', flexDirection:'column', position:'fixed', top:0, bottom:0, left:0, zIndex:50,
        transform: sideOpen ? 'translateX(0)' : undefined, transition:'transform 0.22s ease',
      }} className={sideOpen?'':'hide-mobile'}>
        <div style={{ padding:'16px 14px', borderBottom:`1px solid ${th.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <div style={{ width:28, height:28, borderRadius:7, background:'#1a3028', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Ic d={I.bolt} size={13} color="#5aaa7a" />
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:th.text, letterSpacing:'-0.01em' }}>Contratify</p>
              <p style={{ fontSize:10, color:th.muted }}>Admin</p>
            </div>
          </div>
          <button onClick={()=>setDark(!dark)} style={{ width:28, height:28, borderRadius:7, border:`1px solid ${th.border}`, background:th.input, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:th.mid }}>
            <Ic d={dark?I.sun:I.moon} size={13} />
          </button>
        </div>

        <nav style={{ padding:'8px 10px', flex:1, overflowY:'auto' }}>
          <p style={{ fontSize:9, fontWeight:700, color:th.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4, padding:'0 4px' }}>Menu</p>
          {navItems.map(item=>(
            <button key={item.id} onClick={()=>nav(item.id)} style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'7px 10px', borderRadius:7, border:'none', textAlign:'left', marginBottom:1, fontSize:13, background:section===item.id?(dark?'rgba(90,170,122,0.1)':'rgba(26,48,40,0.07)'):'transparent', color:section===item.id?(dark?'#5aaa7a':'#1a3028'):th.mid, fontWeight:section===item.id?600:400, cursor:'pointer', transition:'all 0.1s' }}>
              <Ic d={item.icon} size={14} color={section===item.id?(dark?'#5aaa7a':'#1a3028'):th.muted} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding:'8px 10px', borderTop:`1px solid ${th.border}` }}>
          <button onClick={()=>navigate('/')} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 10px', borderRadius:7, border:'none', background:'transparent', color:th.muted, fontSize:12, cursor:'pointer' }}>
            <Ic d={I.left} size={13} color={th.muted} /> Voltar ao site
          </button>
          <button onClick={load} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 10px', borderRadius:7, border:'none', background:'transparent', color:th.muted, fontSize:12, cursor:'pointer', marginTop:1 }}>
            <span style={{ display:'inline-block', animation:loading2?'spin 0.8s linear infinite':'none' }}><Ic d={I.refresh} size={13} color={th.muted} /></span> Atualizar
          </button>
        </div>
      </aside>

      <div style={{ flex:1, marginLeft:200, display:'flex', flexDirection:'column', minHeight:'100vh' }} className="mobile-full">

        {/* Top bar */}
        <header style={{ position:'sticky', top:0, zIndex:30, background:th.sidebar, borderBottom:`1px solid ${th.border}`, padding:'0 20px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', backdropFilter:'blur(8px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={()=>setSideOpen(!sideOpen)} style={{ display:'none', width:32, height:32, border:`1px solid ${th.border}`, borderRadius:7, background:th.input, alignItems:'center', justifyContent:'center', cursor:'pointer' }} className="show-mobile-flex">
              <Ic d={sideOpen?I.x:I.menu} size={15} color={th.mid} />
            </button>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color:th.text, letterSpacing:'-0.01em' }}>
                {navItems.find(n=>n.id===section)?.label}
              </p>
              <p style={{ fontSize:11, color:th.muted }}>{loading2?'Carregando...':'Dados em tempo real'}</p>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {/* Botão ocultar valores */}
            <button onClick={()=>setHidden(!hidden)} title={hidden?'Mostrar valores':'Ocultar valores'}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:7, border:`1px solid ${th.border}`, background:hidden?( dark?'rgba(251,191,36,0.1)':'rgba(217,119,6,0.07)'):th.input, color:hidden?(dark?'#fbbf24':'#d97706'):th.mid, fontSize:12, cursor:'pointer', transition:'all 0.2s' }}>
              <Ic d={hidden?I.eyeOff:I.eye} size={13} color={hidden?(dark?'#fbbf24':'#d97706'):th.mid} />
              <span className="hide-mobile">{hidden?'Mostrar':'Ocultar'}</span>
            </button>
            <button onClick={load} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:7, border:`1px solid ${th.border}`, background:th.input, color:th.mid, fontSize:12, cursor:'pointer' }}>
              <span style={{ animation:loading2?'spin 0.8s linear infinite':'none', display:'inline-block' }}><Ic d={I.refresh} size={12} color={th.mid} /></span>
              <span className="hide-mobile">Atualizar</span>
            </button>
            <button onClick={()=>setDark(!dark)} style={{ width:32, height:32, border:`1px solid ${th.border}`, borderRadius:7, background:th.input, display:'none', alignItems:'center', justifyContent:'center', cursor:'pointer' }} className="show-mobile-flex">
              <Ic d={dark?I.sun:I.moon} size={13} color={th.mid} />
            </button>
          </div>
        </header>

        <main style={{ flex:1, padding:'24px 20px', overflowX:'hidden' }}>

          {/* ── OVERVIEW ── */}
          {section==='overview'&&(<>
            <DateFilter from={oF} to={oT} onFrom={setOF} onTo={setOT} onClear={()=>{setOF('');setOT('');}} th={th} />

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:10, marginBottom:16 }} className="grid-5">
              <StatCard label="Contratos gerados" value={fmtNum(totalC)}      sub={`${conv}% convertidos`}                     color="blue"   icon={I.file}  />
              <StatCard label="Contratos pagos"   value={fmtNum(paidC)}       sub={`de ${fmtNum(totalC)} gerados`}              color="green"  icon={I.check} />
              <StatCard label="Faturamento"       value={mask(fmtCurrency(totalR))} sub={`ticket médio ${mask(fmtCurrency(avgT))}`} color="green"  icon={I.dollar}/>
              <StatCard label="Usuários únicos"   value={maskNum(fmtNum(uniqU))}     sub="com contratos"                          color="teal"   icon={I.user}  />
              <StatCard label="Plano premium"     value={maskNum(fmtNum(fOC.filter(c=>c.plan==='premium').length))} sub={`padrão: ${maskNum(fmtNum(fOC.filter(c=>c.plan!=='premium').length))}`} color="purple" icon={I.star} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }} className="grid-2">
              <Card style={{ padding:16 }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
                  <p style={{ fontSize:13,fontWeight:600,color:th.text }}>Faturamento por dia</p>
                  <span style={{ fontSize:11,color:th.muted }}>{mask(fmtCurrency(totalR))}</span>
                </div>
                <div style={{ height:150 }}><canvas ref={revRef} /></div>
              </Card>
              <Card style={{ padding:16 }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
                  <p style={{ fontSize:13,fontWeight:600,color:th.text }}>Contratos por dia</p>
                  <span style={{ fontSize:11,color:th.muted }}>{fmtNum(totalC)} total</span>
                </div>
                <div style={{ height:150 }}><canvas ref={barRef} /></div>
              </Card>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'250px 1fr', gap:10 }} className="pie-grid">
              <Card style={{ padding:16 }}>
                <p style={{ fontSize:13,fontWeight:600,color:th.text,marginBottom:12 }}>Tipos de contrato</p>
                {byType.length>0?(
                  <>
                    <div style={{ height:130,marginBottom:12 }}><canvas ref={pieRef} /></div>
                    <div style={{ display:'flex',flexDirection:'column',gap:5 }}>
                      {byType.map(([name,count],i)=>(
                        <div key={i} style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                          <div style={{ display:'flex',alignItems:'center',gap:7 }}>
                            <div style={{ width:6,height:6,borderRadius:'50%',background:CHART_COLORS[i],flexShrink:0 }} />
                            <span style={{ fontSize:11,color:th.mid }}>{name}</span>
                          </div>
                          <span style={{ fontSize:11,color:th.muted }}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ):<div style={{ height:130,display:'flex',alignItems:'center',justifyContent:'center',color:th.muted,fontSize:12 }}>Sem dados</div>}
              </Card>

              <Card style={{ padding:16 }}>
                <p style={{ fontSize:13,fontWeight:600,color:th.text,marginBottom:12 }}>Resumo financeiro</p>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
                  {[
                    { label:'Receita total',       value:mask(fmtCurrency(totalR)),        color: cardColors.green.val },
                    { label:'Ticket médio',         value:mask(fmtCurrency(avgT)),          color: cardColors.teal.val },
                    { label:'Taxa de conversão',    value:`${conv}%`,                       color: cardColors.blue.val },
                    { label:'Contratos pendentes',  value:maskNum(fmtNum(totalC-paidC)),    color: cardColors.amber.val },
                    { label:'Receita premium',      value:mask(fmtCurrency(fOP.filter(p=>p.plan==='premium').reduce((s,p)=>s+Number(p.amount||0),0))), color: cardColors.purple.val },
                    { label:'Receita padrão',       value:mask(fmtCurrency(fOP.filter(p=>p.plan!=='premium').reduce((s,p)=>s+Number(p.amount||0),0))), color: cardColors.blue.val },
                  ].map((item,i)=>(
                    <div key={i} style={{ background:th.input,borderRadius:8,padding:12 }}>
                      <p style={{ fontSize:11,color:th.muted,marginBottom:5 }}>{item.label}</p>
                      <p style={{ fontSize:15,fontWeight:700,color:item.color,letterSpacing:'-0.01em' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>)}

          {/* ── CONTRACTS ── */}
          {section==='contracts'&&(<>
            <DateFilter from={cF} to={cT} onFrom={setCF} onTo={setCT} onClear={()=>{setCF('');setCT('');}} th={th} />
            <Card>
              <SectionHeader title="Contratos" count={`${fC.length} registros`} />
              {fC.length===0
                ?<div style={{ padding:48,textAlign:'center',color:th.muted,fontSize:13 }}>Nenhum contrato no período</div>
                :<div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13 }}>
                    <thead><tr><TH ch="Email" /><TH ch="Tipo" /><TH ch="Plano" /><TH ch="Status" /><TH ch="Tokens" /><TH ch="Valor" /><TH ch="Data" /></tr></thead>
                    <tbody>
                      {fC.map((c,i)=>(
                        <tr key={c.id} style={{ borderBottom:`1px solid ${th.sub}`,background:i%2===0?th.rowAlt:th.row }}>
                          <TD style={{ color:th.text,maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.user_email}</TD>
                          <TD style={{ whiteSpace:'nowrap' }}>{CONTRACT_NAMES[c.contract_type]||c.contract_type}</TD>
                          <td style={{ padding:'8px 13px' }}><Badge v={c.plan==='premium'?'p':'n'}>{c.plan==='premium'?'Premium':'Padrão'}</Badge></td>
                          <td style={{ padding:'8px 13px' }}><Badge v={c.is_paid?'g':'a'}>{c.is_paid?'Pago':'Pendente'}</Badge></td>
                          <TD>{fmtNum(c.tokens_used)}</TD>
                          <TD style={{ color:cardColors.green.val,fontWeight:600 }}>{mask(fmtCurrency(c.amount))}</TD>
                          <TD style={{ color:th.muted,whiteSpace:'nowrap' }}>{new Date(c.created_at).toLocaleDateString('pt-BR')}</TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            </Card>
          </>)}

          {/* ── PAYMENTS ── */}
          {section==='payments'&&(<>
            <DateFilter from={pF} to={pT} onFrom={setPF} onTo={setPT} onClear={()=>{setPF('');setPT('');}} th={th} />
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:12 }} className="grid-3">
              {[
                { label:'Total recebido', value:mask(fmtCurrency(fP.reduce((s,p)=>s+Number(p.amount||0),0))), color:'green',  icon:I.dollar },
                { label:'Transações',     value:maskNum(fmtNum(fP.length)),                                    color:'blue',   icon:I.card   },
                { label:'Ticket médio',   value:mask(fmtCurrency(fP.length>0?fP.reduce((s,p)=>s+Number(p.amount||0),0)/fP.length:0)), color:'teal', icon:I.trend },
              ].map((s,i)=>{
                const c=cardColors[s.color];
                return(
                  <div key={i} style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:14, display:'flex', alignItems:'center', gap:12, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:c.val,opacity:0.6,borderRadius:'10px 10px 0 0' }} />
                    <div style={{ width:32,height:32,borderRadius:8,background:c.bg,border:`1px solid ${c.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <Ic d={s.icon} size={14} color={c.val} />
                    </div>
                    <div>
                      <p style={{ fontSize:17,fontWeight:700,color:c.val,letterSpacing:'-0.01em' }}>{s.value}</p>
                      <p style={{ fontSize:11,color:th.muted,marginTop:2 }}>{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Card>
              <SectionHeader title="Histórico de pagamentos" count={`${fP.length} transações`} />
              {fP.length===0
                ?<div style={{ padding:48,textAlign:'center',color:th.muted,fontSize:13 }}>Nenhum pagamento no período</div>
                :<div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13 }}>
                    <thead><tr><TH ch="Email" /><TH ch="Tipo" /><TH ch="Plano" /><TH ch="Método" /><TH ch="Valor" /><TH ch="Data" /></tr></thead>
                    <tbody>
                      {fP.map((p,i)=>(
                        <tr key={p.id} style={{ borderBottom:`1px solid ${th.sub}`,background:i%2===0?th.rowAlt:th.row }}>
                          <TD style={{ color:th.text,maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p.user_email}</TD>
                          <TD>{CONTRACT_NAMES[p.contract_type]||p.contract_type}</TD>
                          <td style={{ padding:'8px 13px' }}><Badge v={p.plan==='premium'?'p':'n'}>{p.plan==='premium'?'Premium':'Padrão'}</Badge></td>
                          <td style={{ padding:'8px 13px' }}><Badge v="g">PIX</Badge></td>
                          <TD style={{ color:cardColors.green.val,fontWeight:600 }}>{mask(fmtCurrency(p.amount))}</TD>
                          <TD style={{ color:th.muted,whiteSpace:'nowrap' }}>{new Date(p.paid_at).toLocaleDateString('pt-BR')}</TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            </Card>
          </>)}

          {/* ── USERS ── */}
          {section==='users'&&(<>
            <DateFilter from={uF} to={uT} onFrom={setUF} onTo={setUT} onClear={()=>{setUF('');setUT('');}} th={th} />
            {(uF||uT)&&(
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14 }} className="grid-2">
                {[
                  { title:'Geraram contratos', list:usersGen, right:(u)=><span style={{ fontSize:11,color:th.muted,flexShrink:0 }}>{u.count} contrato{u.count!==1?'s':''}</span>, empty:'Nenhum contrato no período' },
                  { title:'Realizaram pagamentos', list:usersPaid, right:(u)=><span style={{ fontSize:12,fontWeight:600,color:cardColors.green.val,flexShrink:0 }}>{mask(fmtCurrency(u.total))}</span>, empty:'Nenhum pagamento no período' },
                ].map((panel,pi)=>(
                  <Card key={pi} style={{ overflow:'hidden' }}>
                    <div style={{ padding:'12px 14px',borderBottom:`1px solid ${th.border}` }}>
                      <p style={{ fontSize:13,fontWeight:600,color:th.text }}>{panel.title}</p>
                      <p style={{ fontSize:11,color:th.muted,marginTop:2 }}>{panel.list.length} usuário{panel.list.length!==1?'s':''}</p>
                    </div>
                    {panel.list.length===0
                      ?<div style={{ padding:28,textAlign:'center',color:th.muted,fontSize:12 }}>{panel.empty}</div>
                      :<div style={{ padding:'8px 10px',display:'flex',flexDirection:'column',gap:5,maxHeight:220,overflowY:'auto' }}>
                        {panel.list.map((u,i)=>(
                          <AvatarRow key={u.uid} email={u.email} i={i} right={panel.right(u)} />
                        ))}
                      </div>
                    }
                  </Card>
                ))}
              </div>
            )}
            {!(uF||uT)&&(
              <div style={{ padding:'10px 14px',background:th.input,border:`1px solid ${th.border}`,borderRadius:8,marginBottom:14 }}>
                <p style={{ fontSize:12,color:th.muted }}>Selecione um período acima para ver quais usuários geraram ou pagaram contratos nesse intervalo.</p>
              </div>
            )}
            <Card>
              <div style={{ padding:'12px 14px',borderBottom:`1px solid ${th.border}`,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap' }}>
                <p style={{ fontSize:13,fontWeight:600,color:th.text,flexShrink:0 }}>Todos os usuários</p>
                <div style={{ display:'flex',alignItems:'center',gap:6,marginLeft:'auto',background:th.input,borderRadius:6,padding:'5px 9px',minWidth:180,flex:1,maxWidth:240 }}>
                  <Ic d={I.search} size={12} color={th.muted} />
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{ border:'none',background:'transparent',fontSize:12,color:th.text,width:'100%' }} />
                </div>
                <span style={{ fontSize:11,color:th.muted,flexShrink:0 }}>{filtUsers.length} usuários</span>
              </div>
              {filtUsers.length===0
                ?<div style={{ padding:48,textAlign:'center',color:th.muted,fontSize:13 }}>Nenhum usuário encontrado</div>
                :<div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13 }}>
                    <thead><tr><TH ch="Usuário" /><TH ch="Email" /><TH ch="Contratos" /><TH ch="Pagos" /><TH ch="Gasto total" /><TH ch="Cadastro" /><TH ch="Último acesso" /></tr></thead>
                    <tbody>
                      {filtUsers.map((u,i)=>{
                        const ci=i%avBg.length;
                        return(
                          <tr key={u.id} style={{ borderBottom:`1px solid ${th.sub}`,background:i%2===0?th.rowAlt:th.row }}>
                            <td style={{ padding:'9px 13px' }}>
                              <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                                <div style={{ width:28,height:28,borderRadius:'50%',background:avBg[ci],display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                                  <span style={{ fontSize:10,fontWeight:700,color:avTxt[ci] }}>{initials(u.full_name,u.email)}</span>
                                </div>
                                <span style={{ color:th.text,fontWeight:500,fontSize:13,maxWidth:100,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                                  {u.full_name||u.email?.split('@')[0]||'—'}
                                </span>
                              </div>
                            </td>
                            <TD style={{ maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{u.email}</TD>
                            <td style={{ padding:'8px 13px' }}><Badge v={Number(u.total_contracts)>0?'b':'n'}>{maskNum(fmtNum(u.total_contracts))}</Badge></td>
                            <td style={{ padding:'8px 13px' }}><Badge v={Number(u.paid_contracts)>0?'g':'n'}>{maskNum(fmtNum(u.paid_contracts))}</Badge></td>
                            <TD style={{ color:cardColors.green.val,fontWeight:600 }}>{mask(fmtCurrency(u.total_spent))}</TD>
                            <TD style={{ color:th.muted,whiteSpace:'nowrap' }}>{u.created_at?new Date(u.created_at).toLocaleDateString('pt-BR'):'—'}</TD>
                            <TD style={{ color:th.muted,whiteSpace:'nowrap' }}>{u.last_sign_in_at?new Date(u.last_sign_in_at).toLocaleDateString('pt-BR'):'—'}</TD>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              }
            </Card>
          </>)}

          {/* ── TOKENS ── */}
          {section==='tokens'&&(<>
            <DateFilter from={tF} to={tT} onFrom={setTF} onTo={setTT} onClear={()=>{setTF('');setTT('');}} th={th} />
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:12 }} className="grid-3">
              {[
                { label:'Total de tokens',    value:maskNum(fmtNum(tokTotal)),   sub:'consumidos no período',          color:'blue',   icon:I.bolt   },
                { label:'Custo estimado',     value:mask(fmtCurrency(tokCost)),  sub:'$0.15/1M tokens (gpt-4o-mini)', color:'amber',  icon:I.dollar },
                { label:'Média por contrato', value:maskNum(fmtNum(fT.length>0?Math.round(tokTotal/fT.length):0)), sub:'tokens por geração', color:'teal', icon:I.trend },
              ].map((s,i)=>{
                const c=cardColors[s.color];
                return(
                  <div key={i} style={{ background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:16,position:'relative',overflow:'hidden' }}>
                    <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:c.val,opacity:0.6,borderRadius:'10px 10px 0 0' }} />
                    <div style={{ width:26,height:26,borderRadius:6,background:c.bg,border:`1px solid ${c.border}`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10 }}>
                      <Ic d={s.icon} size={13} color={c.val} />
                    </div>
                    <p style={{ fontSize:20,fontWeight:700,color:c.val,letterSpacing:'-0.02em',marginBottom:3 }}>{s.value}</p>
                    <p style={{ fontSize:12,color:th.mid,marginBottom:2 }}>{s.label}</p>
                    <p style={{ fontSize:11,color:th.muted }}>{s.sub}</p>
                  </div>
                );
              })}
            </div>
            <Card>
              <SectionHeader title="Consumo por contrato" />
              {fT.filter(c=>c.tokens_used>0).length===0
                ?<div style={{ padding:48,textAlign:'center',color:th.muted,fontSize:13 }}>Nenhum dado no período</div>
                :<div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13 }}>
                    <thead><tr><TH ch="Email" /><TH ch="Tipo" /><TH ch="Tokens" /><TH ch="Custo estimado" /><TH ch="Data" /></tr></thead>
                    <tbody>
                      {fT.filter(c=>c.tokens_used>0).sort((a,b)=>b.tokens_used-a.tokens_used).map((c,i)=>(
                        <tr key={c.id} style={{ borderBottom:`1px solid ${th.sub}`,background:i%2===0?th.rowAlt:th.row }}>
                          <TD style={{ color:th.text,maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.user_email}</TD>
                          <TD>{CONTRACT_NAMES[c.contract_type]||c.contract_type}</TD>
                          <TD style={{ color:cardColors.blue.val,fontWeight:600 }}>{maskNum(fmtNum(c.tokens_used))}</TD>
                          <TD style={{ color:cardColors.amber.val,fontWeight:600 }}>{mask(fmtCurrency((c.tokens_used/1_000_000)*0.15*5.1))}</TD>
                          <TD style={{ color:th.muted,whiteSpace:'nowrap' }}>{new Date(c.created_at).toLocaleDateString('pt-BR')}</TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            </Card>
          </>)}

        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav style={{ display:'none', position:'fixed', bottom:0, left:0, right:0, background:th.sidebar, borderTop:`1px solid ${th.border}`, zIndex:40, padding:'6px 0', paddingBottom:'calc(6px + env(safe-area-inset-bottom,0px))' }} className="show-mobile-flex">
        {navItems.map(item=>(
          <button key={item.id} onClick={()=>nav(item.id)} style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:3,flex:1,padding:'6px 4px',border:'none',background:'transparent',color:section===item.id?(dark?'#5aaa7a':'#1a3028'):th.muted,cursor:'pointer' }}>
            <Ic d={item.icon} size={18} color={section===item.id?(dark?'#5aaa7a':'#1a3028'):th.muted} />
            <span style={{ fontSize:9,fontWeight:section===item.id?600:400 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .show-mobile-flex{display:flex!important}
          aside{transform:translateX(-100%)}
          .mobile-full{margin-left:0!important}
          main{padding-bottom:72px!important}
          .grid-2{grid-template-columns:1fr!important}
          .grid-3{grid-template-columns:1fr 1fr!important}
          .grid-5{grid-template-columns:1fr 1fr!important}
          .pie-grid{grid-template-columns:1fr!important}
        }
        @media(min-width:769px){
          .show-mobile-flex{display:none!important}
        }
      `}</style>
    </div>
  );
}