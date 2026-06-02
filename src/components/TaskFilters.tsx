import type { TaskPriority, TaskStatus, Profile } from '../types'

interface TaskFiltersProps {
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  assignedTo: string | 'null' //valor atual do filtro de responsável
  profiles: Record<string, Profile> //adiciona os tipos -  profiles dicionário de perfis para popular o select
  onStatusChange: (status: TaskStatus | 'all') => void
  onPriorityChange: (priority: TaskPriority | 'all') => void
  onAssignedToChange: (assignedTo: string | 'all') => void //callback para quando o usuário trocar o responsável
  isDark: boolean
}

function TaskFilters({ status, priority, assignedTo, profiles, onStatusChange, onPriorityChange, onAssignedToChange, isDark }: TaskFiltersProps) {
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

        <div className='flex flex-col gap-1'>
          <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Responsável</label>
          <select
            value={assignedTo}
            onChange={e => onAssignedToChange(e.target.value as string | 'all')}
            className={`border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
          >
            <option value="all">Todos</option>
            {Object.values(profiles).map(profile => ( //transforma o dicionário em array para poder usar o .map()
              <option key={profile.id} value={profile.id}>{profile.name}</option> //Cada opção usa o profile.id como valor e profile.name como label
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default TaskFilters