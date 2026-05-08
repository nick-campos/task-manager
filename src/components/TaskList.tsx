import { useEffect, useState } from 'react'
import type { Task, TaskStatus, TaskPriority } from '../types'
import { getTasks, deleteTask, updateTask } from '../services/taskService'

interface TaskListProps {
    refresh: number //Quando esse número muda, o useEffect dispara novamente e recarrega a lista.
    statusFilter: TaskStatus | 'all'
    priorityFilter: TaskPriority | 'all'
    isDark: boolean
}

function TaskList({ refresh, statusFilter, priorityFilter, isDark }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null) //guarda o id da tarefa que está sendo editada.
    const [editTitle, setEditTitle] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editPriority, setEditPriority] = useState<Task['priority']>('medium')
    const [editStatus, setEditStatus] = useState<Task['status']>('pending')

    const handleDelete = async (id: string) => {
        try {
            await deleteTask(id)
            setTasks(tasks.filter(task => task.id !== id)) //remove a tarefa deletada do estado local sem precisar buscar o banco de novo.
        } catch (err) {
            console.error(err)
        }
    }

    const handleEditStart = (task: Task) => { //quando o usuário clica em editar, preenche os estados temporários com os valores atuais da tarefa
        setEditingId(task.id)
        setEditTitle(task.title)
        setEditDescription(task.description || '')
        setEditPriority(task.priority)
        setEditStatus(task.status)
    }

    const handleEditSave = async (id: string) => { //salva as alterações no banco e atualiza o card na lista sem recarregar tudo
        try {
            const updated = await updateTask(id, {
                title: editTitle,
                description: editDescription || null,
                priority: editPriority,
                status: editStatus
            })
            setTasks(tasks.map(task => task.id === id ? updated : task)) //substitui só a tarefa editada.
            setEditingId(null)
        } catch (err) {
            console.error(err)
        }
    }
    const handleEditCancel = () => { //cancela a edição sem salvar
        setEditingId(null)
    }

    useEffect(() => {
        getTasks()
            .then(data => {
                setTasks(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [refresh]) //O efeito roda toda vez que refresh mudar.

    if (loading) return <p className='text-gray-500 text-sm'>Carregando tarefas...</p>
    if (tasks.length === 0) return <p className='text-gray-500 text-sm'>Nenhuma tarefa criada.</p>

    const filteredTasks = tasks.filter(task => {
        const matchStatus = statusFilter === 'all' || task.status === statusFilter
        const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter
        return matchStatus && matchPriority //a tarefa só aparece se passar nos dois filtros ao mesmo tempo.
    })

    if (filteredTasks.length === 0) return <p className='text-gray-500 text-sm'>Nenhuma tarefa encontrada.</p> 

    return (
    <div className="flex flex-col gap-4" style={{marginTop: '12px'}}>
      {filteredTasks.map(task => (
      <div key={task.id} className={`rounded-lg shadow-sm p-5 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {editingId === task.id ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className={`border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
            />
            <textarea
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              className={`border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
              rows={3}
            />
            <select
              value={editPriority}
              onChange={e => setEditPriority(e.target.value as Task['priority'])}
              className={`border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
            >
              <option value="low">Baixa prioridade</option>
              <option value="medium">Média prioridade</option>
              <option value="high">Alta prioridade</option>
            </select>
            <select
              value={editStatus}
              onChange={e => setEditStatus(e.target.value as Task['status'])}
              className={`border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
            >
              <option value="pending">Pendente</option>
              <option value="in_progress">Em progresso</option>
              <option value="done">Concluída</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditSave(task.id)}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Salvar
              </button>
              <button
                onClick={handleEditCancel}
                className="text-xs bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{task.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-600' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {task.priority === 'high' ? 'Alta' :
                   task.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
                <button
                  onClick={() => handleEditStart(task)}
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-xs bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition-colors cursor-pointer"
                >
                  Deletar
                </button>
              </div>
            </div>
            {task.description && (
              <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{task.description}</p>
            )}
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              task.status === 'done' ? 'bg-green-100 text-green-600' :
              task.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {task.status === 'done' ? 'Concluída' :
               task.status === 'in_progress' ? 'Em progresso' : 'Pendente'}
            </span>
          </>
        )}
      </div>
    ))}
  </div>
)
}

export default TaskList