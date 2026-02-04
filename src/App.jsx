import { useState } from "react";
import { motion } from "framer-motion";
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
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#1e3a5f]">
              Contrate-me
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#1e3a5f] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg">
              Criar Contrato
            </button>
          </div>

          <button
            className="md:hidden p-2 text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-[#1e3a5f] transition-colors px-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button className="mt-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl">
                Criar Contrato
              </button>
            </nav>
          </motion.div>
        )}
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
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-white">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                Gerado por Inteligência Artificial
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1e3a5f] leading-tight mb-6">
              Seu contrato profissional em{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">
                2 minutos
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Sem advogados caros. Sem burocracia. Pague via Pix e baixe seu
              contrato personalizado instantaneamente.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-800">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center">
                Criar Meu Contrato
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-all">
                Ver Exemplo
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-sm text-gray-500"
            >
              <span className="text-amber-600 font-semibold">+500 contratos</span>{" "}
              gerados com sucesso
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Contrato de Prestação de Serviços
                    </h3>
                    <p className="text-sm text-gray-500">
                      Gerado em 03/02/2026
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-3 bg-gray-100 rounded-full w-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-5/6" />
                  <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                  <div className="h-3 bg-gray-100 rounded-full w-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600">
                        Pronto para download
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#1e3a5f]">
                      R$ 19,90
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-200 rounded-full blur-2xl opacity-50" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-200 rounded-full blur-2xl opacity-50" />
            </div>
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
    <section id="como-funciona" className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4">
            Simples e Rápido
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">
            Como Funciona
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Em apenas 4 passos simples, você terá um contrato profissional
            pronto para uso.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <span className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  {step.number}
                </span>

                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                  <step.icon className="w-7 h-7 text-emerald-600" />
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
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
    <section id="vantagens" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4">
            Por que escolher
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">
            Vantagens do Contrate-me
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A forma mais inteligente de criar contratos profissionais sem
            complicação.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 h-full">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-7 h-7 text-emerald-600" />
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
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
    <section id="precos" className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4">
            Preços Transparentes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">
            Escolha o Melhor Plano
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sem mensalidades. Sem surpresas. Pague apenas pelo que usar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-[90%] sm:w-auto">
                  <div className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Mais Popular</span>
                  </div>
                </div>
              )}

              <div
                className={`bg-white rounded-2xl p-6 lg:p-8 shadow-lg border-2 transition-all duration-300 h-full ${
                  plan.popular
                    ? "border-emerald-500 shadow-xl pt-10 sm:pt-8 md:pt-6"
                    : "border-gray-100 hover:border-emerald-200"
                }`}
              >
                <div className="text-center mb-6 pb-6 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg text-gray-500">R$</span>
                    <span className="text-5xl font-bold text-[#1e3a5f]">
                      {plan.price}
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        <span className="line-through">R$ {plan.originalPrice}</span>
                        <span className="text-emerald-600 ml-2 font-medium">
                          Economize R$ 9,80
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-sm leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all text-sm md:text-base ${
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
                      : "border-2 border-gray-300 text-gray-700 hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
                  }`}
                >
                  {plan.popular && (
                    <Sparkles className="w-4 h-4 mr-2 inline align-middle" />
                  )}
                  {plan.cta}
                </button>
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
          <p className="text-sm text-gray-500 mb-4">
            Pagamento seguro via
          </p>
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
            <span className="text-2xl">💳</span>
            <span className="font-semibold text-emerald-600">Pix</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">
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
    <section id="faq" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-4">
            Perguntas e Respostas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tudo que você precisa saber sobre o Contrate-me.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenItem(openItem === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
              >
                {faq.question}
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openItem === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openItem === index && (
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ==================== CTA SECTION ====================
const CTASection = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-[#1e3a5f] via-[#1a3360] to-[#0f1f33] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              Comece agora mesmo
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 px-4">
            Pronto para criar seu contrato profissional?
          </h2>

          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto px-4">
            Junte-se a centenas de pessoas que já simplificaram a criação de
            contratos com o Contrate-me.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10 px-4">
            <div className="flex items-center gap-2 text-white/90">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium">100% Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium">Pronto em 2 minutos</span>
            </div>
          </div>

          <button className="group px-6 md:px-8 py-4 bg-white text-[#1e3a5f] font-bold rounded-xl hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center mx-auto text-sm md:text-base">
            Criar Meu Contrato Agora
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-6 text-sm text-white/60 px-4">
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
    <footer className="bg-[#1e3a5f] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="py-12 md:py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">
                Contrate-me
              </span>
            </a>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Contratos profissionais gerados por IA. Rápido, seguro e
              acessível.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@contrate-me.com.br"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-3">
              {links.produto.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              {links.contato.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-white/60">
                Pagamento seguro via <span className="text-emerald-400 font-semibold">Pix</span>
              </p>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60">
              © {currentYear} Contrate-me. Todos os direitos reservados.
            </p>
            <p className="text-sm text-white/60">
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
  <div className="min-h-screen bg-white">
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