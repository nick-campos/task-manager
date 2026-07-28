import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TaskFilters from '../components/TaskFilters'
import { fireEvent } from '@testing-library/react'

describe('TaskFilters', () => {
    it('Deve renderizar os selects com os valores atuais', () => {
        const fakeProfiles = {
            u1: { id: 'u1', name: 'Ana', email: 'ana@teste.com'},
            u2: { id: 'u2', name: 'Bruno', email: 'bruno@teste.com'}
        }

        render(
            <TaskFilters
                status='all'
                priority='all'
                assignedTo='all'
                profiles={fakeProfiles}
                onStatusChange={vi.fn()}
                onPriorityChange={vi.fn()}
                onAssignedToChange={vi.fn()}
                isDark={false}
            />
        )

        //confere que existem exatamente os 2 selects
        //com "Todos" (status + responsável) — não distingue qual é qual AINDA,
        //mas garante que a estrutura renderizou como esperado
        const allTodos = screen.getAllByDisplayValue('Todos')
        expect(allTodos).toHaveLength(2)

        expect(screen.getByText('Ana')).toBeInTheDocument()
        expect(screen.getByText('Bruno')).toBeInTheDocument()
    })

    it('Deve chamar onStatusChange ao mudar o status', () => {
        const onStatusChange = vi.fn()

        render(
            <TaskFilters
                status='all'
                priority='all'
                assignedTo='all'
                profiles={{}}
                onStatusChange={onStatusChange}
                onPriorityChange={vi.fn()}
                onAssignedToChange={vi.fn()}
                isDark={false}
            />
        )

        const selects = screen.getAllByRole('combobox')
        //Ordem no JSX: status (1º), prioridade (2º), responsável (3º)
        fireEvent.change(selects[0], { target: { value: 'done'} })

        expect(onStatusChange).toHaveBeenCalledWith('done')
    })

    it('Deve chamar onPriorityChange ao mudar a prioridade', () => {
        const onPriorityChange = vi.fn()

        render(
             <TaskFilters
                status='all'
                priority='all'
                assignedTo='all'
                profiles={{}}
                onStatusChange={vi.fn()}
                onPriorityChange={onPriorityChange}
                onAssignedToChange={vi.fn()}
                isDark={false}
            />
        )

        const selects = screen.getAllByRole('combobox')
        //Ordem no JSX: status (1º), prioridade (2º), responsável (3º)
        fireEvent.change(selects[1], { target: { value: 'high'} })

        expect(onPriorityChange).toHaveBeenCalledWith('high')
    })

    it('Deve chamar onAssignedToCHanghe ao mudar o responsável', () => {
        const onAssignedToChange = vi.fn()
        const fakeProfiles = {
            u1: { id: 'u1', name: 'Ana', email: 'ana@teste.com'}
        }

        render(
             <TaskFilters
                status='all'
                priority='all'
                assignedTo='all'
                profiles={fakeProfiles}
                onStatusChange={vi.fn()}
                onPriorityChange={vi.fn()}
                onAssignedToChange={onAssignedToChange}
                isDark={false}
            />
        )

        const selects = screen.getAllByRole('combobox')
        fireEvent.change(selects[2], { target: { value: 'u1' } })

        expect(onAssignedToChange).toHaveBeenCalledWith('u1')
    })
})