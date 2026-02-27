import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import {
  FileText,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  FileEdit,
  CreditCard,
  Download,
  Shield,
  Clock,
  PiggyBank,
  Smartphone,
  Scale,
  Zap,
  Check,
  Star,
  Mail,
  Instagram,
  Linkedin,
  ChevronDown,
} from "lucide-react";

import Chat from "./Chat";

// ==================== HEADER ====================
const Header = ({ onCreateContract }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Vantagens", href: "#vantagens" },
    { label: "Preços", href: "#precos" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#080d14]/95 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-500/30">
              <img
                src="/robozinho.png"
                alt="Robozinho"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">
              Contrate<span className="text-emerald-400">-me</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={onCreateContract}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25"
            >
              Criar Contrato
            </motion.button>
          </div>

          <button
            className="md:hidden p-2 text-white/80"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 py-4"
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-white/60 hover:text-white px-3 py-3 rounded-lg hover:bg-white/5 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <motion.button
                  onClick={() => { setIsMenuOpen(false); onCreateContract(); }}
                  className="mt-2 px-5 py-3 bg-emerald-500 text-white font-semibold rounded-xl"
                >
                  Criar Contrato
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

// ==================== HERO SECTION ====================
const HeroSection = ({ onCreateContract }) => {
  const benefits = [
    "Juridicamente revisado",
    "Pronto em 2 minutos",
    "Pagamento via Pix",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080d14]">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.15) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 pt-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-emerald-400 tracking-wide">
                Gerado por Inteligência Artificial
              </span>
            </motion.div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Seu contrato{" "}
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                profissional
              </span>
              <br />
              em 2 minutos.
            </h1>

            <p className="text-lg text-white/50 mb-8 max-w-lg leading-relaxed">
              Sem advogados caros. Sem burocracia. Pague via Pix e baixe seu
              contrato personalizado instantaneamente.
            </p>

            <div className="flex flex-wrap gap-5 mb-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm text-white/70 font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={onCreateContract}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-8 py-4 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  boxShadow: "0 0 40px rgba(16,185,129,0.35), 0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                <span>Criar Meu Contrato</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <button className="px-8 py-4 border border-white/10 text-white/70 font-medium rounded-2xl hover:border-white/30 hover:text-white transition-all backdrop-blur-sm">
                Ver Exemplo
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-8 text-sm text-white/30"
            >
              <span className="text-emerald-400 font-semibold">+500 contratos</span>{" "}
              gerados com sucesso
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-2xl scale-110" />

              <div
                className="relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10"
                style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)" }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <span className="text-xl">📄</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        Prestação de Serviços
                      </h3>
                      <p className="text-xs text-white/40">Gerado agora há pouco</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
                    Pronto
                  </span>
                </div>

                {/* Fake content lines */}
                <div className="space-y-3 mb-6">
                  <div className="h-2.5 bg-white/8 rounded-full w-full" />
                  <div className="h-2.5 bg-white/8 rounded-full w-5/6" />
                  <div className="h-2.5 bg-white/5 rounded-full w-4/5" />
                  <div className="h-2.5 bg-white/8 rounded-full w-full" />
                  <div className="h-2.5 bg-white/5 rounded-full w-3/4" />
                  <div className="h-2.5 bg-white/8 rounded-full w-5/6" />
                </div>

                {/* Divider */}
                <div className="h-px bg-white/8 mb-5" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-emerald-400 font-medium">
                      Pronto para download
                    </span>
                  </div>
                  <span className="text-lg font-bold text-white">R$ 19,90</span>
                </div>

                {/* Download bar */}
                <div className="mt-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <div className="flex-1">
                    <div className="h-1.5 bg-emerald-500/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-400 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, delay: 1, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">PDF</span>
                </div>
              </div>
            </motion.div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-6 -left-6 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-2"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">Juridicamente revisado</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -right-4 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-2"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">Pronto em 2 min</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080d14] to-transparent pointer-events-none" />
    </section>
  );
};

// ==================== HOW IT WORKS SECTION ====================
const HowItWorksSection = () => {
  const steps = [
    {
      icon: FileEdit,
      number: "01",
      title: "Preencha os dados",
      description:
        "Responda perguntas simples sobre o tipo de contrato e as partes envolvidas.",
    },
    {
      icon: Sparkles,
      number: "02",
      title: "IA gera o rascunho",
      description:
        "Nossa inteligência artificial cria um contrato personalizado e juridicamente revisado.",
    },
    {
      icon: CreditCard,
      number: "03",
      title: "Pague via Pix",
      description: "Pagamento rápido e seguro. Sem cartão, sem complicação.",
    },
    {
      icon: Download,
      number: "04",
      title: "Baixe seu contrato",
      description:
        "Receba seu contrato em PDF pronto para assinatura em segundos.",
    },
  ];

  return (
    <section id="como-funciona" className="py-28 md:py-40 bg-[#080d14] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(59,130,246,0.2) 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">
            Simples e Rápido
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Como Funciona
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-[#0d1520] p-8 lg:p-10 group hover:bg-[#0f1c2a] transition-colors duration-300"
            >
              <div
                className="absolute top-6 right-6 text-6xl font-black opacity-[0.04] select-none"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {step.number}
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/15 transition-all duration-300">
                <step.icon className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="text-xs font-bold text-emerald-500/60 mb-3 tracking-widest">
                {step.number}
              </div>
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

// ==================== BENEFITS SECTION ====================
const BenefitsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Juridicamente Revisado",
      description:
        "Todos os contratos seguem padrões legais brasileiros e são revisados por especialistas.",
    },
    {
      icon: PiggyBank,
      title: "Economia de até 90%",
      description:
        "Pague uma fração do valor cobrado por advogados tradicionais.",
    },
    {
      icon: Clock,
      title: "Disponível 24h",
      description:
        "Gere seu contrato a qualquer hora, qualquer dia. Sem espera, sem agendamento.",
    },
    {
      icon: Zap,
      title: "Pronto em Minutos",
      description:
        "Tecnologia de IA avançada que gera contratos personalizados em tempo recorde.",
    },
    {
      icon: Smartphone,
      title: "100% Online",
      description:
        "Acesse de qualquer dispositivo. Sem downloads, sem instalações.",
    },
    {
      icon: Scale,
      title: "Vários Tipos de Contratos",
      description: "Prestação de serviços, aluguel, parceria e muito mais.",
    },
  ];

  return (
    <section id="vantagens" className="py-28 md:py-40 bg-[#0a1018] relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 100% 50%, #10b981 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">
              Por que escolher
            </span>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Vantagens do<br />
              <span style={{
                background: "linear-gradient(135deg, #10b981, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>Contrate-me</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/40 max-w-xs leading-relaxed text-sm lg:text-right"
          >
            A forma mais inteligente de criar contratos profissionais sem complicação.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all duration-400"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(16,185,129,0.05) 0%, transparent 60%)" }} />

              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-emerald-500/40 transition-all duration-300">
                  <benefit.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2.5">{benefit.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== PRICING SECTION ====================
const PricingSection = ({ onCreateContract }) => {
  const plans = [
    {
      name: "Contrato Único",
      price: "19,90",
      description: "Ideal para uma necessidade pontual",
      features: [
        "1 contrato personalizado",
        "Gerado por IA avançada",
        "Revisão jurídica incluída",
        "Download imediato em PDF",
        "Suporte por e-mail",
      ],
      popular: false,
      cta: "Criar Contrato",
    },
    {
      name: "Pack 3 Contratos",
      price: "49,90",
      originalPrice: "59,70",
      description: "Melhor custo-benefício",
      features: [
        "3 contratos personalizados",
        "Gerado por IA avançada",
        "Revisão jurídica incluída",
        "Download imediato em PDF",
        "Suporte prioritário",
        "Economia de R$ 9,80",
      ],
      popular: true,
      cta: "Escolher Pack",
    },
  ];

  return (
    <section id="precos" className="py-28 md:py-40 bg-[#080d14] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 60%)" }} />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">
            Preços Transparentes
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Escolha o Melhor Plano
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">
            Sem mensalidades. Sem surpresas. Pague apenas pelo que usar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-[#080d14] shadow-lg whitespace-nowrap"
                    style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
                    <Star className="w-3 h-3 fill-current" />
                    Mais Popular
                  </div>
                </div>
              )}

              <div
                className={`relative rounded-3xl p-8 h-full flex flex-col transition-all duration-300 ${
                  plan.popular
                    ? "border border-emerald-500/40 bg-emerald-500/5"
                    : "border border-white/8 bg-white/[0.02] hover:border-white/15"
                }`}
                style={plan.popular ? {
                  boxShadow: "0 0 60px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.05)"
                } : {}}
              >
                {plan.popular && (
                  <div className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 60%)" }} />
                )}

                <div className="relative">
                  <div className="mb-8 pt-3">
                    <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-sm text-white/40">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-white/40 font-medium">R$</span>
                      <span className="text-6xl font-black text-white leading-none"
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        {plan.price}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <p className="text-sm text-white/30 mt-2">
                        <span className="line-through">R$ {plan.originalPrice}</span>
                        <span className="text-emerald-400 ml-2 font-medium">— economize R$ 9,80</span>
                      </p>
                    )}
                  </div>

                  <div className="h-px bg-white/6 mb-8" />

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.popular ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-white/8 border border-white/10"
                        }`}>
                          <Check className={`w-2.5 h-2.5 ${plan.popular ? "text-emerald-400" : "text-white/40"}`} />
                        </div>
                        <span className="text-sm text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    onClick={onCreateContract}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                    style={plan.popular ? {
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "white",
                      boxShadow: "0 4px 24px rgba(16,185,129,0.3)",
                    } : {
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {plan.popular && <Sparkles className="w-4 h-4" />}
                    {plan.cta}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/8">
            <span className="text-xl">💳</span>
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

// ==================== FAQ SECTION ====================
const FAQSection = () => {
  const [openItem, setOpenItem] = useState(null);

  const faqs = [
    {
      question: "Os contratos são válidos juridicamente?",
      answer:
        "Sim! Todos os nossos contratos são elaborados seguindo as normas do Código Civil Brasileiro e são revisados por especialistas jurídicos. Eles possuem validade legal para uso em acordos formais entre partes.",
    },
    {
      question: "Como funciona o pagamento via Pix?",
      answer:
        "Após preencher os dados do seu contrato, você receberá um QR Code ou código Pix para pagamento. A aprovação é instantânea e, assim que confirmado, seu contrato estará disponível para download imediatamente.",
    },
    {
      question: "Quais tipos de contratos posso gerar?",
      answer:
        "Oferecemos diversos modelos: Prestação de Serviços, Contrato de Aluguel, Acordo de Parceria, Contrato de Trabalho Freelancer, Termo de Confidencialidade (NDA), entre outros. Novos modelos são adicionados frequentemente.",
    },
    {
      question: "Posso editar o contrato depois de gerado?",
      answer:
        "Sim! O contrato é entregue em formato PDF editável. Você pode fazer ajustes menores diretamente no documento. Para alterações mais significativas, recomendamos gerar um novo contrato com as informações atualizadas.",
    },
    {
      question: "E se eu precisar de ajuda com meu contrato?",
      answer:
        "Nossa equipe de suporte está disponível por e-mail para tirar dúvidas sobre o uso da plataforma e dos contratos gerados. Para questões jurídicas específicas, recomendamos consultar um advogado.",
    },
    {
      question: "Existe limite de contratos por mês?",
      answer:
        "Não! Você pode gerar quantos contratos precisar. Cada contrato é cobrado individualmente, ou você pode aproveitar nossos packs com desconto para múltiplos contratos.",
    },
  ];

  return (
    <section id="faq" className="py-28 md:py-40 bg-[#0a1018] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:w-72 flex-shrink-0"
          >
            <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">
              Dúvidas Frequentes
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Perguntas e Respostas
            </h2>
          </motion.div>

          {/* Right column - FAQ items */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-3"
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openItem === index
                    ? "border-emerald-500/25 bg-emerald-500/5"
                    : "border-white/6 bg-white/[0.02] hover:border-white/12"
                }`}
              >
                <button
                  onClick={() => setOpenItem(openItem === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-white/80 hover:text-white transition-colors"
                >
                  <span className="text-sm leading-relaxed pr-4">{faq.question}</span>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openItem === index ? "bg-emerald-500/20 rotate-180" : "bg-white/5"
                  }`}>
                    <ChevronDown className={`w-4 h-4 ${openItem === index ? "text-emerald-400" : "text-white/40"}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {openItem === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm text-white/40 leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ==================== CTA SECTION ====================
const CTASection = ({ onCreateContract }) => {
  return (
    <section className="py-28 md:py-40 bg-[#080d14] relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.12) 0%, transparent 60%)" }} />

      <div
        className="absolute inset-6 md:inset-12 rounded-3xl border border-emerald-500/10 pointer-events-none"
        style={{ background: "rgba(16,185,129,0.02)" }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-10 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Comece agora mesmo</span>
          </div>

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Pronto para criar seu<br />
            <span style={{
              background: "linear-gradient(135deg, #10b981, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>contrato profissional?</span>
          </h2>

          <p className="text-white/40 mb-12 max-w-lg mx-auto leading-relaxed">
            Junte-se a centenas de pessoas que já simplificaram a criação de contratos com o Contrate-me.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm text-white/60 font-medium">100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <Clock className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm text-white/60 font-medium">Pronto em 2 minutos</span>
            </div>
          </div>

          <motion.button
            onClick={onCreateContract}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group px-10 py-5 text-white font-bold rounded-2xl flex items-center justify-center mx-auto gap-2 text-base"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 0 60px rgba(16,185,129,0.35), 0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            Criar Meu Contrato Agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <p className="mt-6 text-sm text-white/25">
            A partir de R$ 19,90 • Pagamento via Pix
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ==================== FOOTER ====================
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    produto: [
      { label: "Como Funciona", href: "#como-funciona" },
      { label: "Preços", href: "#precos" },
      { label: "FAQ", href: "#faq" },
    ],
    legal: [
      { label: "Termos de Uso", href: "#" },
      { label: "Política de Privacidade", href: "#" },
      { label: "LGPD", href: "#" },
    ],
    contato: [
      { label: "contato@contrate-me.com.br", href: "mailto:contato@contrate-me.com.br" },
    ],
  };

  return (
    <footer className="bg-[#060b11] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center overflow-hidden">
                <img src="/robozinho.png" alt="Robozinho" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-semibold text-white">
                Contrate<span className="text-emerald-400">-me</span>
              </span>
            </a>
            <p className="text-white/30 text-sm leading-relaxed mb-6">
              Contratos profissionais gerados por IA. Rápido, seguro e acessível.
            </p>
            <div className="flex gap-2">
              {[
                { href: "#", icon: Instagram, label: "Instagram" },
                { href: "#", icon: Linkedin, label: "LinkedIn" },
                { href: "mailto:contato@contrate-me.com.br", icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 text-white/40" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Produto", items: links.produto },
            { title: "Legal", items: links.legal },
            { title: "Contato", items: links.contato },
          ].map(({ title, items }) => (
            <div key={title}>
              <h4 className="text-xs font-bold text-white/50 uppercase tracking-[0.15em] mb-5">{title}</h4>
              <ul className="space-y-3">
                {items.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-white/30 hover:text-white/70 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">
            © {currentYear} Contrate-me. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/20">Feito com 💚 no Brasil</p>
        </div>
      </div>
    </footer>
  );
};

// ==================== MAIN APP ====================
const LandingPage = () => {
  const navigate = useNavigate();
  const handleCreateContract = () => navigate("/chat");

  return (
    <div className="min-h-screen bg-[#080d14]">
      <Header onCreateContract={handleCreateContract} />
      <main>
        <HeroSection onCreateContract={handleCreateContract} />
        <HowItWorksSection />
        <BenefitsSection />
        <PricingSection onCreateContract={handleCreateContract} />
        <FAQSection />
        <CTASection onCreateContract={handleCreateContract} />
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  </BrowserRouter>
);

export default App;