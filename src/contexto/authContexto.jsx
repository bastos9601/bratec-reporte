import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../servicios/supabaseCliente'
import { obtenerUsuarioActual } from '../servicios/usuariosServicio'

const AuthContexto = createContext()

export const useAuth = () => {
  const contexto = useContext(AuthContexto)
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return contexto
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    verificarUsuario()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      verificarUsuario()
    })

    return () => subscription.unsubscribe()
  }, [])

  const verificarUsuario = async () => {
    try {
      const usuarioActual = await obtenerUsuarioActual()
      setUsuario(usuarioActual)
    } catch (error) {
      console.error('Error al verificar usuario:', error)
      setUsuario(null)
    } finally {
      setCargando(false)
    }
  }

  return (
    <AuthContexto.Provider value={{ usuario, cargando, verificarUsuario }}>
      {children}
    </AuthContexto.Provider>
  )
}
