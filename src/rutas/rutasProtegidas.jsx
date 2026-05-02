import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexto/authContexto'
import Loader from '../componentes/ui/loader'

export function RutaProtegida({ children, rolesPermitidos }) {
  const { usuario, cargando } = useAuth()

  if (cargando) return <Loader />

  if (!usuario) return <Navigate to="/login" replace />

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />
  }

  return children
}
