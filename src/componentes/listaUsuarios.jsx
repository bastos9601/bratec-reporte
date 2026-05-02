import Tarjeta from './ui/tarjeta'
import Boton from './ui/boton'

export default function ListaUsuarios({ usuarios, onCambiarEstado, onEditar, onEliminar }) {
  if (!usuarios || usuarios.length === 0) {
    return (
      <Tarjeta>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="mt-4 text-gray-500">No hay usuarios registrados</p>
        </div>
      </Tarjeta>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {usuarios.map((usuario) => (
        <Tarjeta key={usuario.id} hover>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 ${
                usuario.rol === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
              }`}>
                {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : usuario.email.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {usuario.nombre || 'Sin nombre'}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
                    usuario.rol === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {usuario.rol === 'admin' ? 'Admin' : 'Técnico'}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
                    usuario.activo 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{usuario.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(usuario.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {usuario.rol !== 'admin' && (
                <>
                  <Boton
                    tipo="primary"
                    onClick={() => onEditar(usuario)}
                    className="text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <svg className="w-4 h-4 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden sm:inline">Editar</span>
                  </Boton>
                  
                  <Boton
                    tipo={usuario.activo ? 'danger' : 'success'}
                    onClick={() => onCambiarEstado(usuario.id, !usuario.activo)}
                    className="text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <svg className="w-4 h-4 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {usuario.activo ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    <span className="hidden sm:inline">{usuario.activo ? 'Desactivar' : 'Activar'}</span>
                  </Boton>

                  <Boton
                    tipo="danger"
                    onClick={() => onEliminar(usuario)}
                    className="text-xs sm:text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Boton>
                </>
              )}
            </div>
          </div>
        </Tarjeta>
      ))}
    </div>
  )
}
