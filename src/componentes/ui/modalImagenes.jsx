export default function ModalImagenes({ isOpen, onClose, imagenes, imagenInicial, reporte }) {
  const [imagenActual, setImagenActual] = React.useState(imagenInicial)

  React.useEffect(() => {
    setImagenActual(imagenInicial)
  }, [imagenInicial])

  if (!isOpen) return null

  const siguienteImagen = (e) => {
    e.stopPropagation()
    setImagenActual((prev) => (prev + 1) % imagenes.length)
  }

  const anteriorImagen = (e) => {
    e.stopPropagation()
    setImagenActual((prev) => (prev - 1 + imagenes.length) % imagenes.length)
  }

  const handleBackdropClick = (e) => {
    // No hacer nada - solo cerrar con el botón X
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
      onClick={handleBackdropClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors z-50"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div 
        className="relative w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen principal */}
        <div className="relative">
          <img
            src={imagenes[imagenActual]}
            alt={`Foto ${imagenActual + 1}`}
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          />
          
          {/* Controles de navegación */}
          {imagenes.length > 1 && (
            <>
              <button
                onClick={anteriorImagen}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-all backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={siguienteImagen}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-all backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Contador */}
              <div className="absolute top-4 left-4 px-3 py-2 bg-black bg-opacity-60 text-white text-sm rounded-lg backdrop-blur-sm">
                {imagenActual + 1} / {imagenes.length}
              </div>
            </>
          )}
        </div>

        {/* Información del reporte */}
        <div className="mt-4 p-4 bg-white bg-opacity-10 backdrop-blur-md rounded-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="font-bold text-lg">{reporte.lugar}</h3>
          </div>
          <p className="text-sm text-gray-200">{reporte.descripcion}</p>
          {reporte.tecnico && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white border-opacity-20">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                {reporte.tecnico.nombre ? reporte.tecnico.nombre[0].toUpperCase() : reporte.tecnico.email[0].toUpperCase()}
              </div>
              <span className="text-sm">
                {reporte.tecnico.nombre || reporte.tecnico.email}
              </span>
            </div>
          )}
        </div>

        {/* Miniaturas */}
        {imagenes.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {imagenes.map((img, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setImagenActual(index)
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === imagenActual 
                    ? 'border-white scale-110' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Importar React al inicio
import React from 'react'
