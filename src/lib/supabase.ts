import { createClient } from '@supabase/supabase-js'

// Verifica se as variáveis de ambiente existem
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Cria o cliente apenas se as credenciais existirem
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Função helper para verificar se Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabaseUrl !== '' && supabaseAnonKey !== ''
}
