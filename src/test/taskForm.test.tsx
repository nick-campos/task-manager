import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TaskForm from '../components/TaskForm'
import { getMyTeams } from '../services/teamService';

// Cada função vira um "controle remoto"
vi.mock('../services/taskService', () => ({ //isso substitui o arquivo inteiro por uma versão falsa
    createTask: vi.fn()
}))

vi.mock('../services/teamService', () => ({
    getMyTeams: vi.fn(),
    getTeamMembers: vi.fn()
}))

//Importamos DEPOIS do vi.mock, para pegar as versões "de mentira"
import { createTask } from '../services/taskService'
import { getTeamMembers } from '../services/teamService'

describe('TaskForm', () => {
    beforeEach(() => {
        vi.clearAllMocks() //limpa o "histórico" de chamadas entre um teste e outro, pra um teste não afetar o outro.
        vi.mocked(getMyTeams).mockResolvedValue([])
    })

    it('Deve renderizar os campos principais do form', () => {
        render(<TaskForm onTaskCreated={vi.fn()} isDark={false} />)

        expect(screen.getByPlaceholderText('Título da tarefa')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Descrição (opcional)')).toBeInTheDocument()
        expect(screen.getByText('Criar tarefa')).toBeInTheDocument()
    })

    it('Deve carregar os membros do time quando um time é selecionado', async () => {
        const fakeTeams = [
            { id: 'team-1', name: 'Time A', created_by: 'user-123', created_at: '2026-01-01' }
        ]

        const fakeMembers = [
            { 
                id: 'm1',
                user_id: 'u1',
                team_id: 'team-1',
                role: 'member' as const,
                joined_at: '2026-01-01',
                profile: { id: 'u1', name: 'Ana', email: 'ana@teste.com' }},
            { 
                id: 'm2',
                user_id: 'u2',
                team_id: 'team-2',
                role: 'member' as const,
                joined_at: '2026-01-02',
                profile: { id: 'u2', name: 'Bruno', email: 'bruno@teste.com' }}
        ]

        //Passo 1: O teste precisa já ter a resposta pronta antes do componente pedir por ela
        vi.mocked(getMyTeams).mockResolvedValue(fakeTeams)
        vi.mocked(getTeamMembers).mockResolvedValueOnce(fakeMembers)

        //Passo 2: Ele desenha a tela primeiro e só depois, quando a Promise resolver, atualiza de novo
        render(<TaskForm onTaskCreated={vi.fn()} isDark={false} />)

        //Passo 3: PAUSA o teste até a tela realmente mostrar "Time A" — ou seja, até o passo 2 terminar de verdade.
        const teamOption = await screen.findByText('Time A') //findByText já espera automaticamente, ao contrário de getByText.
        expect(teamOption).toBeInTheDocument()

        //Passo 4: O time aparece, simulamos o usuário escolhendo ele no select
        const teamSelect = screen.getByDisplayValue('Sem equipe')
        fireEvent.change(teamSelect, { target: { value: 'team-1'}})

        //Passo 5: Dispara o segundo useEffect do TaskForm. Por ser assíncrono precisa esperar com findByText
        expect(await screen.findByText('Ana')).toBeInTheDocument()
        expect(await screen.findByText('Bruno')).toBeInTheDocument()

        //Passo 6: Confirma que a função foi chamada como argumento certo.
        expect(getTeamMembers).toHaveBeenCalledWith('team-1')
    })

    it('Deve criar a tarefa e enviar o formulário', async () => {
        const fakeTask = { 
                            id: 't1',
                            title: 'Estudar testes',
                            description: null,
                            priority: 'medium' as const,
                            status: 'pending' as const,
                            user_id: 'user-123',
                            team_id: null,
                            assigned_to: null,
                            created_at: '2026-01-01' 
                        }

        const onTaskCreated = vi.fn()

        //Passo 1: Preparamos a resposta antes. Será usada quando o form for enviado
        vi. mocked(createTask).mockResolvedValueOnce(fakeTask)

        //Passo 2: componente nasce, getMyTeams roda em segundo plano
        render(<TaskForm onTaskCreated={onTaskCreated} isDark={false} />)

        //Passo 3: usuário digita o título — ação síncrona, não precisa esperar
        const titleInput = screen.getByPlaceholderText('Título da tarefa')
        fireEvent.change(titleInput, { target: { value: 'Estudar testes' } })

        //Passo 4: usuário clica em "Criar tarefa", isso dispara handleSubmit, chama createTask(...) de forma assíncrona
        const submitButton = screen.getByText('Criar tarefa')
        fireEvent.click(submitButton)

        //Passo 5: esperamos o componente reagir ao retorno da Promise, o sinal de que tudo terminou é o input voltar a ficar vazio
        await screen.findByDisplayValue('')

        //Passo 6: confirmamos que createTask foi chamado com os dados certos, e que o componente avisou o pai (onTaskCreated) que terminou
        expect(createTask).toHaveBeenCalledWith('Estudar testes', null, 'medium', null, null)
        expect(onTaskCreated).toHaveBeenCalledTimes(1)
    })
})