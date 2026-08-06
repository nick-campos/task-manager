import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TaskList from '../components/TaskList'

//Criado aqui dentro, sem depender de import externo — isso evita o erro de "hoisting" (vi.mock roda antes de
//qualquer import do arquivo, então uma variável importada ainda não existiria nesse momento)
vi.mock('../lib/supabase', () => {
  const mock = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    channel: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
    removeChannel: vi.fn(),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } })
    }
  }
  return { supabase: mock }
})

vi.mock('../services/taskService', () => ({
  getTasks: vi.fn(),
  deleteTask: vi.fn(),
  updateTask: vi.fn()
}))

vi.mock('../services/teamService', () => ({
  getMyTeams: vi.fn(),
  getTeamMembers: vi.fn()
}))

import { getTasks, deleteTask, updateTask } from '../services/taskService'
import { getMyTeams, getTeamMembers } from '../services/teamService'

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    //Padrão "seguro": time e membros vazios, a menos que um teste específico diga o contrário
    vi.mocked(getMyTeams).mockResolvedValue([])
    vi.mocked(getTeamMembers).mockResolvedValue([])
  })

  it('Deve mostrar "Carregando tarefas..." e depois exibir as tarefas', async () => {
    const fakeTasks = [
      {
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
    ]

    vi.mocked(getTasks).mockResolvedValue(fakeTasks)

    render(
      <TaskList
        refresh={0}
        statusFilter="all"
        priorityFilter="all"
        assignedToFilter="all"
        isDark={false}
      />
    )

    //Antes da Promise resolver, o componente mostra o loading
    expect(screen.getByText('Carregando tarefas...')).toBeInTheDocument()

    //Espera a tarefa aparecer — sinal de que getTasks() resolveu
    expect(await screen.findByText('Estudar testes')).toBeInTheDocument()
  })

  it('deve editar uma tarefa e salvar as mudanças', async () => {
    const fakeTasks = [
      {
        id: 't1',
        title: 'Título antigo',
        description: null,
        priority: 'medium' as const,
        status: 'pending' as const,
        user_id: 'user-123',
        team_id: null,
        assigned_to: null,
        created_at: '2026-01-01'
      }
    ]

    const updatedTask = { ...fakeTasks[0], title: 'Título novo' }

    vi.mocked(getTasks).mockResolvedValue(fakeTasks)
    vi.mocked(updateTask).mockResolvedValue(updatedTask)

    render(
      <TaskList
        refresh={0}
        statusFilter="all"
        priorityFilter="all"
        assignedToFilter="all"
        isDark={false}
      />
    )

    //Espera a tarefa original aparecer na tela
    expect(await screen.findByText('Título antigo')).toBeInTheDocument()

    //Clica em "Editar" — troca o card pro modo de edição (inputs)
    fireEvent.click(screen.getByText('Editar'))

    //Encontra o input do título (agora visível) e muda o valor
    const titleInput = screen.getByDisplayValue('Título antigo')
    fireEvent.change(titleInput, { target: { value: 'Título novo' } })

    //Clica em "Salvar" — dispara handleEditSave, que chama updateTask(...)
    fireEvent.click(screen.getByText('Salvar'))

    //Espera o card voltar ao modo normal, já com o título atualizado
    expect(await screen.findByText('Título novo')).toBeInTheDocument()

    expect(updateTask).toHaveBeenCalledWith('t1', {
      title: 'Título novo',
      description: null,
      priority: 'medium',
      status: 'pending'
    })
  })

  it('deve deletar uma tarefa ao clicar em Deletar', async () => {
    const fakeTasks = [
      {
        id: 't1',
        title: 'Tarefa a deletar',
        description: null,
        priority: 'medium' as const,
        status: 'pending' as const,
        user_id: 'user-123',
        team_id: null,
        assigned_to: null,
        created_at: '2026-01-01'
      }
    ]

    vi.mocked(getTasks).mockResolvedValue(fakeTasks)
    vi.mocked(deleteTask).mockResolvedValue(undefined)

    render(
      <TaskList
        refresh={0}
        statusFilter="all"
        priorityFilter="all"
        assignedToFilter="all"
        isDark={false}
      />
    )

    //Espera a tarefa aparecer
    expect(await screen.findByText('Tarefa a deletar')).toBeInTheDocument()

    //Clica em "Deletar" — dispara handleDelete, que chama deleteTask(...)
    fireEvent.click(screen.getByText('Deletar'))

    //Espera a tarefa sumir da tela (queryByText não quebra se não achar, diferente de getByText — por isso usamos ele aqui pra confirmar ausência)
    await waitFor(() => {
      expect(screen.queryByText('Tarefa a deletar')).not.toBeInTheDocument()
    })

    expect(deleteTask).toHaveBeenCalledWith('t1')
  })

  it('deve exibir apenas as tarefas que batem com os filtros de status e prioridade', async () => {
    const fakeTasks = [
      {
        id: 't1',
        title: 'Tarefa pendente alta',
        description: null,
        priority: 'high' as const,
        status: 'pending' as const,
        user_id: 'user-123',
        team_id: null,
        assigned_to: null,
        created_at: '2026-01-01'
      },
      {
        id: 't2',
        title: 'Tarefa concluída baixa',
        description: null,
        priority: 'low' as const,
        status: 'done' as const,
        user_id: 'user-123',
        team_id: null,
        assigned_to: null,
        created_at: '2026-01-02'
      }
    ]

    vi.mocked(getTasks).mockResolvedValue(fakeTasks)

    //Filtra só por tarefas com status "pending" — a t2 (done) deve ficar de fora da tela, mesmo vindo junto na resposta do getTasks
    render(
      <TaskList
        refresh={0}
        statusFilter="pending"
        priorityFilter="all"
        assignedToFilter="all"
        isDark={false}
      />
    )

    //A tarefa pendente deve aparecer
    expect(await screen.findByText('Tarefa pendente alta')).toBeInTheDocument()

    //A tarefa concluída não deve aparecer (foi filtrada no componente,
    //não na "consulta ao banco" — o mock devolveu as duas juntas)
    expect(screen.queryByText('Tarefa concluída baixa')).not.toBeInTheDocument()
  })
})