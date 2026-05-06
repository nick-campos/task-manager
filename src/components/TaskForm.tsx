import React, { useState } from 'react'
import type { TaskPriority } from '../types'
import { createTask } from '../services/taskService'

interface TaskFormProps { //define o que o componente espera receber
    onTaskCreated: () => void //é uma função que não recebe nada e não retorna nada. Só dispara um evento para o componente pai
}

function TaskForm({ onTaskCreated }: TaskFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('medium') //o estado de prioridade já começa com 'medium' como valor padrão, refletindo o banco.
    const [error, setError] = useState<string | null>(null)

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
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
            <h2 className='text-lg font-bold text-gray-800 mb-4'>Nova Tarefa</h2>

            {error && (
                <p className='bg-red-100 text-red-600 p-3 rounded mb-4 text-sm'>{error}</p>
            )}

            <form onSubmit={handleSubmit} className='flex flex-col -gap-4'>
                <input
                    type='text'
                    placeholder= 'Título da tarefa'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className='border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus-ring-2 focus-ring-blue-500'
                    required
                    />
                    
                    <textarea 
                        placeholder='Descrição (opcional)'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className='border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus-ring-blue-500 resize-none'
                    />

                    <select 
                        value={priority}
                        onChange={e => setPriority(e.target.value as TaskPriority)} //o select retorna uma string genérica, mas os valores são sempre 'low', 'medium' ou 'high'
                        className='border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value='low'>Baixa prioridade</option>
                        <option value='medium'>Média prioridade</option>
                        <option value='high'>Alta prioridade</option>
                    </select>

                    <button 
                    type='submit'
                    disabled={loading}
                    className='bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors'
                    >
                        {loading ? 'Criando...' : 'Criar tarefa'}
                    </button>
            </form>
        </div>
        )
    }

export default TaskForm