import { supabase } from './supabaseCliente'

export const crearReporte = async (reporte, archivo) => {
  let imagenUrl = null

  if (archivo) {
    const nombreArchivo = `${Date.now()}_${archivo.name}`
    const { data, error } = await supabase.storage
      .from('reportes')
      .upload(nombreArchivo, archivo)

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('reportes')
      .getPublicUrl(nombreArchivo)
    
    imagenUrl = urlData.publicUrl
  }

  const { data, error } = await supabase
    .from('reportes')
    .insert([{ ...reporte, imagen_url: imagenUrl }])
    .select()

  if (error) throw error
  return data[0]
}

export const obtenerReportes = async (tecnicoId = null) => {
  try {
    let query = supabase
      .from('reportes')
      .select(`
        *,
        tecnico:tecnico_id (
          id,
          nombre,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (tecnicoId) {
      query = query.eq('tecnico_id', tecnicoId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener reportes:', error)
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Error en obtenerReportes:', error)
    throw error
  }
}

export const eliminarReporte = async (reporteId, imagenUrl) => {
  try {
    // Si hay imagen, eliminarla del storage
    if (imagenUrl) {
      const nombreArchivo = imagenUrl.split('/').pop()
      await supabase.storage
        .from('reportes')
        .remove([nombreArchivo])
    }

    // Eliminar el reporte de la base de datos
    const { error } = await supabase
      .from('reportes')
      .delete()
      .eq('id', reporteId)

    if (error) throw error
  } catch (error) {
    console.error('Error al eliminar reporte:', error)
    throw error
  }
}
