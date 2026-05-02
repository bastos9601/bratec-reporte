-- ============================================
-- RESET COMPLETO Y CONFIGURACIÓN
-- Ejecuta TODO este script en Supabase SQL Editor
-- ============================================

-- 1. ELIMINAR TODO Y EMPEZAR DE CERO
DROP TABLE IF EXISTS reportes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- 2. CREAR TABLA USUARIOS
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'tecnico')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREAR TABLA REPORTES
CREATE TABLE reportes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tecnico_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  lugar TEXT NOT NULL,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CREAR ÍNDICES
CREATE INDEX idx_reportes_tecnico_id ON reportes(tecnico_id);
CREATE INDEX idx_reportes_created_at ON reportes(created_at DESC);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- 5. DESHABILITAR RLS (para que funcione primero)
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE reportes DISABLE ROW LEVEL SECURITY;

-- 6. INSERTAR USUARIO ADMIN
-- Primero obtén el ID del usuario de auth.users
-- Ejecuta: SELECT id, email FROM auth.users WHERE email = 'bradatecsrl@gmail.com';
-- Luego reemplaza 'USER_ID_AQUI' con el ID real

-- DESCOMENTA Y REEMPLAZA EL ID:
-- INSERT INTO usuarios (id, email, rol)
-- VALUES ('USER_ID_AQUI', 'bradatecsrl@gmail.com', 'admin');

-- 7. VERIFICAR
SELECT 'Tablas creadas correctamente' as status;
SELECT * FROM usuarios;

-- ============================================
-- DESPUÉS DE EJECUTAR ESTE SCRIPT:
-- 1. Ejecuta: SELECT id, email FROM auth.users;
-- 2. Copia el ID del usuario bradatecsrl@gmail.com
-- 3. Ejecuta el INSERT de arriba con ese ID
-- ============================================
