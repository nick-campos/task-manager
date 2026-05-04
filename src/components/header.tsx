import { useAuth } from '../hooks/useAuth'

function Header() {
    const { user, signOut } = useAuth() //Busca o usuário logado e a função de logout direto do contexto que foi criado.

    return (
        <header className='w-full bg-white shadow-sm px-10 py-4 flex items-center justify-between'>
            <h1 className='text-lg font-bold text-gray-800'>Task Manager</h1>
                <div className='flex items-center gap-4'>
                    <span className='text-sm text-gray-500'>{user?.email}</span> 
                        <button
                            onClick={signOut} //Chama direto a função do contexto, sem precisar criar uma função intermediária.
                            className='text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors'>Logout</button>
                </div> 
        </header>
    )    
}

export default Header