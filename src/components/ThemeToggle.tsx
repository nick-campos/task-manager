interface ThemeToggleProps {
    isDark: boolean
    toggleTheme: () => void
}

function ThemeToggle({ isDark, toggleTheme }: ThemeToggleProps) {

    const buttonStyle = isDark
 ? 'bg-gray-600 text-white hover:bg-gray-500'
 : 'bg-gray-200 text-gray-800 hover:bg-gray-300'

    return (
        <button
            onClick={toggleTheme}
                className={`text-sx px-3 py-1.9 rounded transition-colors cursor-pointer ${buttonStyle}`}
            >
                {isDark ? '☀️' : '🌙'}
        </button>
    )
}

export default ThemeToggle