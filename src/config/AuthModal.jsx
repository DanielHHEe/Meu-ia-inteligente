import { useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { useNavigate } from "react-router-dom"

//////////////////////////////
// 1. SISTEMA DE TOASTS
//////////////////////////////

const Toast = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <div
      className={`
        group flex items-start gap-3 w-full max-w-sm 
        backdrop-blur-xl border rounded-xl shadow-2xl p-4 
        transition-all duration-500 ease-out transform translate-x-0 opacity-100
        animate-slideIn
        ${
          toast.type === "success"
            ? "bg-slate-900/90 border-emerald-500/30 text-emerald-400"
            : "bg-slate-900/90 border-rose-500/30 text-rose-400"
        }
      `}
    >
      <div className={`mt-0.5 ${toast.type === "success" ? "text-emerald-400" : "text-rose-400"}`}>
        {toast.type === "success" ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-medium text-white leading-relaxed">
          {toast.message}
        </p>
      </div>
      <button 
        onClick={() => onRemove(toast.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-white"
      >
        ✕
      </button>
    </div>
  )
}

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-4 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  )
}

//////////////////////////////
// 2. COMPONENTE DE INPUT
//////////////////////////////

const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3.5 rounded-lg bg-slate-800/50 border border-slate-700 text-base text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200
        focus:border-emerald-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]
        [@media(max-width:768px)]:text-base [@media(max-width:768px)]:text-slate-100"
        style={{ fontSize: '16px' }}
      />
    </div>
  )
}

//////////////////////////////
// 3. AUTH MODAL
//////////////////////////////

const AuthModal = ({
  isOpen,
  onClose,
  initialMode = "login",
  onSuccess,
}) => {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const [toasts, setToasts] = useState([])

  useEffect(() => {
    setMode(initialMode)
    setEmail("")
    setPassword("")
    setName("")
  }, [initialMode, isOpen])

  if (!isOpen) return null

  const addToast = (message, type = "error") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validações
      if (!email || !password) throw new Error("Por favor, preencha todos os campos.")
      if (mode === "signup" && !name) throw new Error("Por favor, preencha seu nome.")
      if (password.length < 6) throw new Error("A senha deve ter pelo menos 6 caracteres.")

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) throw new Error("Por favor, insira um e-mail válido.")

      // Ação
      const result =
        mode === "login"
          ? await signIn({ email, password })
          : await signUp({ email, password, name })

      if (result.error) {
        throw new Error(result.error.message || "Erro ao processar a solicitação.")
      }

      // Sucesso
      addToast(
        mode === "login"
          ? "Login realizado com sucesso!"
          : "Conta criada com sucesso!",
        "success"
      )

      // Delay para o usuário ver o toast antes de redirecionar
      setTimeout(() => {
        onSuccess?.() // Fecha o modal
        navigate("/chat") // Redireciona para o chat
      }, 1500)

    } catch (err) {
      addToast(err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toasts Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Overlay */}
      <div
        onClick={(e) => e.target === e.currentTarget && onClose()}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        {/* Modal Card */}
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative animate-modalIn overflow-hidden">
          
          {/* Efeito de brilho no fundo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              {mode === "login" ? "Bem-vindo de volta" : "Criar conta"}
            </h2>
            <p className="text-sm text-slate-400">
              {mode === "login"
                ? "Acesse sua conta para gerenciar seus contratos"
                : "Junte-se a nós e comece agora mesmo"}
            </p>
          </div>

          {/* Tabs / Toggle */}
          <div className="flex bg-slate-800/50 rounded-xl p-1 mb-8 border border-slate-800">
            {["login", "signup"].map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`
                  flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                  ${
                    mode === tab
                      ? "bg-slate-700 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }
                `}
              >
                {tab === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <InputField
                label="Nome Completo"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
                required
              />
            )}

            <InputField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />

            <InputField
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </>
              ) : (
                mode === "login" ? "Entrar" : "Criar conta"
              )}
            </button>
          </form>

          {/* Switch */}
          <div className="text-center text-sm text-slate-400 mt-6">
            {mode === "login"
              ? "Não tem uma conta?"
              : "Já tem uma conta?"}{" "}
            <button
              onClick={() =>
                setMode(mode === "login" ? "signup" : "login")
              }
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              {mode === "login"
                ? "Criar agora"
                : "Fazer login"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-modalIn {
          animation: modalIn 0.3s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default AuthModal