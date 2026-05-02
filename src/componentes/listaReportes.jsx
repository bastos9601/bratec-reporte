import Tarjeta from './ui/tarjeta'

export default function ListaReportes({ reportes }) {
  if (!reportes || reportes.length === 0) {
    return (
      <Tarjeta className="text-center py-16">
        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 text-lg font-medium">No hay reportes disponibles</p>
        <p className="text-gray-400 text-sm mt-1">Los reportes aparecerán aquí una vez creados</p>
      </Tarjeta>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reportes.map((reporte) => (
        <Tarjeta key={reporte.id} hover className="overflow-hidden flex flex-col">
          {reporte.imagen_url ? (
            <div className="relative -mx-6 -mt-6 mb-4 h-48 overflow-hidden bg-gray-100">
              <img
                src={reporte.imagen_url}
                alt="Reporte"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          ) : (
            <div className="relative -mx-6 -mt-6 mb-4 h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">{reporte.lugar}</h3>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed flex-1">{reporte.descripcion}</p>
            
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {reporte.tecnico && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {reporte.tecnico.nombre ? reporte.tecnico.nombre[0].toUpperCase() : reporte.tecnico.email[0].toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {reporte.tecnico.nombre || reporte.tecnico.email}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(reporte.created_at).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </Tarjeta>
      ))}
    </div>
  )
}
