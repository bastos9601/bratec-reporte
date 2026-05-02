import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { iniciarSesion } from '../servicios/usuariosServicio'
import Input from '../componentes/ui/input'
import Boton from '../componentes/ui/boton'
import Tarjeta from '../componentes/ui/tarjeta'
import Toast from '../componentes/ui/toast'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [toast, setToast] = useState(null)

  const manejarSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)

    try {
      await iniciarSesion(email, password)
      navigate('/')
    } catch (error) {
      console.error('Error de login:', error)
      setToast({ 
        mensaje: error.message || 'Error al iniciar sesión. Verifica tus credenciales.', 
        tipo: 'error' 
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src="/logotec.png" 
              alt="Logo Bratec" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bradatec
          </h1>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        <Tarjeta className="backdrop-blur-sm bg-white/80">
          <form onSubmit={manejarSubmit} className="space-y-5">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Boton type="submit" tipo="primary" disabled={cargando} className="w-full mt-6">
              {cargando ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </Boton>
          </form>
        </Tarjeta>
      </div>
    </div>
  )
}
