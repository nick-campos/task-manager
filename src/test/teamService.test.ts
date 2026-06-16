import { vi, describe, it, expect, beforeEach } from 'vitest'
import { mockSupabase } from '../test/mocks/supabase'
import { getMyTeams, createTeam } from '../services/teamService'

//Acontece a troca do supabase para o mockSupabase, quando solicitado
vi.mock('../lib/supabase', () => ({
    supabase: mockSupabase
}))

//Limpa o histórico de mock antes de cada teste
describe('teamService', () => {
    beforeEach(() => {
        mockSupabase.from.mockClear()
        mockSupabase.select.mockClear()
        mockSupabase.insert.mockClear()
        mockSupabase.delete.mockClear()
        mockSupabase.single.mockClear()
        mockSupabase.eq.mockClear()
        mockSupabase.order.mockClear()
    })

    //Agrupa os testes específicos dessa função
    describe('getMyTeams',  () => {
        it('deve retornar lista de times', async () => {
            const fakeTeams = [
                //Simulaçao um retorno do Supabase
                { id: '1', name: 'Time A', created_by: 'user-123', created_at:'2025-01-01'},
                { id: '2', name: 'Time B', created_by: 'user-123', created_at:'2025-01-02'}
            ]

            //Define o que o mock vai retornar
            mockSupabase.order.mockResolvedValueOnce({ data: fakeTeams, error: null }) //O Once significa que só vale para essa chamada

            //CHama a função real e verifica
            const result = await getMyTeams()

            expect(result).toEqual(fakeTeams) //Verifica se o resultado é igual aos dados falsos
            expect(mockSupabase.from).toHaveBeenCalledWith('teams') //Verifica se a função buscou na tabela certa
        })
    })

    describe('createTeam', () => {
    it('Deve criar um time e adicionar o criador como admin', async () => {
        const fakeTeam = { id: '1', name: 'Time A', created_by: 'user-123', created_at: '2026-01-01' }

        //Configura os métodos para SEMPRE retornarem o próprio mock (permite encadeamento infinito)
        mockSupabase.from.mockReturnValue(mockSupabase)
        mockSupabase.insert.mockReturnValue(mockSupabase)
        mockSupabase.select.mockReturnValue(mockSupabase)

        //O single() resolve com os dados do time criado
        mockSupabase.single.mockResolvedValue({ data: fakeTeam, error: null })

        //Executa a função
        const result = await createTeam('Time A')

        // Validações
        expect(result).toEqual(fakeTeam)
        expect(mockSupabase.from).toHaveBeenCalledWith('teams')
        expect(mockSupabase.from).toHaveBeenCalledWith('team_members')
    })
})
})