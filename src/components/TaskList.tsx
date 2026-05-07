import { useEffect, useState } from 'react'
import type { Task } from '../types'
import { getTasks, deleteTask } from '../services/taskService'

interface TaskListProps {
    refresh: number //Quando esse número muda, o useEffect dispara novamente e recarrega a lista.
}

function TaskList({ refresh }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)

    const handleDelete = async (id: string) => {
        try {
            await deleteTask(id)
            setTasks(tasks.filter(task => task.id !== id)) //remove a tarefa deletada do estado local sem precisar buscar o banco de novo.
        } catch (err) {
            console.error(err)
        }
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

    return (
        <div className='flex flex-col gap-4'>
            {tasks.map(task => (
                <div key={task.id} className='bg-white rounded-lg shadow-sm p-5'>
                    <div className='flex items-center justify-between mb-2'>
                        <h3 className='font-semibold text-gray-800'>{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium
                            ${task.priority === 'high' ? 'bg-red-100 text-red-600' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'}`}>
                                {task.priority === 'high' ? 'Alta' :
                                task.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>

                        <button
                        onClick={() => handleDelete(task.id)}
                        className='text-xs bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition-colors'
                        >
                            Excluir
                        </button>
                    </div>
                    {task.description && (
                        <p className='text-sm text-gray-500 mb-3'>{task.description}</p>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${task.status === 'done' ? 'bg-green-100 text-green-600' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'}`}>
                            {task.status === 'done' ? 'Concluída' :
                            task.status === 'in_progress' ? 'Em progresso' : 'Pendente'}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default TaskList