import type { TaskPriority, TaskStatus } from '../types'

interface TaskFiltersProps {
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  onStatusChange: (status: TaskStatus | 'all') => void
  onPriorityChange: (priority: TaskPriority | 'all') => void
  isDark: boolean
}

function TaskFilters({ status, priority, onStatusChange, onPriorityChange, isDark }: TaskFiltersProps) {
  return (
    <div className={`rounded-2xl p-4 mb-6 flex flex-wrap gap-4 backdrop-blur-md border ${isDark ? 'bg-white/5 border-white/10 shadow-xl' : 'bg-white/60 border-white/80 shadow-lg'}`}>
      <div className="flex flex-col gap-1">
        <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Status</label>
        <select
          value={status}
          onChange={e => onStatusChange(e.target.value as TaskStatus | 'all')}
          className={`border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
        >
          <option value="all">Todos</option>
          <option value="pending">Pendente</option>
          <option value="in_progress">Em progresso</option>
          <option value="done">Concluída</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Prioridade</label>
        <select
          value={priority}
          onChange={e => onPriorityChange(e.target.value as TaskPriority | 'all')}
          className={`border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
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