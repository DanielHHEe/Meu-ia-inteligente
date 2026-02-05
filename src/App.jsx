import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

// ==================== HEADER ====================
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]
  );
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.08)"]
  );

  const navLinks = [
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Vantagens", href: "#vantagens" },
    { label: "Preços", href: "#precos" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <motion.header
      style={{ backgroundColor: headerBackground, boxShadow: headerShadow }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
    >
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.a
            href="#"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FileText className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Contrate-me
            </span>
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {link.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"
                />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:block">
            <motion.a
              href="#precos"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
              />
              Criar Contrato
            </motion.a>
          </div>

          <motion.button
            className="md:hidden p-2 text-gray-700 hover:text-emerald-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 pb-4 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-emerald-600 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#precos"
              className="block text-center py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Criar Contrato
            </motion.a>
          </motion.div>
        )}
      </nav>
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
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md mb-6 border border-emerald-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                Gerado por Inteligência Artificial
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Seu contrato profissional em{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                2 minutos
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Sem advogados caros. Sem burocracia. Pague via Pix e baixe seu
              contrato personalizado instantaneamente.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.a
                href="#precos"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Criar Meu Contrato
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.a>
              <motion.a
                href="#exemplo"
                className="px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Exemplo
              </motion.a>
            </motion.div>

            <motion.p
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="font-bold text-emerald-600">+500 contratos</span>{" "}
              gerados com sucesso
            </motion.p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-10 rounded-bl-full" />

              <div className="relative">
                <motion.div
                  className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-lg">
                    📄
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      Contrato de Prestação de Serviços
                    </h3>
                    <p className="text-sm text-gray-500">
                      Gerado em 03/02/2026
                    </p>
                  </div>
                </motion.div>

                <div className="space-y-3 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full"
                      style={{ width: `${100 - i * 8}%` }}
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.7 + i * 0.05, duration: 0.5 }}
                    />
                  ))}
                </div>

                <motion.div
                  className="flex items-center justify-between pt-6 border-t border-gray-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">
                      Pronto para download
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    R$ 19,90
                  </div>
                </motion.div>
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
                animate={{
                  rotate: [0, -5, 0],
                  y: [0, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                ⚡ Rápido
              </motion.div>
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
      description:
        "Pagamento rápido e seguro. Sem cartão, sem complicação.",
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
    <section id="como-funciona" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-sm mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Simples e Rápido
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
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
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <motion.div
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 relative overflow-hidden h-full"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      className="text-6xl font-bold text-emerald-100"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {step.number}
                    </motion.div>
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <step.icon className="w-7 h-7 text-white" />
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connection line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-300 to-transparent" />
                )}
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
      description:
        "Prestação de serviços, aluguel, parceria e muito mais.",
    },
  ];

  return (
    <section id="vantagens" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-semibold text-sm mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Por que escolher
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Vantagens do Contrate-me
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A forma mais inteligente de criar contratos profissionais sem
            complicação.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 h-full relative overflow-hidden"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300"
                />

                <div className="relative">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <benefit.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
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
    <section id="precos" className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(16,185,129,0.05)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(20,184,166,0.05)_0%,_transparent_50%)]" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-sm mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Preços Transparentes
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Escolha o Melhor Plano
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sem mensalidades. Sem surpresas. Pague apenas pelo que usar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              {plan.popular && (
                <motion.div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 z-10"
                  initial={{ y: -10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                    <Star className="w-4 h-4 fill-white" />
                    Mais Popular
                  </div>
                </motion.div>
              )}

              <motion.div
                className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 overflow-hidden h-full ${
                  plan.popular
                    ? "border-emerald-500 scale-105"
                    : "border-gray-100"
                }`}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {plan.popular && (
                  <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600" />
                )}

                <div className="p-8">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600">{plan.description}</p>

                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-gray-600 text-lg">R$</span>
                      <span className="text-5xl font-extrabold text-gray-900">
                        {plan.price}
                      </span>
                    </div>

                    {plan.originalPrice && (
                      <motion.div
                        className="mt-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 line-through text-sm">
                            R$ {plan.originalPrice}
                          </span>
                          <span className="text-emerald-600 font-semibold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                            Economize R$ 9,80
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.a
                    href="#"
                    className={`block w-full py-4 rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {plan.cta}
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 font-medium">
            Pagamento seguro via
          </p>
          <div className="flex items-center justify-center gap-3 text-emerald-600 font-bold">
            <span className="text-2xl">💳</span>
            <span>Pix</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-2">
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
    <section id="faq" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-4xl mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-semibold text-sm mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Dúvidas Frequentes
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Perguntas e Respostas
          </h2>
          <p className="text-xl text-gray-600">
            Tudo que você precisa saber sobre o Contrate-me.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <motion.button
                onClick={() => setOpenItem(openItem === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
                whileHover={{ x: 5 }}
              >
                <span className="pr-8">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openItem === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                </motion.div>
              </motion.button>
              <motion.div
                initial={false}
                animate={{
                  height: openItem === index ? "auto" : 0,
                  opacity: openItem === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              </motion.div>
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
    <section className="py-20 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600" />
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "50px 50px"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-5xl mx-auto px-6 relative">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">
              Comece agora mesmo
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl lg:text-5xl font-extrabold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Pronto para criar seu contrato profissional?
          </motion.h2>

          <motion.p
            className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Junte-se a centenas de pessoas que já simplificaram a criação de
            contratos com o Contrate-me.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">100% Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Pronto em 2 minutos</span>
            </div>
          </motion.div>

          <motion.a
            href="#precos"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all group"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Criar Meu Contrato Agora
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </motion.a>

          <motion.p
            className="text-white/80 mt-6 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
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
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Contrate-me</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Contratos profissionais gerados por IA. Rápido, seguro e
              acessível.
            </p>
            <div className="flex gap-3">
              <motion.a
                href="https://instagram.com"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:contato@contrate-me.com.br"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Email"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold mb-4 text-lg">Produto</h3>
            <ul className="space-y-3">
              {links.produto.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold mb-4 text-lg">Legal</h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold mb-4 text-lg">Contato</h3>
            <ul className="space-y-3">
              {links.contato.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Pagamento seguro via Pix</span>
            </div>
          </motion.div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {currentYear} Contrate-me. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1">
              Feito com <span className="text-emerald-500">💚</span> no Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ==================== MAIN APP ====================
const App = () => (
  <div className="font-sans antialiased">
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