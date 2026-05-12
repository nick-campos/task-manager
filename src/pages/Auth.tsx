import {useState} from 'react'
import { useAuth } from '../hooks/useAuth'

interface AuthProps {
    isDark: boolean
}

function Auth({ isDark }: AuthProps) {

    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState ('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const {signIn, signUp} = useAuth()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            if (isLogin) {
                await signIn(email, password)
            } else {
                await signUp(email, password)
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Algo deu errado')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
  <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}>
    <div className={`p-8 rounded-2xl w-full max-w-md backdrop-blur-md border ${isDark ? 'bg-white/5 border-white/10 shadow-xl' : 'bg-white/60 border-white/80 shadow-lg'}`}>
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {isLogin ? 'Entrar' : 'Criar conta'}
      </h1>
      {error && (
        <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white/80 border-gray-300 text-gray-800'}`}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={`border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white/80 border-gray-300 text-gray-800'}`}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta'}
        </button>
      </form>
      <p className={`text-sm mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-400 ml-1 hover:underline cursor-pointer"
        >
          {isLogin ? 'Criar conta' : 'Entrar'}
        </button>
      </p>
    </div>
  </div>
)
}

export default Auth