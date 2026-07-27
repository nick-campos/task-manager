import { createClient } from '@supabase/supabase-js'

// 1. Cole aqui o endereço do seu projeto (copie do seu .env local)
const supabaseUrl = "https://kiiucbkhzkagfklpnkwd.supabase.co"

// 2. Cole aqui a sua chave anônima longa (copie do seu .env local)
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpaXVjYmtoemthZ2ZrbHBua3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMjk1OTMsImV4cCI6MjA5MjkwNTU5M30.lhlv9hIKl32haTowK56bDmMGz-T9WOjkJaemd5pGdmU"

// Inicialização direta, sem depender do 'import.meta.env'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)