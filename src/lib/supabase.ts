import { createClient } from '@supabase/supabase-js'

// 1. Cole aqui o endereço do seu projeto (copie do seu .env local)
const supabaseUrl = "https://kiiucbkhzkagfklpnkwd.supabase.co"

// 2. Cole aqui a sua chave anônima longa (copie do seu .env local)
const supabaseAnonKey = "sb_publishable_6giw-sLMTU8AL_hmpr6AuA_1usS3T0S"

// Inicialização direta, sem depender do 'import.meta.env'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)