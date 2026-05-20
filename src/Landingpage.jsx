import { useState, useEffect, useRef } from "react";
import {
  motion, AnimatePresence,
  useScroll, useTransform, useInView,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import {
  Menu, X, ArrowRight, Sparkles, FileEdit, CreditCard, Download,
  Shield, Clock, PiggyBank, Smartphone, Scale, Zap, Check, Star,
  ChevronDown, Quote, LogIn, Repeat,
} from "lucide-react";
import { useAuth } from "./config/AuthContext";

// ─────────────────────────────────────────────
// SMOOTH SCROLL
// ─────────────────────────────────────────────
const smoothScrollTo = (e, href) => {
  e.preventDefault();
  const el = document.getElementById(href.replace("#", ""));
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// ─────────────────────────────────────────────
// DETECT MOBILE
// ─────────────────────────────────────────────
const isMobileDevice = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

// ─────────────────────────────────────────────
// FLOATING PARTICLES (canvas) — desabilitado no mobile
// ─────────────────────────────────────────────
const FloatingParticles = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (isMobileDevice()) return; // skip no mobile
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16,185,129,${0.06 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }} />;
};

// ─────────────────────────────────────────────
// 3D DOCUMENT (Three.js)
// ─────────────────────────────────────────────
const ThreeDDocument = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth || 460, h = mount.clientHeight || 420;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const d1 = new THREE.DirectionalLight(0x10b981, 2.5); d1.position.set(3, 5, 5); scene.add(d1);
    const d2 = new THREE.DirectionalLight(0x3b82f6, 1.2); d2.position.set(-3, -2, 3); scene.add(d2);
    const group = new THREE.Group(); scene.add(group);
    const docGeo = new THREE.BoxGeometry(2.2, 2.9, 0.08);
    group.add(new THREE.Mesh(docGeo, new THREE.MeshPhysicalMaterial({ color: 0x0d1a2a, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.95, emissive: 0x051020 })));
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(docGeo), new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 })));
    const lm = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.45 });
    [1.4, 1.0, 1.3, 0.8, 1.2, 0.9, 1.1].forEach((lw, i) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(lw, 0.07, 0.01), lm.clone());
      m.position.set((lw - 1.4) / 2 - 0.3, 0.9 - i * 0.22, 0.05); group.add(m);
    });
    const sealMesh = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.32, 32), new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
    sealMesh.position.set(0.6, -1.0, 0.05); group.add(sealMesh);
    const sealInner = new THREE.Mesh(new THREE.CircleGeometry(0.18, 32), new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.15 }));
    sealInner.position.set(0.6, -1.0, 0.05); group.add(sealInner);
    const pPos = new Float32Array(40 * 3);
    for (let i = 0; i < 40; i++) { pPos[i*3]=(Math.random()-.5)*5; pPos[i*3+1]=(Math.random()-.5)*5; pPos[i*3+2]=(Math.random()-.5)*3; }
    const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const ps = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x10b981, size: 0.04, transparent: true, opacity: 0.6 }));
    scene.add(ps);
    const onMM = (e) => { const r = mount.getBoundingClientRect(); mouseRef.current.x = ((e.clientX-r.left)/r.width-.5)*2; mouseRef.current.y = -((e.clientY-r.top)/r.height-.5)*2; };
    mount.addEventListener("mousemove", onMM);
    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      group.rotation.y += (mouseRef.current.x*0.5 - group.rotation.y)*0.05;
      group.rotation.x += (mouseRef.current.y*0.3 - group.rotation.x)*0.05;
      group.rotation.y += 0.003; ps.rotation.y += 0.001;
      sealMesh.material.opacity = 0.5 + Math.sin(Date.now()*0.003)*0.3;
      renderer.render(scene, camera);
    };
    animate();
    return () => { cancelAnimationFrame(frame); mount.removeEventListener("mousemove", onMM); renderer.dispose(); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); };
  }, []);
  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" style={{ minHeight: 420 }} />;
};

// ─────────────────────────────────────────────
// INFINITE MARQUEE
// ─────────────────────────────────────────────
const InfiniteMarquee = ({ testimonials, direction = 1, speed = 35 }) => {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const items = [...testimonials, ...testimonials, ...testimonials];
  const CARD_WIDTH = typeof window !== "undefined" && window.innerWidth < 640 ? 260 : 320;
  const GAP = 16;
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const total = testimonials.length * (CARD_WIDTH + GAP);
    const go = () => {
      if (!pausedRef.current) {
        posRef.current += (speed / 60) * direction;
        if (posRef.current >= total) posRef.current -= total;
        if (posRef.current < 0) posRef.current += total;
        track.style.transform = `translateX(${-posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(go);
    };
    animRef.current = requestAnimationFrame(go);
    return () => cancelAnimationFrame(animRef.current);
  }, [direction, speed, testimonials.length, CARD_WIDTH]);
  return (
    <div className="overflow-hidden touch-pan-y" onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; }}>
      <div ref={trackRef} className="flex will-change-transform" style={{ gap: GAP, width: "max-content" }}>
        {items.map((t, idx) => (
          <div key={idx} style={{ width: CARD_WIDTH, flexShrink: 0 }} className="relative p-4 sm:p-5 rounded-2xl border border-white/6 bg-white/[0.025] transition-colors duration-300 cursor-default">
            <div className="absolute top-3 right-4 opacity-[0.07]"><Quote className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" /></div>
            <div className="flex gap-0.5 mb-2.5">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />)}</div>
            <p className="text-xs sm:text-sm text-white/55 leading-relaxed mb-4 italic" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>"{t.text}"</p>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}><span className="text-[10px] sm:text-xs font-bold text-white">{t.avatar}</span></div>
              <div className="flex-1 min-w-0"><p className="text-xs sm:text-sm font-semibold text-white truncate">{t.name}</p><p className="text-[10px] sm:text-xs text-white/35 truncate">{t.role}</p></div>
              <div className="text-right flex-shrink-0 hidden sm:block"><span className="text-[10px] text-emerald-400/70 block font-medium">{t.contractType}</span><span className="text-[10px] text-white/20">{t.date}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PARALLAX SECTION DIVIDER
// ─────────────────────────────────────────────
const ParallaxBanner = () => {
  const ref = useRef(null);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], isDesktop ? [-80, 80] : [0, 0]);
  const y2 = useTransform(scrollYProgress, [0, 1], isDesktop ? [80, -80] : [0, 0]);
  const x1 = useTransform(scrollYProgress, [0, 1], isDesktop ? [-40, 40] : [0, 0]);
  const x2 = useTransform(scrollYProgress, [0, 1], isDesktop ? [40, -40] : [0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], isDesktop ? [0.9, 1.05, 0.9] : [1, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  return (
    <div ref={ref} className="relative h-[320px] overflow-hidden bg-[#060c13] flex items-center justify-center">
      <motion.div style={{ y: y1 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" }} />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)" }} />
      </motion.div>
      <motion.div style={{ x: x1, y: y1 }} className="absolute left-[8%] top-[20%] px-5 py-3 rounded-2xl bg-white/4 border border-emerald-500/20 backdrop-blur-sm hidden md:flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Shield className="w-4 h-4 text-emerald-400" /></div>
        <div><p className="text-white font-bold text-sm">100% Legal</p><p className="text-white/40 text-xs">Revisado por especialistas</p></div>
      </motion.div>
      <motion.div style={{ x: x2, y: y2 }} className="absolute right-[8%] bottom-[20%] px-5 py-3 rounded-2xl bg-white/4 border border-amber-500/20 backdrop-blur-sm hidden md:flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center"><Zap className="w-4 h-4 text-amber-400" /></div>
        <div><p className="text-white font-bold text-sm">2 minutos</p><p className="text-white/40 text-xs">Do zero ao PDF pronto</p></div>
      </motion.div>
      <motion.div style={{ x: x1, y: y2 }} className="absolute right-[12%] top-[18%] px-5 py-3 rounded-2xl bg-white/4 border border-blue-500/20 backdrop-blur-sm hidden lg:flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center"><Star className="w-4 h-4 text-blue-400 fill-blue-400" /></div>
        <div><p className="text-white font-bold text-sm">4.9 / 5</p><p className="text-white/40 text-xs">+500 avaliações</p></div>
      </motion.div>
      <motion.div style={{ scale, opacity }} className="relative z-10 text-center px-6">
        <p className="text-xs font-bold text-emerald-400 uppercase tracking-[0.25em] mb-3">Simples assim</p>
        <h3 className="text-3xl md:text-5xl font-black text-white leading-tight" style={{ fontFamily: "'Parkinsans', sans-serif" }}>
          Contrato profissional<br />
          <span style={{ background: "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>por R$ 29,90.</span>
        </h3>
      </motion.div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
    </div>
  );
};

// ─────────────────────────────────────────────
// WHATSAPP BUTTON
// ─────────────────────────────────────────────
const WhatsAppButton = () => {
  const phoneNumber = "5599991999125";
  const message = "Olá! Preciso de ajuda com meu contrato.";
  return (
    <motion.a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank" rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full"
      style={{ background: "linear-gradient(135deg, #25d366, #128c7e)", boxShadow: "0 4px 24px rgba(37,211,102,0.45)" }}>
      <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(37,211,102,0.3)" }} />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-7 h-7 relative z-10" fill="white">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.67 4.8 1.832 6.793L2 30l7.418-1.807A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.54 11.54 0 0 1-5.885-1.608l-.422-.25-4.403 1.072 1.102-4.288-.276-.44A11.56 11.56 0 0 1 4.4 16C4.4 9.59 9.59 4.4 16 4.4S27.6 9.59 27.6 16 22.41 27.6 16 27.6zm6.34-8.62c-.347-.174-2.055-1.014-2.374-1.13-.32-.116-.552-.174-.784.174-.232.347-.9 1.13-1.103 1.362-.203.232-.406.26-.753.087-.347-.174-1.466-.54-2.792-1.722-1.032-.92-1.728-2.055-1.931-2.402-.203-.347-.022-.535.152-.708.157-.156.347-.406.52-.61.174-.203.232-.347.347-.579.116-.232.058-.435-.029-.61-.087-.174-.784-1.89-1.074-2.588-.283-.68-.57-.587-.784-.598l-.667-.012c-.232 0-.61.087-.928.435-.319.347-1.218 1.19-1.218 2.9s1.247 3.364 1.42 3.596c.174.232 2.453 3.745 5.944 5.252.831.359 1.48.573 1.985.733.834.265 1.593.228 2.193.138.669-.1 2.055-.84 2.345-1.651.29-.812.29-1.508.203-1.651-.086-.145-.318-.232-.666-.406z" />
      </svg>
    </motion.a>
  );
};

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────
const Header = ({ onCreateContract, onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Vantagens", href: "#vantagens" },
    { label: "Avaliações", href: "#avaliacoes" },
    { label: "Preços", href: "#precos" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <motion.header initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || isMenuOpen ? "bg-[#080d14]/98 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/5" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-20 lg:h-24">
          <a href="#" className="flex items-center flex-shrink-0">
            <motion.img
              src="/contrati.png"
              alt="Contratify"
              whileHover={{ scale: 1.05 }}
              className="h-7 md:h-9 lg:h-12 w-auto object-contain"
            />
          </a>

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link, i) => (
              <motion.a key={link.href} href={link.href} onClick={(e) => smoothScrollTo(e, link.href)}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-400 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {!loading && !isAuthenticated && (
              <motion.button onClick={() => onOpenAuth("login")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all">
                Login
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {!loading && !isAuthenticated && (
              <motion.button onClick={() => onOpenAuth("login")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white/60 hover:text-white border border-white/8 hover:border-white/20 rounded-xl transition-all">
                <LogIn className="w-4 h-4" />
                Entrar
              </motion.button>
            )}
            <button className="p-2 text-white/80" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-white/10 py-4" style={{ background: "#080d14" }}>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} className="text-sm font-medium text-white/60 hover:text-white px-3 py-3 rounded-lg hover:bg-white/5 transition-all"
                    onClick={(e) => { setIsMenuOpen(false); setTimeout(() => smoothScrollTo(e, link.href), 300); }}>{link.label}</a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────
const HeroSection = ({ onCreateContract }) => {
  const benefits = ["Juridicamente revisado", "Pronto em 2 minutos", "Pagamento via Pix"];
  const { scrollY } = useScroll();
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const gridY      = useTransform(scrollY, [0, 800], isDesktop ? [0, 200] : [0, 0]);
  const blob1Y     = useTransform(scrollY, [0, 800], isDesktop ? [0, 120] : [0, 0]);
  const blob2Y     = useTransform(scrollY, [0, 800], isDesktop ? [0, 80] : [0, 0]);
  const blob1X     = useTransform(scrollY, [0, 800], isDesktop ? [0, -30] : [0, 0]);
  const blob2X     = useTransform(scrollY, [0, 800], isDesktop ? [0, 30] : [0, 0]);
  const contentY   = useTransform(scrollY, [0, 600], isDesktop ? [0, 60] : [0, 0]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, isDesktop ? 0 : 1]);

  const [count, setCount] = useState(0);
  useEffect(() => {
    const target = 1100, step = Math.ceil(target / 60);
    let c = 0;
    const iv = setInterval(() => { c = Math.min(c + step, target); setCount(c); if (c >= target) clearInterval(iv); }, 30);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080d14]">
      <motion.div style={{ y: gridY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(rgba(16,185,129,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.15) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        {!isMobileDevice() && <FloatingParticles />}
      </motion.div>
      <motion.div style={{ y: blob1Y, x: blob1X }} className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none">
        <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", filter: "blur(120px)" }} />
      </motion.div>
      <motion.div style={{ y: blob2Y, x: blob2X }} className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none">
        <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", filter: "blur(120px)" }} />
      </motion.div>
      <motion.div style={{ y: contentY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 pt-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-emerald-400 tracking-wide">Gerado por Inteligência Artificial</span>
            </motion.div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight" style={{ fontFamily: "'Parkinsans', sans-serif" }}>
              {["Seu contrato", "profissional", "em 2 minutos."].map((line, i) => (
                <motion.span key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }} className="block"
                  style={i === 1 ? { background: "linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : {}}>
                  {line}
                </motion.span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-lg text-white/50 mb-8 max-w-lg leading-relaxed">
              Sem advogados caros. Sem burocracia. Pague via Pix e baixe seu contrato personalizado instantaneamente.
            </motion.p>
            <div className="flex flex-wrap gap-5 mb-10">
              {benefits.map((b, i) => (
                <motion.div key={b} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.08 }} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-400" /></div>
                  <span className="text-sm text-white/70 font-medium">{b}</span>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
              <motion.button onClick={onCreateContract} whileHover={{ scale: 1.05, y: -3, boxShadow: "0 0 60px rgba(34,197,94,0.5)" }} whileTap={{ scale: 0.97 }}
                className="group relative px-8 py-4 font-semibold rounded-2xl flex items-center gap-2 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #22c55e, #a3e635)", color: "#0d2010", boxShadow: "0 0 40px rgba(34,197,94,0.35), 0 4px 20px rgba(0,0,0,0.3)" }}>
                <motion.span className="absolute inset-0 bg-white/10" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.4 }} />
                <span className="relative">Criar Meu Contrato</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative" />
              </motion.button>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-8 text-sm text-white/30">
              <span className="text-emerald-400 font-semibold">Já temos +{count} contratos</span> gerados com sucesso
            </motion.p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="relative hidden lg:block h-[480px]">
            <ThreeDDocument />
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-6 -left-6 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-2" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
              <Shield className="w-4 h-4 text-emerald-400" /><span className="text-xs font-semibold text-white">Juridicamente revisado</span>
            </motion.div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-10 -right-4 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-2" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
              <Zap className="w-4 h-4 text-amber-400" /><span className="text-xs font-semibold text-white">Pronto em 2 min</span>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.5 }} className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-emerald-400/60 text-center whitespace-nowrap">↕ Mova o mouse para interagir</motion.p>
          </motion.div>
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080d14] to-transparent pointer-events-none" />
    </section>
  );
};

// ─────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────
const HowItWorksSection = () => {
  const steps = [
    { icon: FileEdit, number: "01", title: "Preencha os dados", description: "Responda perguntas simples sobre o tipo de contrato e as partes envolvidas." },
    { icon: Sparkles, number: "02", title: "IA gera o rascunho", description: "Nossa inteligência artificial cria um contrato personalizado e juridicamente revisado." },
    { icon: CreditCard, number: "03", title: "Pague via Pix", description: "Pagamento rápido e seguro. Sem cartão, sem complicação." },
    { icon: Download, number: "04", title: "Baixe seu contrato", description: "Receba seu contrato em PDF pronto para assinatura em segundos." },
  ];
  return (
    <section id="como-funciona" className="py-28 md:py-40 bg-[#080d14] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(59,130,246,0.2) 0%, transparent 50%)` }} />
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Simples e Rápido</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" style={{ fontFamily: "'Parkinsans', sans-serif" }}>Como Funciona</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
          {steps.map((step, index) => (
            <motion.div key={step.number}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#0d1520] p-8 lg:p-10 group hover:bg-[#0f1c2a] transition-colors duration-300"
              style={{ willChange: "opacity, transform" }}>
              <div className="absolute top-6 right-6 text-6xl font-black opacity-[0.04] select-none" style={{ fontFamily: "'Parkinsans', sans-serif" }}>{step.number}</div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/15 transition-colors duration-300">
                <step.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-xs font-bold text-emerald-500/60 mb-3 tracking-widest">{step.number}</div>
              <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                  <ArrowRight className="w-4 h-4 text-white/15" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// BENEFIT CARD
// ─────────────────────────────────────────────
const BenefitCard = ({ benefit, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const mobile = isMobileDevice();

  const initial = mobile
    ? { opacity: 0 }
    : { opacity: 0, x: index % 2 === 0 ? -60 : 60 };

  const animate = isInView
    ? { opacity: 1, x: 0 }
    : {};

  return (
    <motion.div ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: mobile ? 0.4 : 0.6, delay: mobile ? (index % 3) * 0.05 : (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/25 hover:bg-white/[0.04] transition-colors duration-300 cursor-default"
      style={{ willChange: "opacity, transform" }}>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(16,185,129,0.06) 0%, transparent 60%)" }} />
      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" style={{ background: "linear-gradient(to bottom, #10b981, #34d399)" }} />
      <div className="relative">
        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/20 transition-colors duration-300">
          <benefit.icon className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-base font-bold text-white mb-2.5">{benefit.title}</h3>
        <p className="text-sm text-white/40 leading-relaxed">{benefit.description}</p>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// BENEFITS SECTION
// ─────────────────────────────────────────────
const BenefitsSection = () => {
  const sectionRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const blobY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [-60, 60]);
  const blobX = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [30, -30]);
  const circleY1 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [-30, 30]);
  const circleY2 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [30, -30]);
  const benefits = [
    { icon: Shield, title: "Juridicamente Revisado", description: "Todos os contratos seguem padrões legais brasileiros e são revisados por especialistas." },
    { icon: PiggyBank, title: "Economia de até 90%", description: "Pague uma fração do valor cobrado por advogados tradicionais." },
    { icon: Clock, title: "Disponível 24h", description: "Gere seu contrato a qualquer hora, qualquer dia. Sem espera, sem agendamento." },
    { icon: Zap, title: "Pronto em Minutos", description: "Tecnologia de IA avançada que gera contratos personalizados em tempo recorde." },
    { icon: Smartphone, title: "100% Online", description: "Acesse de qualquer dispositivo. Sem downloads, sem instalações." },
    { icon: Scale, title: "Vários Tipos de Contratos", description: "Prestação de serviços, aluguel, parceria e muito mais." },
  ];
  return (
    <section ref={sectionRef} id="vantagens" className="py-28 md:py-40 bg-[#0a1018] relative overflow-hidden">
      <motion.div style={{ y: blobY, x: blobX }} className="absolute right-0 top-0 w-2/3 h-full pointer-events-none">
        <div className="absolute inset-0 opacity-[0.06]" style={{ background: "radial-gradient(ellipse at 100% 50%, #10b981 0%, transparent 70%)" }} />
      </motion.div>
      <motion.div style={{ y: circleY1 }} className="absolute -left-20 top-1/2 w-64 h-64 rounded-full border border-emerald-500/5 pointer-events-none hidden lg:block" />
      <motion.div style={{ y: circleY2 }} className="absolute -right-10 bottom-20 w-48 h-48 rounded-full border border-emerald-500/8 pointer-events-none hidden lg:block" />
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <motion.div initial={{ opacity: 0, x: isMobile ? 0 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Por que escolher</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" style={{ fontFamily: "'Parkinsans', sans-serif" }}>
              Vantagens do<br />
              <span style={{ background: "linear-gradient(135deg, #10b981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Contratify</span>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="text-white/40 max-w-xs leading-relaxed text-sm lg:text-right">
            A forma mais inteligente de criar contratos profissionais sem complicação.
          </motion.p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit, index) => <BenefitCard key={benefit.title} benefit={benefit} index={index} />)}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
const TestimonialsSection = () => {
  const testimonials = [
    { name: "Mariana Costa", role: "Designer Freelancer", avatar: "MC", rating: 5, text: "Incrível! Precisava de um contrato para um cliente grande e em menos de 3 minutos já tinha tudo pronto. Economizei muito comparado a contratar um advogado.", contractType: "Prestação de Serviços", date: "há 2 dias", color: "from-purple-500 to-pink-500" },
    { name: "Rafael Mendonça", role: "Desenvolvedor Web", avatar: "RM", rating: 5, text: "Uso o Contratify todo mês para novos projetos. Simplesmente perfeito. O contrato é profissional e os clientes ficam impressionados com a qualidade.", contractType: "Contrato de TI", date: "há 5 dias", color: "from-blue-500 to-cyan-500" },
    { name: "Juliana Ferreira", role: "Consultora de Marketing", avatar: "JF", rating: 5, text: "Finalmente um serviço que realmente funciona! O processo é super intuitivo, o pagamento via Pix é instantâneo e o PDF ficou impecável. Super recomendo!", contractType: "Consultoria", date: "há 1 semana", color: "from-emerald-500 to-teal-500" },
    { name: "Carlos Albuquerque", role: "Fotógrafo Profissional", avatar: "CA", rating: 5, text: "Já tive problemas com clientes que não pagavam por falta de contrato. Com o Contratify isso acabou. Rápido, barato e juridicamente sólido!", contractType: "Fotografia", date: "há 2 semanas", color: "from-orange-500 to-red-500" },
    { name: "Fernanda Lima", role: "Arquiteta", avatar: "FL", rating: 5, text: "Minha advogada cobrava R$500 por contrato básico. Aqui paguei R$29,90 e recebi algo ainda mais completo e personalizado. Não tem como não usar!", contractType: "Projeto Arquitetônico", date: "há 3 semanas", color: "from-violet-500 to-purple-500" },
    { name: "Thiago Nunes", role: "Professor Particular", avatar: "TN", rating: 5, text: "Precisava formalizar meus contratos com alunos e pais. O Contratify gerou algo perfeito, com todas as cláusulas que eu precisava. Ótimo serviço!", contractType: "Contrato Educacional", date: "há 1 mês", color: "from-amber-500 to-orange-500" },
    { name: "Beatriz Rocha", role: "Nutricionista", avatar: "BR", rating: 5, text: "Prático demais! Gerei contratos para minha clínica em minutos. A linguagem jurídica é clara e os pacientes ficam mais tranquilos assinando.", contractType: "Atendimento Clínico", date: "há 1 mês", color: "from-rose-500 to-pink-500" },
    { name: "Lucas Pimentel", role: "Social Media", avatar: "LP", rating: 5, text: "Comecei a usar e não largo mais. Para quem é freelancer como eu, ter um contrato profissional rápido e barato é essencial. Melhor custo-benefício!", contractType: "Gestão de Redes", date: "há 2 meses", color: "from-sky-500 to-blue-500" },
  ];
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4);
  return (
    <section id="avaliacoes" className="py-28 md:py-40 bg-[#080d14] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.04) 0%, transparent 70%)" }} />
      <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #080d14, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #080d14, transparent)" }} />
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 mb-14">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Depoimentos</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Parkinsans', sans-serif" }}>
            O que nossos clientes<br />
            <span style={{ background: "linear-gradient(135deg, #10b981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>estão dizendo</span>
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </motion.div>
            ))}
            <span className="text-white/40 text-sm ml-2">4.9/5 · +600 avaliações</span>
          </div>
        </motion.div>
      </div>
      <div className="mb-4"><InfiniteMarquee testimonials={row1} direction={1} speed={32} /></div>
      <InfiniteMarquee testimonials={row2} direction={-1} speed={28} />
    </section>
  );
};

// ─────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────
const PricingSection = ({ onCreateContract, onOpenAuth }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const ref = useRef(null);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const decorY1 = useTransform(scrollYProgress, [0, 1], isDesktop ? [-50, 50] : [0, 0]);
  const decorY2 = useTransform(scrollYProgress, [0, 1], isDesktop ? [50, -50] : [0, 0]);
  const decorX1 = useTransform(scrollYProgress, [0, 1], isDesktop ? [-20, 20] : [0, 0]);

  const handleSubscriptionClick = () => {
    if (isAuthenticated) {
      navigate("/chat");
    } else {
      onOpenAuth("login");
    }
  };

  return (
    <section ref={ref} id="precos" className="py-28 md:py-40 bg-[#0a1018] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 60%)" }} />
      <motion.div style={{ y: decorY1, x: decorX1 }} className="absolute top-20 left-10 w-32 h-32 rounded-full border border-emerald-500/10 pointer-events-none" />
      <motion.div style={{ y: decorY2 }} className="absolute bottom-20 right-10 w-48 h-48 rounded-full border border-emerald-500/8 pointer-events-none" />
      <motion.div style={{ y: decorY1 }} className="absolute top-1/2 right-20 w-20 h-20 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Preços Transparentes</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Parkinsans', sans-serif" }}>Escolha o Melhor Plano</h2>
          <p className="text-white/40 max-w-lg mx-auto">Sem mensalidades. Sem surpresas. Pague apenas pelo que usar.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

          {/* PLANO BÁSICO */}
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <motion.div whileHover={{ boxShadow: "0 0 60px rgba(255,255,255,0.05)" }} className="relative rounded-3xl p-8 border border-white/10 bg-white/[0.02] transition-all duration-300 h-full">
              <div className="relative">
                <div className="mb-6 pt-3">
                  <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Parkinsans', sans-serif" }}>Contrato Padrão</h3>
                  <p className="text-sm text-white/40">Ideal para uma necessidade pontual</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-white/40 font-medium">R$</span>
                    <motion.span initial={{ scale: 0.8 }} whileInView={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-6xl font-black text-white leading-none" style={{ fontFamily: "'Parkinsans', sans-serif" }}>29,90</motion.span>
                  </div>
                </div>
                <div className="h-px bg-white/6 mb-6" />
                <ul className="space-y-3 mb-8">
                  {[
                    { text: "1 contrato personalizado", included: true },
                    { text: "Gerado por IA avançada", included: true },
                    { text: "Revisão jurídica incluída", included: true },
                    { text: "Download imediato em PDF", included: true },
                    { text: "Suporte por e-mail", included: true },
                    { text: "Suporte por whatsapp", included: true },
                    { text: "Logo da sua empresa no contrato", included: false },
                    { text: "Cores e fontes da sua marca", included: false },
                    { text: "Layout exclusivo personalizado", included: false },
                    { text: "Marca d'água com seu nome", included: false },
                    { text: "Preview antes de baixar", included: false },
                  ].map((f, i) => (
                    <motion.li key={f.text} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3">
                      {f.included ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/10 border border-white/20">
                          <Check className="w-2.5 h-2.5 text-white/60" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-red-500/10 border border-red-500/30">
                          <X className="w-2.5 h-2.5 text-red-400" />
                        </div>
                      )}
                      <span className={`text-sm ${f.included ? "text-white/50" : "text-white/25 line-through"}`}>{f.text}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.button onClick={onCreateContract} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 transition-all">
                  <span>Criar Contrato Padrão</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* PLANO PREMIUM */}
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="relative">
            {/* Badge popular */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider" style={{ background: "linear-gradient(135deg, #22c55e, #a3e635)", color: "#0d2010" }}>✦ MAIS POPULAR</span>
            </div>
            <motion.div whileHover={{ boxShadow: "0 0 80px rgba(34,197,94,0.25)" }} className="relative rounded-3xl p-8 border border-emerald-500/40 bg-emerald-500/5 transition-all duration-300 h-full" style={{ boxShadow: "0 0 60px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
              <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 60%)" }} />
              <div className="relative">
                <div className="mb-6 pt-3">
                  <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Parkinsans', sans-serif" }}>Contrato com Sua Marca</h3>
                  <p className="text-sm text-white/40">Contrato personalizado com a identidade da sua empresa</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-white/40 font-medium">R$</span>
                    <motion.span initial={{ scale: 0.8 }} whileInView={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-6xl font-black text-white leading-none" style={{ fontFamily: "'Parkinsans', sans-serif" }}>39,90</motion.span>
                  </div>
                </div>
                <div className="h-px bg-white/6 mb-6" />
                <ul className="space-y-3 mb-8">
                  {[
                    { text: "1 contrato personalizado" },
                    { text: "Gerado por IA avançada" },
                    { text: "Revisão jurídica incluída" },
                    { text: "Download imediato em PDF" },
                    { text: "Suporte por e-mail" },
                    { text: "Suporte por whatsapp" },
                    { text: "Logo da sua empresa no contrato" },
                    { text: "Cores e fontes da sua marca" },
                    { text: "Layout exclusivo personalizado" },
                    { text: "Marca d'água com seu nome" },
                    { text: "Preview antes de baixar" },
                  ].map((f, i) => (
                    <motion.li key={f.text} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-emerald-500/20 border border-emerald-500/30">
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                      <span className="text-sm text-white/80">{f.text}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.button onClick={onCreateContract} whileHover={{ scale: 1.03, y: -2, boxShadow: "0 8px 40px rgba(34,197,94,0.5)" }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 overflow-hidden relative"
                  style={{ background: "linear-gradient(135deg, #22c55e, #a3e635)", color: "#0d2010", boxShadow: "0 4px 24px rgba(34,197,94,0.3)" }}>
                  <motion.span className="absolute inset-0 bg-white/10" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.4 }} />
                  <Sparkles className="w-4 h-4 relative" /><span className="relative">Criar com Minha Marca</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/8">
            <span className="text-sm text-white/50">Pagamento seguro via</span>
            <span className="text-sm font-bold text-emerald-400">Pix</span>
            <span className="text-white/20">•</span>
            <span className="text-sm text-white/40">Aprovação instantânea</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────
const FAQSection = () => {
  const [openItem, setOpenItem] = useState(null);
  const faqs = [
    { question: "Os contratos são válidos juridicamente?", answer: "Sim! Todos os nossos contratos são elaborados seguindo as normas do Código Civil Brasileiro e são revisados por especialistas jurídicos. Eles possuem validade legal para uso em acordos formais entre partes." },
    { question: "Como funciona o pagamento via Pix?", answer: "Após preencher os dados do seu contrato, você receberá um QR Code ou código Pix para pagamento. A aprovação é instantânea e, assim que confirmado, seu contrato estará disponível para download imediatamente." },
    { question: "Quais tipos de contratos posso gerar?", answer: "Oferecemos diversos modelos: Prestação de Serviços, Contrato de Aluguel, Acordo de Parceria, Contrato de Trabalho Freelancer, Termo de Confidencialidade (NDA), entre outros. Novos modelos são adicionados frequentemente." },
    { question: "Esta IA é diferente do ChatGPT e Gemini?", answer: "Completamente diferente! Enquanto o ChatGPT e Gemini são IAs de propósito geral, nossa IA foi especificamente treinada com milhares de documentos jurídicos brasileiros, jurisprudências e a legislação nacional (Código Civil, CLT, LGPD, etc). Isso significa que ela entende profundamente as nuances legais do Brasil, gera cláusulas que realmente se aplicam à sua realidade e evita termos genéricos ou inadequados para o nosso sistema jurídico." },
    { question: "Como a IA é treinada com leis brasileiras?", answer: "Nossa IA passou por um treinamento especializado com um vasto corpus de documentos legais brasileiros, incluindo contratos validados por advogados, decisões judiciais, doutrinas e a legislação atualizada. Diferente de IAs genéricas treinadas com dados da internet mundial, a nossa entende expressões como 'foro da comarca', 'multa contratual' e 'cláusulas resolutivas' no contexto correto do direito brasileiro, garantindo que cada contrato gerado esteja em conformidade com as leis do país." },
    { question: "Posso editar o contrato depois de gerado?", answer: "Sim! O contrato é entregue em formato PDF editável. Você pode fazer ajustes menores diretamente no documento. Para alterações mais significativas, recomendamos gerar um novo contrato com as informações atualizadas." },
    { question: "E se eu precisar de ajuda com meu contrato?", answer: "Nossa equipe de suporte está disponível por e-mail e por whatsapp para tirar dúvidas sobre o uso da plataforma e dos contratos gerados." },
  ];
  return (
    <section id="faq" className="py-28 md:py-40 bg-[#080d14] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:w-72 flex-shrink-0">
            <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Dúvidas Frequentes</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'Parkinsans', sans-serif" }}>Perguntas e Respostas</h2>
            <p className="text-white/40 text-sm mt-4 leading-relaxed">Tire suas principais dúvidas sobre nossa plataforma e contratos.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex-1 space-y-3">
            {faqs.map((faq, index) => (
              <motion.div key={index} whileHover={{ x: 2 }} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openItem === index ? "border-emerald-500/25 bg-emerald-500/5" : "border-white/6 bg-white/[0.02] hover:border-white/12"}`}>
                <button onClick={() => setOpenItem(openItem === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left font-semibold text-white/80 hover:text-white transition-colors">
                  <span className="text-sm leading-relaxed pr-4">{faq.question}</span>
                  <motion.div animate={{ rotate: openItem === index ? 180 : 0 }} className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${openItem === index ? "bg-emerald-500/20" : "bg-white/5"}`}>
                    <ChevronDown className={`w-4 h-4 ${openItem === index ? "text-emerald-400" : "text-white/40"}`} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openItem === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="px-6 pb-6 text-sm text-white/40 leading-relaxed border-t border-white/5 pt-4">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────
const CTASection = ({ onCreateContract }) => {
  const ref = useRef(null);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], isDesktop ? [-40, 40] : [0, 0]);
  return (
    <section ref={ref} className="py-28 md:py-40 bg-[#0a1018] relative overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.12) 0%, transparent 60%)" }} className="absolute inset-0" />
      </motion.div>
      <div className="absolute inset-6 md:inset-12 rounded-3xl border border-emerald-500/10 pointer-events-none" style={{ background: "rgba(16,185,129,0.02)" }} />
      <div className="max-w-4xl mx-auto px-6 md:px-10 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" /><span className="text-sm font-medium text-emerald-400">Comece agora mesmo</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Parkinsans', sans-serif" }}>
            Pronto para criar seu<br />
            <span style={{ background: "linear-gradient(135deg, #10b981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>contrato profissional?</span>
          </h2>
          <p className="text-white/40 mb-12 max-w-lg mx-auto leading-relaxed">Junte-se a centenas de pessoas que já simplificaram a criação de contratos com o Contratify.</p>
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[{ icon: Shield, label: "100% Seguro" }, { icon: Clock, label: "Pronto em 2 minutos" }].map(({ icon: Icon, label }) => (
              <motion.div key={label} whileHover={{ y: -3 }} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center"><Icon className="w-4 h-4 text-emerald-400" /></div>
                <span className="text-sm text-white/60 font-medium">{label}</span>
              </motion.div>
            ))}
          </div>
          <motion.button onClick={onCreateContract} whileHover={{ scale: 1.05, y: -4, boxShadow: "0 0 80px rgba(34,197,94,0.5)" }} whileTap={{ scale: 0.97 }}
            className="group px-10 py-5 font-bold rounded-2xl flex items-center justify-center mx-auto gap-2 text-base overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, #22c55e, #a3e635)", color: "#0d2010", boxShadow: "0 0 60px rgba(34,197,94,0.35), 0 4px 20px rgba(0,0,0,0.3)" }}>
            <motion.span className="absolute inset-0 bg-white/10" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.4 }} />
            <span className="relative">Criar Meu Contrato Agora</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
          </motion.button>
          <p className="mt-6 text-sm text-white/25">A partir de R$ 29,90 • Pagamento via Pix</p>
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const links = {
    produto: [{ label: "Como Funciona", href: "#como-funciona" }, { label: "Preços", href: "#precos" }, { label: "FAQ", href: "#faq" }],
    legal: [{ label: "Termos de Uso", href: "#" }, { label: "Política de Privacidade", href: "#" }, { label: "LGPD", href: "#" }],
    contato: [{ label: "contato@contrate-me.com.br", href: "mailto:contato@contrate-me.com.br" }],
  };
  return (
    <footer className="bg-[#060b11] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center mb-5">
              <img
                src="/contrati.png"
                alt="Contratify"
                style={{ height: "32px", width: "auto", objectFit: "contain" }}
              />
            </a>
            <p className="text-white/30 text-sm leading-relaxed mb-6">Contratos profissionais gerados por IA. Rápido, seguro e acessível.</p>
          </div>
          {[{ title: "Produto", items: links.produto }, { title: "Legal", items: links.legal }, { title: "Contato", items: links.contato }].map(({ title, items }) => (
            <div key={title}>
              <h4 className="text-xs font-bold text-white/50 uppercase tracking-[0.15em] mb-5">{title}</h4>
              <ul className="space-y-3">
                {items.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} onClick={link.href.startsWith("#") && link.href !== "#" ? (e) => smoothScrollTo(e, link.href) : undefined} className="text-sm text-white/30 hover:text-white/70 transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">© {currentYear} Contratify. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

// ─────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────
const LandingPage = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCreateContract = () => {
    if (isAuthenticated) {
      navigate("/chat");
    } else {
      onOpenAuth("signup");
    }
  };

  return (
    <div className="min-h-screen bg-[#080d14]">
      <Header onCreateContract={handleCreateContract} onOpenAuth={onOpenAuth} />
      <main>
        <HeroSection onCreateContract={handleCreateContract} />
        <HowItWorksSection />
        <ParallaxBanner />
        <BenefitsSection />
        <TestimonialsSection />
        <PricingSection 
          onCreateContract={handleCreateContract}
          onOpenAuth={onOpenAuth} 
        />
        <FAQSection />
        <CTASection onCreateContract={handleCreateContract} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LandingPage;