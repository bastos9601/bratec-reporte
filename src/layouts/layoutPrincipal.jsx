import Sidebar from '../componentes/ui/sidebar'
import { cerrarSesion } from '../servicios/usuariosServicio'
import { useAuth } from '../contexto/authContexto'

export default function LayoutPrincipal({ children, vistaActual, onCambiarVista }) {
  const { usuario, verificarUsuario } = useAuth()

  const manejarCerrarSesion = async () => {
    await cerrarSesion()
    verificarUsuario()
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        rol={usuario?.rol} 
        onCerrarSesion={manejarCerrarSesion}
        vistaActual={vistaActual}
        onCambiarVista={onCambiarVista}
      />
      <main className="flex-1 lg:ml-64 w-full">
        {children}
      </main>
    </div>
  )
}
