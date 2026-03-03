import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // DEBUG: Ver o que tem no localStorage
    const token = localStorage.getItem('sb-auth-token');
    console.log('🔍 Token no localStorage:', token ? 'Existe' : 'Não existe');

    // Pega a sessão atual ao montar
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🔍 Sessão recuperada:', session ? 'Sim' : 'Não');
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escuta mudanças de auth (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state changed:', event, session?.user?.email);
      
      // DEBUG: Ver o token após mudança
      const token = localStorage.getItem('sb-auth-token');
      console.log('🔍 Token após mudança:', token ? 'Salvo' : 'Não salvo');
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({ email, password, name }) => {
    try {
      console.log('📝 Tentando cadastrar:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });
      
      if (error) throw error;
      
      console.log('✅ Cadastro realizado:', data);
      
      // DEBUG: Ver token após cadastro
      const token = localStorage.getItem('sb-auth-token');
      console.log('🔍 Token após cadastro:', token ? 'Salvo' : 'Não salvo');
      
      return { data, error: null };
    } catch (error) {
      console.error('❌ Erro no signUp:', error);
      return { data: null, error };
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      console.log('🔑 Tentando login:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos');
        }
        throw error;
      }
      
      console.log('✅ Login realizado:', data);
      
      // DEBUG: Ver token após login
      const token = localStorage.getItem('sb-auth-token');
      console.log('🔍 Token após login:', token ? 'Salvo' : 'Não salvo');
      
      return { data, error: null };
    } catch (error) {
      console.error('❌ Erro no signIn:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('👋 Logout realizado');
      return { error: null };
    } catch (error) {
      console.error('❌ Erro no signOut:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};