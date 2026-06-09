import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/lib/supabase', () => ({
    supabase: mockSupabase
}))

import { mockSupabase } from '@/test/mocks/supabase'
import { getTasks, createTask, deleteTask } from '@/services/taskService'

describe('taskService', () => {

    beforeEach(() => {
        mockSupabase.from.mockClear()
        mockSupabase.select.mockClear()
        mockSupabase.insert.mockClear()
        mockSupabase.delete.mockClear()
        mockSupabase.single.mockClear()
        mockSupabase.eq.mockClear()
        mockSupabase.order.mockClear()
    })

    describe('getTasks', () => {
        it('deve retornar lista de tarefas', async () => {
            const fakeTasks = [
                { id:'1', title: 'Tarefa 1', priority:'high', status:'pending' },
                { id:'2', title:'Tarefa 2', priority:'low', status:'done'}
            ]

            mockSupabase.order.mockResolvedValueOnce({ data: fakeTasks, error: null })

            const result = await getTasks()

            expect(result).toEqual(fakeTasks)
            expect(mockSupabase.from).toHaveBeenCalledWith('tasks')
        })

        it('deve lançar erro se o Supabase retornar erro', async () => {
            mockSupabase.order.mockResolvedValueOnce({ data: null, error: { message: 'Erro no banco' }})

            await expect(getTasks()).rejects.toThrow()
        })
    })

    describe('createTask', () => {
        it('deve criar uma tarefa e retorná-la', async () => {
            const fakeTask = { id: '1', title: 'Nova tarefa', priority: 'medium', status: 'pending' }

            mockSupabase.single.mockResolvedValueOnce({ data: fakeTask, error: null })

            const result = await createTask('Nova tarefa', null, 'medium', null, null)

            expect(result).toEqual(fakeTask)
            expect(mockSupabase.from).toHaveBeenCalledWith('tasks')
        })

        it('deve lançar erro se o Supabase retornar erro', async () => {
            mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'Erro ao criar' }})

            await expect(createTask('Nova tarefa', null, 'medium', null, null)).rejects.toThrow()
        })
    })

    describe('deleteTask', () => {
        it('deve deletar uma tarefa pelo id', async () => {
            mockSupabase.eq.mockResolvedValueOnce({ error: null })

            await expect(deleteTask('1')).resolves.not.toThrow()
            expect(mockSupabase.from).toHaveBeenCalledWith('tasks')
        })

        it('deve lançar erro se o Supabase retornar erro', async () => {
            mockSupabase.eq.mockResolvedValueOnce({ error: { message: 'Erro ao deletar' }})

            await expect(deleteTask('1')).rejects.toThrow()
        })
    })
})