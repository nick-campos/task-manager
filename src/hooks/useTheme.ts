import { useState } from 'react'

export function useTheme() {
    const[isDark, setIsDark] = useState(false) //guarda se o tema atual é escuro ou claro.

    const toggleTheme = () => setIsDark(prev => !prev) //alterna entre os dois. 

    return { isDark, toggleTheme }
}