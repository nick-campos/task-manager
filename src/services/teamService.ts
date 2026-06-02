import { supabase } from '../lib/supabase'
import type { Team, TeamMember, Profile } from '../types'

//BUsca todos os times que o usuário logado pertence
export async function getMyTeams(): Promise<Team[]> {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name')

    if (error) throw error 
    return data
}

//Cria um novo time e adiciona o criador como admin
export async function createTeam(name: string): Promise<Team> {
    const { data: { user }} = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('teams')
        .insert({ name, created_by: user!.id })
        .select()
        .single()

    if (error) throw error

    //Adiciona o criador como admin do time
    await supabase
        .from('team_members')
        .insert({ team_id: data.id, user_id: user!.id, role: 'admin' })

    return data
}

//Busca os membros de um time específico com seus perfis
export async function getTeamMembers(teamId: string): Promise<(TeamMember & {profile : Profile})[]> {
    const { data, error } = await supabase
        .from('team_members')
        .select('*, profile: profile(*)')
        .eq('team_id', teamId)

    if (error) throw error
    return data
}

//Adiicona um mebro ao time pelo e-mail
export async function addTeamMembers(teamId: string, email: string): Promise<void> {
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

    if (profileError || !profile) throw new Error('Usuário não encontrado')

    const { error } = await supabase
        .from('team_members')
        .insert({ team_id: teamId, user_id: profile.id, role: 'member' })

    if (error) throw error
}

//Remove um membro do time
export async function removeTeamMember(teamMemberId: string): Promise<void> {
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', teamMemberId)

    if (error) throw error
}