import { useAuth } from "./hooks/useAuth";
import Auth from "./pages/Auth";
import Header from "./components/header";

function App() {
  const { user, loading } = useAuth();

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
        <main className="flex items-center justify-center p-8">
          <p className="text-gray-800"> Bem Vindo {user.email}</p>
        </main>
    </div>
  )
}

export default App