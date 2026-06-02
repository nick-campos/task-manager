import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

//Busca todos os perfis - usando para montar o select de responsável
export async function getProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name')

        if (error) throw error 
        return data
}

//Busca o perfil de um usuário específico pelo id
export async function getProfileById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

        if (error) return null
        return data
}

