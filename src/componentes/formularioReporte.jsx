import { useState, useRef } from 'react'
import Input from './ui/input'
import Boton from './ui/boton'
import Tarjeta from './ui/tarjeta'

export default function FormularioReporte({ onEnviar, cargando }) {
  const [descripcion, setDescripcion] = useState('')
  const [lugar, setLugar] = useState('')
  const [fotos, setFotos] = useState([])
  const inputGaleria = useRef(null)

  const manejarNuevaFoto = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const nuevasFotos = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
      setFotos([...fotos, ...nuevasFotos])
    }
    // Limpiar el input para permitir seleccionar la misma foto de nuevo
    e.target.value = ''
  }

  const eliminarFoto = (index) => {
    const nuevasFotos = fotos.filter((_, i) => i !== index)
    // Liberar memoria del preview
    URL.revokeObjectURL(fotos[index].preview)
    setFotos(nuevasFotos)
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    const archivos = fotos.map(foto => foto.file)
    await onEnviar({ descripcion, lugar }, archivos)
    setDescripcion('')
    setLugar('')
    // Liberar memoria de todos los previews
    fotos.forEach(foto => URL.revokeObjectURL(foto.preview))
    setFotos([])
  }

  return (
    <Tarjeta className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Reporte</h2>
          <p className="text-sm text-gray-500">Completa la información del trabajo realizado</p>
        </div>
      </div>
      
      <form onSubmit={manejarEnvio} className="space-y-5">
        <Input
          label="Descripción del trabajo"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Describe detalladamente el trabajo realizado..."
          required
        />

        <Input
          label="Ubicación"
          value={lugar}
          onChange={(e) => setLugar(e.target.value)}
          placeholder="Ej: Oficina Central - Piso 3, Sala de Servidores"
          required
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Fotografías del trabajo {fotos.length > 0 && `(${fotos.length})`}
          </label>
          
          {/* Botón para agregar fotos */}
          <button
            type="button"
            onClick={() => inputGaleria.current?.click()}
            className="w-full flex flex-col items-center justify-center px-4 py-8 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 transition-all group mb-4"
          >
            <svg className="w-12 h-12 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-base font-semibold text-indigo-700">Agregar Fotografías</span>
            <span className="text-sm text-indigo-600 mt-1">Haz clic para seleccionar o tomar fotos</span>
          </button>

          {/* Input oculto */}
          <input
            ref={inputGaleria}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={manejarNuevaFoto}
            className="hidden"
          />

          {/* Grid de fotos seleccionadas */}
          {fotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {fotos.map((foto, index) => (
                <div key={index} className="relative group">
                  <img
                    src={foto.preview}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => eliminarFoto(index)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black bg-opacity-60 text-white text-xs rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {fotos.length === 0 && (
            <div className="text-center py-4 px-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">
                No hay fotos seleccionadas. Usa los botones de arriba para agregar fotos.
              </p>
            </div>
          )}
        </div>

        <div className="pt-4">
          <Boton type="submit" tipo="primary" disabled={cargando} className="w-full">
            {cargando ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enviando reporte...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Enviar Reporte
              </span>
            )}
          </Boton>
        </div>
      </form>
    </Tarjeta>
  )
}
