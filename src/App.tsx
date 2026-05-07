import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import Auth from './pages/Auth'
import Header from './components/header'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskFilters from './components/TaskFilters'
import type { TaskPriority, TaskStatus } from './types'

function App() {
  const { user, loading } = useAuth()
  const [refresh, setRefresh] = useState(0)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex flex-col items-center w-full p-8">
        <div className="w-full max-w-4xl">
          <TaskForm onTaskCreated={() => setRefresh(r => r + 1)} />
          <div style={{ marginTop: '24px' }}>
            <TaskFilters
              status={statusFilter}
              priority={priorityFilter}
              onStatusChange={(value) => setStatusFilter(value)}
              onPriorityChange={(value) => setPriorityFilter(value)}
            />
          </div>
          <div style={{ marginTop: '18px' }}>
          <TaskList
            refresh={refresh}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
          />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App