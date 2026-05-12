import { useAuth } from '../hooks/useAuth'

interface HeaderProps {
    isDark: boolean
    toggleTheme: () => void
}

function Header({ isDark, toggleTheme }: HeaderProps) {
    const { user, signOut } = useAuth() //Busca o usuário logado e a função de logout direto do contexto que foi criado.

    return (
        <header style={{padding: '16px 64px'}} className={`w-full flex items-center justify-between backdrop-blur-md border-b ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/60 border-white/80 text-gray-800'}`}>
            <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Task Manager</h1>
                <div className='flex items-center gap-4'>
                    <span className='text-sm text-gray-500'>{user?.email}</span> 
                    <button
                        onClick={toggleTheme}
                        className={`text-sx px-3 py-1.9 rounded transition-colors cursor-pointer ${isDark ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                        {isDark ? '☀️' : '🌙'}
                    </button>
                        <button
                            onClick={signOut} //Chama direto a função do contexto, sem precisar criar uma função intermediária.
                            className='text-sx bg-blue-600 text-white px-3 py-1.9 rounded hover:bg-gray-600 transition-colors cursor-pointer'>Logout</button>
                </div> 
        </header>
    )    
}

export default Header