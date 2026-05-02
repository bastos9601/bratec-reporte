-- ============================================
-- CONFIGURACIÓN COMPLETA DE SUPABASE
-- Sistema de Reportes
-- ============================================

-- ============================================
-- 1. CREAR TABLAS
-- ============================================

-- Tabla de usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'tecnico')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reportes
CREATE TABLE reportes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tecnico_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  lugar TEXT NOT NULL,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_reportes_tecnico_id ON reportes(tecnico_id);
CREATE INDEX idx_reportes_created_at ON reportes(created_at DESC);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- ============================================
-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. POLÍTICAS RLS PARA TABLA USUARIOS
-- ============================================

-- Admin puede ver todos los usuarios
CREATE POLICY "Admin puede ver todos los usuarios"
ON usuarios FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid() AND rol = 'admin'
  )
);

-- Técnico puede ver su propio perfil
CREATE POLICY "Técnico puede ver su perfil"
ON usuarios FOR SELECT
USING (id = auth.uid());

-- Admin puede insertar usuarios (crear técnicos)
CREATE POLICY "Admin puede crear usuarios"
ON usuarios FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid() AND rol = 'admin'
  )
);

-- ============================================
-- 4. POLÍTICAS RLS PARA TABLA REPORTES
-- ============================================

-- Admin puede ver todos los reportes
CREATE POLICY "Admin puede ver todos los reportes"
ON reportes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid() AND rol = 'admin'
  )
);

-- Técnico puede ver solo sus reportes
CREATE POLICY "Técnico puede ver sus reportes"
ON reportes FOR SELECT
USING (tecnico_id = auth.uid());

-- Técnico puede crear sus propios reportes
CREATE POLICY "Técnico puede crear reportes"
ON reportes FOR INSERT
WITH CHECK (tecnico_id = auth.uid());

-- Técnico puede actualizar sus propios reportes
CREATE POLICY "Técnico puede actualizar sus reportes"
ON reportes FOR UPDATE
USING (tecnico_id = auth.uid())
WITH CHECK (tecnico_id = auth.uid());

-- Técnico puede eliminar sus propios reportes
CREATE POLICY "Técnico puede eliminar sus reportes"
ON reportes FOR DELETE
USING (tecnico_id = auth.uid());

-- ============================================
-- 5. FUNCIÓN PARA CREAR USUARIO EN TABLA
-- ============================================

-- Esta función se ejecuta automáticamente cuando se crea un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, rol)
  VALUES (NEW.id, NEW.email, 'tecnico');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función al crear usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. CREAR USUARIO ADMINISTRADOR INICIAL
-- ============================================

-- IMPORTANTE: Primero crea el usuario admin desde el panel de Supabase
-- Authentication > Users > Add User
-- Email: admin@ejemplo.com
-- Password: tu_password_seguro

-- Luego ejecuta esto reemplazando 'ADMIN_USER_ID' con el ID real del usuario creado:
-- INSERT INTO usuarios (id, email, rol)
-- VALUES ('ADMIN_USER_ID', 'admin@ejemplo.com', 'admin');

-- ============================================
-- 7. CONFIGURACIÓN DE STORAGE
-- ============================================

-- NOTA: El bucket 'reportes' debe crearse desde el panel de Supabase:
-- Storage > Create Bucket
-- Nombre: reportes
-- Public: YES

-- Después de crear el bucket, ejecuta estas políticas:

-- Permitir a técnicos subir imágenes
CREATE POLICY "Técnicos pueden subir imágenes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'reportes' AND
  auth.role() = 'authenticated'
);

-- Permitir lectura pública de imágenes
CREATE POLICY "Lectura pública de imágenes"
ON storage.objects FOR SELECT
USING (bucket_id = 'reportes');

-- Permitir a técnicos actualizar sus imágenes
CREATE POLICY "Técnicos pueden actualizar sus imágenes"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'reportes' AND
  auth.role() = 'authenticated'
);

-- Permitir a técnicos eliminar sus imágenes
CREATE POLICY "Técnicos pueden eliminar sus imágenes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'reportes' AND
  auth.role() = 'authenticated'
);

-- ============================================
-- 8. DATOS DE PRUEBA (OPCIONAL)
-- ============================================

-- Descomentar para insertar datos de prueba
-- NOTA: Primero debes crear los usuarios en Authentication

/*
-- Insertar técnico de prueba (reemplaza USER_ID con el ID real)
INSERT INTO usuarios (id, email, rol)
VALUES ('USER_ID_TECNICO', 'tecnico@ejemplo.com', 'tecnico');

-- Insertar reporte de prueba
INSERT INTO reportes (tecnico_id, descripcion, lugar)
VALUES (
  'USER_ID_TECNICO',
  'Instalación de equipo de red completada',
  'Oficina Central - Piso 3'
);
*/

-- ============================================
-- FIN DE LA CONFIGURACIÓN
-- ============================================

-- PASOS FINALES:
-- 1. Crea el bucket 'reportes' en Storage (público)
-- 2. Crea el usuario admin en Authentication
-- 3. Inserta el usuario admin en la tabla usuarios
-- 4. Copia las variables de entorno a tu archivo .env:
--    VITE_SUPABASE_URL=tu_url
--    VITE_SUPABASE_ANON_KEY=tu_key
