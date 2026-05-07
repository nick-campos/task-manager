import type { TaskPriority, TaskStatus } from '../types'

interface TaskFiltersProps {
    status: TaskStatus | 'all'
    priority: TaskPriority | 'all'
    onStatusChange: (status: TaskStatus | 'all') => void //além dos valores do banco, adicionamos 'all' para representar "sem filtro ativo"
    onPriorityChange: (priority: TaskPriority | 'all') => void
}

function TaskFilters({ status, priority, onStatusChange, onPriorityChange} : TaskFiltersProps) {
    return (
        <div className='bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4'>
            <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-black'>Status</label>
                <select
                    value={status}
                    onChange={e => onStatusChange(e.target.value as TaskStatus | 'all')}
                    className='border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                    >
                        <option value="all">Todos</option>
                        <option value="pending">Pendente</option>
                        <option value="in_progress">Em progresso</option>
                        <option value="done">Concluída</option>
                    </select>
            </div>

            <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-black'>Prioridade</label>
                <select
                    value={priority}
                    onChange={e => onPriorityChange(e.target.value as TaskPriority | 'all')}
                    className='border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                >
                    <option value="all">Todas</option>
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                </select>
            </div>
        </div>
    )
}   

export default TaskFilters