-- Script para agregar soporte de múltiples imágenes a los reportes
-- Ejecutar en el SQL Editor de Supabase

-- Agregar columna para array de URLs de imágenes
ALTER TABLE reportes 
ADD COLUMN IF NOT EXISTS imagenes_urls TEXT[];

-- Migrar datos existentes: mover imagen_url a imagenes_urls
UPDATE reportes 
SET imagenes_urls = ARRAY[imagen_url]
WHERE imagen_url IS NOT NULL AND imagenes_urls IS NULL;

-- Opcional: Puedes mantener imagen_url para compatibilidad o eliminarlo
-- COMENTAR la siguiente línea si quieres mantener imagen_url
-- ALTER TABLE reportes DROP COLUMN imagen_url;

-- Verificar los cambios
SELECT id, lugar, imagen_url, imagenes_urls 
FROM reportes 
LIMIT 5;
