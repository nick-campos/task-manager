import { useAuth } from "./hooks/useAuth";
import { useState } from 'react'
import Auth from "./pages/Auth";
import Header from "./components/header";
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

function App() {
  const { user, loading } = useAuth();
  const [refresh, setRefresh] = useState(0) //refresh começa em 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Carregando...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-grays-100 flex flex-col">
      <Header />
        <main className="max-w-2x1 mx-auto w-full p-8"> 
          <TaskForm onTaskCreated={() => setRefresh(r => r + 1)}/> 
            <TaskList refresh={refresh} /> 
        </main>
    </div>
  )
}

export default App