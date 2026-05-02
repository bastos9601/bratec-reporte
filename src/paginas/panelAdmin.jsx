import { useState, useEffect } from 'react'
import { obtenerReportes } from '../servicios/reportesServicio'
import { crearTecnico, obtenerTodosUsuarios, cambiarEstadoUsuario, actualizarUsuario, eliminarUsuario } from '../servicios/usuariosServicio'
import { useAuth } from '../contexto/authContexto'
import ListaReportes from '../componentes/listaReportes'
import ListaUsuarios from '../componentes/listaUsuarios'
import Header from '../componentes/ui/header'
import Tarjeta from '../componentes/ui/tarjeta'
import Input from '../componentes/ui/input'
import Boton from '../componentes/ui/boton'
import Toast from '../componentes/ui/toast'
import Modal from '../componentes/ui/modal'

export default function PanelAdmin({ vistaActual, setVistaActual }) {
  const { usuario } = useAuth()
  const [reportes, setReportes] = useState([])
  const [reportesFiltrados, setReportesFiltrados] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [creandoTecnico, setCreandoTecnico] = useState(false)
  const [toast, setToast] = useState(null)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [nombreEditar, setNombreEditar] = useState('')
  const [emailEditar, setEmailEditar] = useState('')
  const [busquedaTecnico, setBusquedaTecnico] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    filtrarReportes()
  }, [reportes, busquedaTecnico, fechaInicio, fechaFin])

  const filtrarReportes = () => {
    let reportesFiltrados = [...reportes]

    // Filtrar por nombre de técnico
    if (busquedaTecnico) {
      reportesFiltrados = reportesFiltrados.filter(reporte => {
        const nombreTecnico = reporte.tecnico?.nombre || reporte.tecnico?.email || ''
        return nombreTecnico.toLowerCase().includes(busquedaTecnico.toLowerCase())
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
    setBusquedaTecnico('')
    setFechaInicio('')
    setFechaFin('')
  }

  const cargarDatos = async () => {
    try {
      const [reportesData, usuariosData] = await Promise.all([
        obtenerReportes(),
        obtenerTodosUsuarios()
      ])
      setReportes(reportesData)
      setUsuarios(usuariosData)
    } catch (error) {
      setToast({ mensaje: 'Error al cargar datos', tipo: 'error' })
    } finally {
      setCargando(false)
    }
  }

  const manejarCrearTecnico = async (e) => {
    e.preventDefault()
    setCreandoTecnico(true)

    try {
      await crearTecnico(email, password, nombre)
      setToast({ mensaje: '✅ Técnico creado exitosamente', tipo: 'success' })
      setNombre('')
      setEmail('')
      setPassword('')
      await cargarDatos()
    } catch (error) {
      console.error('Error completo:', error)
      const mensajeError = error.message || 'Error al crear técnico'
      setToast({ mensaje: mensajeError, tipo: 'error' })
    } finally {
      setCreandoTecnico(false)
    }
  }

  const manejarCambiarEstado = async (usuarioId, nuevoEstado) => {
    try {
      await cambiarEstadoUsuario(usuarioId, nuevoEstado)
      setToast({ 
        mensaje: `✅ Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`, 
        tipo: 'success' 
      })
      await cargarDatos()
    } catch (error) {
      setToast({ mensaje: 'Error al cambiar estado del usuario', tipo: 'error' })
    }
  }

  const abrirModalEditar = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setNombreEditar(usuario.nombre || '')
    setEmailEditar(usuario.email)
    setModalEditar(true)
  }

  const manejarEditar = async (e) => {
    e.preventDefault()
    try {
      await actualizarUsuario(usuarioSeleccionado.id, {
        nombre: nombreEditar,
        email: emailEditar
      })
      setToast({ mensaje: '✅ Usuario actualizado exitosamente', tipo: 'success' })
      setModalEditar(false)
      await cargarDatos()
    } catch (error) {
      setToast({ mensaje: 'Error al actualizar usuario', tipo: 'error' })
    }
  }

  const abrirModalEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setModalEliminar(true)
  }

  const manejarEliminar = async () => {
    try {
      await eliminarUsuario(usuarioSeleccionado.id)
      setToast({ mensaje: '✅ Usuario eliminado exitosamente', tipo: 'success' })
      setModalEliminar(false)
      await cargarDatos()
    } catch (error) {
      setToast({ mensaje: 'Error al eliminar usuario', tipo: 'error' })
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <Header titulo="Panel Administrador" usuario={usuario} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Tarjeta hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Reportes</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{reportes.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Tarjeta>

        <Tarjeta hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Usuarios</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{usuarios.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </Tarjeta>

        <Tarjeta hover className="sm:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Crear Nuevo Técnico</h3>
              <p className="text-xs sm:text-sm text-gray-500">Agrega un nuevo usuario técnico al sistema</p>
            </div>
          </div>
          <form onSubmit={manejarCrearTecnico} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              required
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
            <Boton type="submit" tipo="success" disabled={creandoTecnico} className="h-[42px] whitespace-nowrap">
              {creandoTecnico ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando...
                </span>
              ) : (
                'Crear'
              )}
            </Boton>
          </form>
        </Tarjeta>
      </div>

      <div>
        {vistaActual === 'reportes' ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Todos los Reportes</h2>
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
                    Buscar por técnico
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={busquedaTecnico}
                      onChange={(e) => setBusquedaTecnico(e.target.value)}
                      placeholder="Nombre o email del técnico"
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

                {(busquedaTecnico || fechaInicio || fechaFin) && (
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
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                {usuarios.length}
              </span>
            </div>
            <ListaUsuarios 
              usuarios={usuarios} 
              onCambiarEstado={manejarCambiarEstado}
              onEditar={abrirModalEditar}
              onEliminar={abrirModalEliminar}
            />
          </>
        )}
      </div>

      <Modal isOpen={modalEditar} onClose={() => setModalEditar(false)} titulo="Editar Usuario">
        <form onSubmit={manejarEditar} className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            value={nombreEditar}
            onChange={(e) => setNombreEditar(e.target.value)}
            placeholder="Nombre del técnico"
            required
          />
          <Input
            label="Correo electrónico"
            type="email"
            value={emailEditar}
            onChange={(e) => setEmailEditar(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />
          <div className="flex gap-3 pt-4">
            <Boton type="button" onClick={() => setModalEditar(false)} className="flex-1">
              Cancelar
            </Boton>
            <Boton type="submit" tipo="primary" className="flex-1">
              Guardar
            </Boton>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalEliminar} onClose={() => setModalEliminar(false)} titulo="Eliminar Usuario">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-semibold text-red-900 mb-1">¿Estás seguro?</h4>
                <p className="text-sm text-red-700">
                  Esta acción eliminará permanentemente al usuario <strong>{usuarioSeleccionado?.nombre || usuarioSeleccionado?.email}</strong> y no se puede deshacer.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Boton type="button" onClick={() => setModalEliminar(false)} className="flex-1">
              Cancelar
            </Boton>
            <Boton type="button" tipo="danger" onClick={manejarEliminar} className="flex-1">
              Eliminar
            </Boton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
