import { useState, useEffect } from 'react'

export function useTheme() {
    const[isDark, setIsDark] = useState(() => { //Inicializa o estado lendo o localStorage. Se o usuário já escolheu dark, começa dark.
        return localStorage.getItem('theme') === 'dark'
})

    useEffect (() => { //toda vez que isDark muda, salva no localStorage. Assim persiste entre sessões.
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }, [isDark])

    const toggleTheme = () => setIsDark(prev => !prev) //Alterna entre os dois. 

    return { isDark, toggleTheme }
}