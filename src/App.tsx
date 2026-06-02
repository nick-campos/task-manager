import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import Auth from './pages/Auth'
import Header from './components/header'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskFilters from './components/TaskFilters'
import type { TaskPriority, TaskStatus } from './types'
import Teams from './pages/team'

function App() {
  const { user, loading } = useAuth()
  const {isDark, toggleTheme} = useTheme() //traz o estado do tema e a função de alternar para o App
  const [refresh, setRefresh] = useState(0)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [page, setPage] = useState<'task' | 'teams'>('task')
  const [assignedToFilter, setAssignedToFilter] = useState<string | 'all'>('all')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (!user) {
    return <Auth isDark={isDark} />
  }

  //Renderiza Teams se page === 'teams'
  if (page === 'teams') {
    return (
      <div className={`min-h-screen flex flex-col ${isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}>
        <Header isDark={isDark} toggleTheme={toggleTheme} onNavigate={setPage}/>
        <Teams isDark={isDark} onBack={() => setPage('task')} />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}> 
      <Header isDark={isDark} toggleTheme={toggleTheme} onNavigate={setPage} />
      <main className='flex flex-col items-center w-full p-8'>
        <div className='w-full max-w-4x1'>
          <TaskForm onTaskCreated={() => setRefresh(r => r + 1)} isDark={isDark} />
            <div style={{marginTop: '24px'}}>
              <TaskFilters 
                status={statusFilter}
                priority={priorityFilter}
                assignedTo={assignedToFilter}
                profiles={{}}
                onStatusChange={(value) => setStatusFilter(value)}
                onPriorityChange={(value) => setPriorityFilter(value)}
                onAssignedToChange={(value) => setAssignedToFilter(value)}
                isDark={isDark}
              /> 
            </div> 

            <TaskList 
              refresh={refresh}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              isDark={isDark}
            />
        </div>
      </main>
    </div>
  )
}

export default App