import { supabase } from './supabaseCliente'

export const obtenerUsuarioActual = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('No hay usuario autenticado')
      return null
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, rol, nombre')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error al obtener usuario de la tabla:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error en obtenerUsuarioActual:', error)
    return null
  }
}

export const crearTecnico = async (email, password, nombre) => {
  try {
    // Guardar la sesión actual del admin
    const { data: { session: sessionActual } } = await supabase.auth.getSession()
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          nombre: nombre || null
        }
      }
    })

    if (authError) {
      console.error('Error de autenticación:', authError)
      throw new Error(authError.message || 'Error al crear usuario en autenticación')
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario')
    }

    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([{
        id: authData.user.id,
        email,
        rol: 'tecnico',
        nombre: nombre || null,
        activo: true
      }])

    if (dbError) {
      console.error('Error en base de datos:', dbError)
      throw new Error(dbError.message || 'Error al guardar usuario en la base de datos')
    }

    // Restaurar la sesión del admin
    if (sessionActual) {
      await supabase.auth.setSession({
        access_token: sessionActual.access_token,
        refresh_token: sessionActual.refresh_token
      })
    }

    return authData.user
  } catch (error) {
    console.error('Error completo al crear técnico:', error)
    throw error
  }
}

export const iniciarSesion = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export const cerrarSesion = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const obtenerTodosUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre, rol, activo, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    throw error
  }
}

export const cambiarEstadoUsuario = async (usuarioId, activo) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ activo })
      .eq('id', usuarioId)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error)
    throw error
  }
}

export const actualizarUsuario = async (usuarioId, datos) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update(datos)
      .eq('id', usuarioId)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    throw error
  }
}

export const eliminarUsuario = async (usuarioId) => {
  try {
    // Primero eliminar de la tabla usuarios
    const { error: dbError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', usuarioId)

    if (dbError) throw dbError

    // Nota: Para eliminar completamente de Supabase Auth, 
    // necesitarías usar la API de administración desde el backend
    return true
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    throw error
  }
}
