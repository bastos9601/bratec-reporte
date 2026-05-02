import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexto/authContexto'
import { RutaProtegida } from './rutas/rutasProtegidas'
import Login from './paginas/login'
import PanelAdminWrapper from './paginas/panelAdminWrapper'
import PanelTecnicoWrapper from './paginas/panelTecnicoWrapper'
import Loader from './componentes/ui/loader'

function RedireccionInicio() {
  const { usuario, cargando } = useAuth()

  if (cargando) return <Loader />

  if (!usuario) return <Navigate to="/login" replace />

  if (usuario.rol === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return <Navigate to="/tecnico" replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<RedireccionInicio />} />

          <Route
            path="/admin"
            element={
              <RutaProtegida rolesPermitidos={['admin']}>
                <PanelAdminWrapper />
              </RutaProtegida>
            }
          />

          <Route
            path="/tecnico"
            element={
              <RutaProtegida rolesPermitidos={['tecnico']}>
                <PanelTecnicoWrapper />
              </RutaProtegida>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
