import { createContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// Define o "cardápio" do contexto — o que o resto do app vai encontrar quando acessar as informações de autenticação
interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

// Aqui foi criado o canal global — os componentes vão acessar os dados de autenticação
export const AuthContext = createContext<AuthContextType | null>(null)

// É o componente que ENVOLVE o app inteiro tudo que estiver dentro dele pode acessar os dados de auth.
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Duas variáveis reativas que o Provider controla quando mudam, todos os componentes que as usam re-renderizam
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        //Verifica se já existe sessão ativa, evita o usuário ser deslogado ao atualizar a página
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        //Escuta mudanças de autenticação, loga, desloga ou a sessão expira
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        // Sem isso, ele continuaria rodando em segundo plano desperdiçando memória
        return () => subscription.unsubscribe()
    }, [])

    // Cada função fala com o Supabase e lança o erro pra cima caso algo dê errado — quem chamou decide o que mostrar
    const signIn = async (email: string, password: string) => {
        const {error} = await supabase.auth.signInWithPassword({email, password})
        if (error) throw error
    }

    const signUp = async (email: string, password: string) => {
        const {error} = await supabase.auth.signUp({email, password})
        if(error) throw error
    }

    const signOut = async () => {
        const{error} = await supabase.auth.signOut()
        if(error) throw error
    }

    // Disponibiliza todos os dados e funções para os filhos.
    return (
        <AuthContext.Provider value={{user, loading, signIn, signUp, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}