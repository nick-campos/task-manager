import {useContext} from 'react'
import {AuthContext} from '../contexts/AuthContext'

// Atalho para acessar o contexto de qualquer componente, o throw garante que ninguém use fora do Provider por acidente
export function useAuth() {
    const context = useContext(AuthContext)
    if(!context) throw new Error ('useAuth dee ser usado dentro de AuthProvider')
    return context
}