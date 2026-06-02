import React, { useState, useEffect } from 'react'
import type { Team, TeamMember, Profile } from '../types'
import { getMyTeams, createTeam, getTeamMembers, addTeamMembers, removeTeamMember } from '../services/teamService'

interface TeamsProps {
    isDark: boolean
    onBack: () => void
}

function Teams({ isDark, onBack}: TeamsProps) {
    const [teams, setTeams] = useState<Team[]>([])
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
    const [members, setMembers] = useState<(TeamMember & { profile: Profile })[]>([])
    const [newTeamName, setNewTeamName] = useState('')
    const [newMemberEmail, setNewMemberEmail] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getMyTeams()
            .then(data => {
                setTeams(data)
                setLoading(false)
    })
    .catch(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!selectedTeam) return
        getTeamMembers(selectedTeam.id).then(setMembers)
    }, [selectedTeam])

    const handleCreateTeam = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            const team = await createTeam(newTeamName)
            setTeams([...teams, team])
            setNewTeamName('')
        } catch {
            setError('Erro ao criar equipe')
        }
    }

    const handdleAddMember = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (!selectedTeam) return
        try {
            await addTeamMembers(selectedTeam.id, newMemberEmail)
            const updated = await getTeamMembers(selectedTeam.id)
            setMembers(updated)
            setNewMemberEmail('')
        } catch {
            setError('Usuário não encontrado')
        }
    }

    const handleRemoveMember = async (memberId: string) => {
        try {
            await removeTeamMember(memberId)
            setMembers(members.filter(m => m.id !== memberId))
        } catch {
            setError('Erro ao remover membro')
        }
    }

    if (loading) return <p className="text-gray-500 text-sm">Carregando...</p>

    return (
        <div className={`relative min-h-screen ${isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}>

            {/*Botão de voltar — fixo no canto superior esquerdo*/}
            <div className="absolute top-6 left-8">
                <button
                    onClick={onBack}
                    className={`text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/60 text-gray-800 hover:bg-white/80'}`}
                >← Voltar</button>
            </div>

            <div className="flex flex-col items-center w-full p-8">
                <div className="w-full max-w-4xl">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/*Criar time*/}
                        <div className={`rounded-2xl p-6 backdrop-blur-md border ${isDark ? 'bg-white/5 border-white/10 shadow-xl' : 'bg-white/60 border-white/80 shadow-lg'}`}>
                            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Criar time</h2>
                            {error && <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}
                            <form onSubmit={handleCreateTeam} className="flex flex-col gap-3">
                                <input
                                    type='text'
                                    placeholder='Nome da equipe'
                                    value={newTeamName}
                                    onChange={e => setNewTeamName(e.target.value)}
                                    className={`border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white/80 border-gray-300 text-gray-800'}`}
                                    required
                                />
                                <button
                                    type='submit'
                                    className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                                >Criar equipe</button>
                            </form>

                            {/*Retorno das equipes existentes*/}
                            <h3 className={`text-sm font-semibold mt-6 mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Minhas equipes</h3>
                            {teams.length === 0 && <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Nenhum time ainda.</p>}
                            <div className="flex flex-col gap-2">
                                {teams.map(team => (
                                    <button
                                        key={team.id}
                                        onClick={() => setSelectedTeam(team)}
                                        className={`text-left px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${selectedTeam?.id === team.id
                                            ? 'bg-blue-600 text-white'
                                            : isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/60 text-gray-800 hover:bg-white/80'
                                        }`}
                                    >{team.name}</button>
                                ))}
                            </div>
                        </div>

                        {/*Membros do time*/}
                        <div className={`rounded-2xl p-6 backdrop-blur-md border ${isDark ? 'bg-white/5 border-white/10 shadow-xl' : 'bg-white/60 border-white/80 shadow-lg'}`}>
                            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {selectedTeam ? `Membros - ${selectedTeam.name}` : 'Selecione uma equipe'}
                            </h2>

                            {selectedTeam && (
                                <>
                                    <form onSubmit={handdleAddMember} className="flex flex-col gap-3 mb-6">
                                        <input
                                            type='email'
                                            placeholder='Email do colaborador'
                                            value={newMemberEmail}
                                            onChange={e => setNewMemberEmail(e.target.value)}
                                            className={`border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white/80 border-gray-300 text-gray-800'}`}
                                            required
                                        />
                                        <button
                                            type='submit'
                                            className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                                        >Adicionar membro</button>
                                    </form>

                                    <div className="flex flex-col gap-2">
                                        {members.map(member => (
                                            <div
                                                key={member.id}
                                                className={`flex items-center justify-between px-4 py-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-white/60'}`}
                                            >
                                                <div>
                                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{member.profile.name}</p>
                                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{member.role}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    className="text-xs bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition-colors cursor-pointer"
                                                >Remover</button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Teams