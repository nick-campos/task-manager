import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'
import LogoutButton from './LogoutButton'

interface HeaderProps {
    isDark: boolean
    toggleTheme: () => void
    onNavigate: (page: 'task' | 'teams') => void
}

function Header({ isDark, toggleTheme, onNavigate }: HeaderProps) {
    const { user, signOut } = useAuth() //Busca o usuário logado e a função de logout direto do contexto que foi criado.

    const headerStyle = isDark
        ? 'bg-white/5 border-white/10 text-white' 
        : 'bg-white/60 border-white/80 text-gray-800'

    const titleStyle = isDark
        ? 'text-white' 
        : 'text-gray-800'

    return (
        <header style={{padding: '16px 64px'}} className={`w-full flex items-center justify-between backdrop-blur-md border-b ${headerStyle}`}>
            <h1 className={`text-lg font-bold ${titleStyle}`}>Task Manager</h1>
                <div className='flex items-center gap-4'>

                    <button
                        onClick={() => onNavigate('teams')}
                        className={`text-sm px-3 py-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/60 text-gray-800 hover:bg-white/80'}`}
                    >Equipes</button>

                    <span className='text-sm text-gray-500'>{user?.email}</span> 

                    <ThemeToggle 
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                    />                        

                    <LogoutButton 
                        signOut={signOut}
                    />

                </div> 
        </header>
    )    
}

export default Header