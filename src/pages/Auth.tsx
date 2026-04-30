import {useState} from 'react'
import { useAuth } from '../hooks/useAuth'

function Auth() {

    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState ('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const[loading, setLoading] = useState(false)

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
        <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
             <div className='bg-white p-8 rounded-ig shadow-md w-full max-w-md'>
                <h1 className='text-2x1 font-bold text-gray-800 mb-6'>
                    {isLogin ? 'Entrar' : 'Criar conta'}
                </h1>
                    {error && (
                        <p className='bg-red-100 font-bold text-gray-800 mb-6'>
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className='flex flex-col -gap-4'>
                        <input 
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className='border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' required
                            />

                        <input 
                            type='password'
                            placeholder='Senha'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className='border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' required>
                        </input>
                        
                    <button 
                    type='submit'
                    disabled={loading}
                    className='bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors'>
                        {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta'}
                    </button>
                    </form>

                    <p className='text-sm text-gray-500 mt-4 text-center'>
                        {isLogin ? 'Não tem conta ' : 'Já tem conta? '}
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className='text-blue-600 ml-1 hover:underline'>
                                {isLogin ? 'Criar conta' : 'Entrar'}
                        </button>
                    </p>
             </div>
        </div>
    )
}

export default Auth