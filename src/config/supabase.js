import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Configuração explícita para salvar no localStorage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,  // Isso salva no localStorage
    detectSessionInUrl: true,
    storage: localStorage,  // Explicitamente usando localStorage
    storageKey: 'sb-auth-token', // Nome da chave no localStorage
  }
})