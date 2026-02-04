import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowUpRight,
  Play,
} from "lucide-react";

// ==================== FLOATING PARTICLES ====================
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${i % 2 === 0 ? '#10b981' : '#6366f1'}, ${i % 2 === 0 ? '#059669' : '#4f46e5'})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.3,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ==================== ANIMATED GRADIENT TEXT ====================
const GradientText = ({ children, className = "" }) => (
  <motion.span
    className={`bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent ${className}`}
    animate={{
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{ backgroundSize: "200% 200%" }}
  >
    {children}
  </motion.span>
);

// ==================== HEADER ====================
const Header = () => {
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-emerald-500/5 border-b border-emerald-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.a
            href="#"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FileText className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Contrate-me
            </span>
          </motion.a>

          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-gray-600 font-medium rounded-xl hover:text-emerald-600 transition-colors group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {link.label}
                <motion.span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-3/4 transition-all duration-300"
                />
              </motion.a>
            ))}
          </nav>

          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.a
              href="#criar"
              className="relative inline-flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-2xl overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              />
              <span className="relative z-10">Criar Contrato</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>

          <motion.button
            className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden pb-6"
            >
              <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-100">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#criar"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 px-4 py-3 text-center font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  Criar Contrato
                </motion.a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

// ==================== HERO SECTION ====================
const HeroSection = () => {
  const benefits = [
    "Juridicamente revisado",
    "Pronto em 2 minutos",
    "Pagamento via Pix",
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50" />
      <FloatingParticles />
      
      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 -right-32 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </motion.div>
              <span className="text-sm font-semibold text-emerald-700">
                Gerado por Inteligência Artificial
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Seu contrato profissional em{" "}
              <GradientText>2 minutos</GradientText>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Sem advogados caros. Sem burocracia. Pague via Pix e baixe seu
              contrato personalizado instantaneamente.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-lg shadow-emerald-500/10 border border-emerald-100"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.a
                href="#criar"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                />
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
                  }}
                />
                <span className="relative z-10">Criar Meu Contrato</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              <motion.a
                href="#exemplo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-gray-700 rounded-2xl bg-white border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5 text-emerald-500" />
                Ver Exemplo
              </motion.a>
            </motion.div>

            <motion.p
              className="mt-8 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <span className="font-bold text-emerald-600">+500 contratos</span>{" "}
              gerados com sucesso
            </motion.p>
          </motion.div>

          {/* Right Content - Contract Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl shadow-emerald-500/20 p-8 border border-emerald-100 overflow-hidden"
              whileHover={{ y: -10, boxShadow: "0 40px 80px -20px rgba(16, 185, 129, 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
              
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-2xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  📄
                </motion.div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Contrato de Prestação de Serviços
                  </h3>
                  <p className="text-sm text-gray-500">
                    Gerado em 04/02/2026
                  </p>
                </div>
              </div>

              {/* Animated skeleton lines */}
              <div className="space-y-3 mb-8">
                {[100, 95, 80, 90, 70, 85].map((width, index) => (
                  <motion.div
                    key={index}
                    className="h-3 rounded-full bg-gradient-to-r from-gray-100 to-gray-200"
                    style={{ width: `${width}%` }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-emerald-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-emerald-600">
                    Pronto para download
                  </span>
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  R$ 19,90
                </span>
              </div>
            </motion.div>

            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-lg"
              animate={{ y: [0, -5, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⚡ Rápido
            </motion.div>
            
            <motion.div
              className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl bg-white text-sm font-bold shadow-lg border border-emerald-100"
              animate={{ y: [0, 5, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-700">100% Seguro</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
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
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Sparkles,
      number: "02",
      title: "IA gera o rascunho",
      description:
        "Nossa inteligência artificial cria um contrato personalizado e juridicamente revisado.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: CreditCard,
      number: "03",
      title: "Pague via Pix",
      description:
        "Pagamento rápido e seguro. Sem cartão, sem complicação.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Download,
      number: "04",
      title: "Baixe seu contrato",
      description:
        "Receba seu contrato em PDF pronto para assinatura em segundos.",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <section id="como-funciona" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Simples e Rápido
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Em apenas 4 passos simples, você terá um contrato profissional
            pronto para uso.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <motion.div
                className="relative h-full bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 group overflow-hidden"
                whileHover={{ y: -10, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.15)" }}
              >
                {/* Background gradient on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />
                
                <span className={`text-6xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-20`}>
                  {step.number}
                </span>

                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
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
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: PiggyBank,
      title: "Economia de até 90%",
      description:
        "Pague uma fração do valor cobrado por advogados tradicionais.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Clock,
      title: "Disponível 24h",
      description:
        "Gere seu contrato a qualquer hora, qualquer dia. Sem espera, sem agendamento.",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: Zap,
      title: "Pronto em Minutos",
      description:
        "Tecnologia de IA avançada que gera contratos personalizados em tempo recorde.",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: Smartphone,
      title: "100% Online",
      description:
        "Acesse de qualquer dispositivo. Sem downloads, sem instalações.",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: Scale,
      title: "Vários Tipos de Contratos",
      description:
        "Prestação de serviços, aluguel, parceria e muito mais.",
      gradient: "from-indigo-500 to-violet-600",
    },
  ];

  return (
    <section id="vantagens" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <FloatingParticles />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold mb-4 border border-emerald-500/30"
            whileHover={{ scale: 1.05 }}
          >
            Por que escolher
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Vantagens do <GradientText>Contrate-me</GradientText>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A forma mais inteligente de criar contratos profissionais sem
            complicação.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="relative h-full p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 group overflow-hidden"
                whileHover={{ 
                  y: -5, 
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                <motion.div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <benefit.icon className="w-7 h-7 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {benefit.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== PRICING SECTION ====================
const PricingSection = () => {
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
    <section id="precos" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Preços Transparentes
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            Escolha o Melhor <GradientText>Plano</GradientText>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sem mensalidades. Sem surpresas. Pague apenas pelo que usar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-lg">
                    <Star className="w-4 h-4" />
                    Mais Popular
                  </span>
                </motion.div>
              )}

              <motion.div
                className={`h-full p-8 rounded-3xl ${
                  plan.popular
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20"
                    : "bg-white border-2 border-gray-100 shadow-xl"
                }`}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={plan.popular ? "text-gray-400" : "text-gray-600"}>
                    {plan.description}
                  </p>
                  <div className="mt-6">
                    <span className={`text-sm ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>R$</span>
                    <span className={`text-5xl font-black ${plan.popular ? "text-white" : "text-gray-900"}`}>
                      {plan.price}
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-500 line-through text-sm">
                        R$ {plan.originalPrice}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                        Economize R$ 9,80
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <motion.li
                      key={feature}
                      className="flex items-center gap-3"
                      whileHover={{ x: 5 }}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        plan.popular ? "bg-emerald-500/20" : "bg-emerald-100"
                      }`}>
                        <Check className={`w-4 h-4 ${plan.popular ? "text-emerald-400" : "text-emerald-600"}`} />
                      </div>
                      <span className={plan.popular ? "text-gray-300" : "text-gray-600"}>
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  className={`w-full py-4 rounded-2xl font-bold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.popular && <Zap className="inline w-5 h-5 mr-2" />}
                  {plan.cta}
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 mb-4">Pagamento seguro via</p>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white shadow-lg border border-gray-100">
            <span className="text-2xl">💳</span>
            <span className="font-bold text-gray-800">Pix</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-emerald-600 font-medium">
              Aprovação instantânea
            </span>
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
    <section id="faq" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Dúvidas Frequentes
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            Perguntas e <GradientText>Respostas</GradientText>
          </h2>
          <p className="text-xl text-gray-600">
            Tudo que você precisa saber sobre o Contrate-me.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl bg-white border border-gray-100 shadow-lg overflow-hidden"
            >
              <motion.button
                onClick={() => setOpenItem(openItem === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
                whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
              >
                {faq.question}
                <motion.div
                  animate={{ rotate: openItem === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-emerald-500" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {openItem === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== CTA SECTION ====================
const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900" />
      <FloatingParticles />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">
              Comece agora mesmo
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Pronto para criar seu contrato{" "}
            <GradientText>profissional?</GradientText>
          </h2>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de pessoas que já simplificaram a criação de
            contratos com o Contrate-me.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <motion.div
              className="flex items-center gap-2 text-gray-400"
              whileHover={{ scale: 1.05, color: "#10b981" }}
            >
              <Shield className="w-5 h-5 text-emerald-500" />
              100% Seguro
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-gray-400"
              whileHover={{ scale: 1.05, color: "#10b981" }}
            >
              <Zap className="w-5 h-5 text-emerald-500" />
              Pronto em 2 minutos
            </motion.div>
          </div>

          <motion.a
            href="#criar"
            className="group relative inline-flex items-center gap-2 px-10 py-5 font-bold text-white text-lg rounded-2xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            />
            <span className="relative z-10">Criar Meu Contrato Agora</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </motion.a>

          <motion.p
            className="mt-8 text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            A partir de R$ 19,90 • Pagamento via Pix
          </motion.p>
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
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <motion.a
              href="#"
              className="flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Contrate-me
              </span>
            </motion.a>
            <p className="text-gray-400 mb-6">
              Contratos profissionais gerados por IA. Rápido, seguro e
              acessível.
            </p>
            <div className="flex gap-3">
              {[Instagram, Linkedin, Mail].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                </motion.a>
              ))}
            </div>
          </div>

          {[
            { title: "Produto", items: links.produto },
            { title: "Legal", items: links.legal },
            { title: "Contato", items: links.contato },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.items.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
              {section.title === "Contato" && (
                <div className="mt-6 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400">
                    Pagamento seguro via Pix
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Contrate-me. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm">
              Feito com 💚 no Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ==================== MAIN APP ====================
const App = () => (
  <div className="min-h-screen bg-white font-sans antialiased">
    <Header />
    <main>
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default App;
