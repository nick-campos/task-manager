import React, { useState } from 'react'
import type { TaskPriority } from '../types'
import { createTask } from '../services/taskService'

interface TaskFormProps { //define o que o componente espera receber
    onTaskCreated: () => void //é uma função que não recebe nada e não retorna nada. Só dispara um evento para o componente pai
    isDark: boolean
}

function TaskForm({ onTaskCreated, isDark }: TaskFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('medium') //o estado de prioridade já começa com 'medium' como valor padrão, refletindo o banco.
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            await createTask(title, description || null, priority) //se a descrição estiver vazia, manda null para o banco.
            setTitle('')
            setDescription('')
            setPriority('medium') //limpa o formulário após criar a tarefa.
            onTaskCreated() //avisa o componente pai que uma tarefa foi criada e ele precisa atualizar a lista.
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Aconteceu um erro')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className={`rounded-lg shadow-sm p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Nova Tarefa</h2>

      {error && (
        <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Título da tarefa"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={`border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
          required
        />
        <textarea
          placeholder="Descrição (opcional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className={`border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
          rows={3}
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as TaskPriority)}
          className={`border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
        >
          <option value="low">Baixa prioridade</option>
          <option value="medium">Média prioridade</option>
          <option value="high">Alta prioridade</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? 'Criando...' : 'Criar tarefa'}
        </button>
      </form>
    </div>
  )
    }

export default TaskForm