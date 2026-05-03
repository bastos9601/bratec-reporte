import { supabase } from './supabaseCliente'

export const crearReporte = async (reporte, archivos) => {
  const imagenesUrls = []

  // Subir múltiples archivos si existen
  if (archivos && archivos.length > 0) {
    for (const archivo of archivos) {
      const nombreArchivo = `${Date.now()}_${Math.random().toString(36).substring(7)}_${archivo.name}`
      const { data, error } = await supabase.storage
        .from('reportes')
        .upload(nombreArchivo, archivo)

      if (error) {
        console.error('Error al subir archivo:', error)
        continue // Continuar con las demás fotos si una falla
      }

      const { data: urlData } = supabase.storage
        .from('reportes')
        .getPublicUrl(nombreArchivo)
      
      imagenesUrls.push(urlData.publicUrl)
    }
  }

  // Guardar con array de URLs y también la primera como imagen_url para compatibilidad
  const { data, error } = await supabase
    .from('reportes')
    .insert([{ 
      ...reporte, 
      imagenes_urls: imagenesUrls,
      imagen_url: imagenesUrls.length > 0 ? imagenesUrls[0] : null // Primera imagen para compatibilidad
    }])
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

export const eliminarReporte = async (reporteId, imagenUrl, imagenesUrls) => {
  try {
    // Eliminar todas las imágenes del storage
    const imagenesAEliminar = []
    
    // Agregar imágenes del array
    if (imagenesUrls && imagenesUrls.length > 0) {
      imagenesUrls.forEach(url => {
        const nombreArchivo = url.split('/').pop()
        imagenesAEliminar.push(nombreArchivo)
      })
    } else if (imagenUrl) {
      // Fallback a imagen_url si no hay array
      const nombreArchivo = imagenUrl.split('/').pop()
      imagenesAEliminar.push(nombreArchivo)
    }

    // Eliminar archivos del storage
    if (imagenesAEliminar.length > 0) {
      await supabase.storage
        .from('reportes')
        .remove(imagenesAEliminar)
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
