import { useState } from 'react'
import Input from './ui/input'
import Boton from './ui/boton'
import Tarjeta from './ui/tarjeta'

export default function FormularioReporte({ onEnviar, cargando }) {
  const [descripcion, setDescripcion] = useState('')
  const [lugar, setLugar] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [preview, setPreview] = useState(null)

  const manejarArchivo = (e) => {
    const file = e.target.files[0]
    if (file) {
      setArchivo(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    await onEnviar({ descripcion, lugar }, archivo)
    setDescripcion('')
    setLugar('')
    setArchivo(null)
    setPreview(null)
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fotografía del trabajo
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={manejarArchivo}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold text-indigo-600">Haz clic para subir</span> o arrastra una imagen
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 10MB</p>
              </div>
            </label>
          </div>
          
          {preview && (
            <div className="mt-4 relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  setArchivo(null)
                  setPreview(null)
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
