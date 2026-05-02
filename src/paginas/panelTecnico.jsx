import { useState, useEffect } from 'react'
import { crearReporte, obtenerReportes } from '../servicios/reportesServicio'
import { useAuth } from '../contexto/authContexto'
import FormularioReporte from '../componentes/formularioReporte'
import ListaReportes from '../componentes/listaReportes'
import Header from '../componentes/ui/header'
import Tarjeta from '../componentes/ui/tarjeta'
import Boton from '../componentes/ui/boton'
import Toast from '../componentes/ui/toast'
import Loader from '../componentes/ui/loader'

export default function PanelTecnico() {
  const { usuario } = useAuth()
  const [reportes, setReportes] = useState([])
  const [reportesFiltrados, setReportesFiltrados] = useState([])
  const [cargando, setCargando] = useState(false)
  const [cargandoReportes, setCargandoReportes] = useState(true)
  const [toast, setToast] = useState(null)
  const [busquedaLugar, setBusquedaLugar] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  useEffect(() => {
    cargarReportes()
  }, [usuario])

  useEffect(() => {
    filtrarReportes()
  }, [reportes, busquedaLugar, fechaInicio, fechaFin])

  const filtrarReportes = () => {
    let reportesFiltrados = [...reportes]

    // Filtrar por lugar
    if (busquedaLugar) {
      reportesFiltrados = reportesFiltrados.filter(reporte => {
        const lugar = reporte.lugar || ''
        const descripcion = reporte.descripcion || ''
        const busqueda = busquedaLugar.toLowerCase()
        return lugar.toLowerCase().includes(busqueda) || descripcion.toLowerCase().includes(busqueda)
      })
    }

    // Filtrar por fecha de inicio
    if (fechaInicio) {
      reportesFiltrados = reportesFiltrados.filter(reporte => {
        const fechaReporte = new Date(reporte.created_at)
        const fechaInicioDate = new Date(fechaInicio)
        return fechaReporte >= fechaInicioDate
      })
    }

    // Filtrar por fecha de fin
    if (fechaFin) {
      reportesFiltrados = reportesFiltrados.filter(reporte => {
        const fechaReporte = new Date(reporte.created_at)
        const fechaFinDate = new Date(fechaFin)
        fechaFinDate.setHours(23, 59, 59, 999) // Incluir todo el día
        return fechaReporte <= fechaFinDate
      })
    }

    setReportesFiltrados(reportesFiltrados)
  }

  const limpiarFiltros = () => {
    setBusquedaLugar('')
    setFechaInicio('')
    setFechaFin('')
  }

  const cargarReportes = async () => {
    try {
      const data = await obtenerReportes(usuario.id)
      setReportes(data)
    } catch (error) {
      setToast({ mensaje: 'Error al cargar reportes', tipo: 'error' })
    } finally {
      setCargandoReportes(false)
    }
  }

  const manejarCrearReporte = async (reporte, archivo) => {
    setCargando(true)
    try {
      await crearReporte({ ...reporte, tecnico_id: usuario.id }, archivo)
      setToast({ mensaje: '✅ Reporte creado exitosamente', tipo: 'success' })
      await cargarReportes()
    } catch (error) {
      setToast({ mensaje: 'Error al crear reporte', tipo: 'error' })
    } finally {
      setCargando(false)
    }
  }

  if (cargandoReportes) return <Loader />

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <Header titulo="Panel Técnico" usuario={usuario} />

      <div className="space-y-6 sm:space-y-8">
        <FormularioReporte onEnviar={manejarCrearReporte} cargando={cargando} />

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Mis Reportes</h2>
              <span className="px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-semibold">
                {reportesFiltrados.length}
              </span>
            </div>
          </div>

          {/* Filtros */}
          <Tarjeta className="mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por lugar o descripción
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={busquedaLugar}
                    onChange={(e) => setBusquedaLugar(e.target.value)}
                    placeholder="Buscar en tus reportes..."
                    className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha fin
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {(busquedaLugar || fechaInicio || fechaFin) && (
                <div className="pt-2">
                  <Boton
                    onClick={limpiarFiltros}
                    className="w-full sm:w-auto"
                  >
                    Limpiar filtros
                  </Boton>
                </div>
              )}
            </div>
          </Tarjeta>

          <ListaReportes reportes={reportesFiltrados} />
        </div>
      </div>
    </div>
  )
}
