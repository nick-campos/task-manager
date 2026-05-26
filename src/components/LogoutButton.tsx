interface LogoutButtonProps {
    signOut: () => void
}

const buttonStyle = 'text-sx bg-blue-600 text-white px-3 py-1.9 rounded hover:bg-gray-600 transition-colors cursor-pointer'

function LogoutButton({
    signOut
}: LogoutButtonProps) {
return (
    <button
        onClick={signOut} //Chama direto a função do contexto, sem precisar criar uma função intermediária.
        className={buttonStyle}>Logout</button>
)
}

export default LogoutButton