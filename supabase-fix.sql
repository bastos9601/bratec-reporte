-- ============================================
-- SCRIPT DE CORRECCIÓN RÁPIDA
-- Ejecuta esto en Supabase SQL Editor
-- ============================================

-- 1. ELIMINAR POLÍTICAS EXISTENTES (si causan conflictos)
DROP POLICY IF EXISTS "Admin puede ver todos los usuarios" ON usuarios;
DROP POLICY IF EXISTS "Técnico puede ver su perfil" ON usuarios;
DROP POLICY IF EXISTS "Admin puede crear usuarios" ON usuarios;
DROP POLICY IF EXISTS "Admin puede ver todos los reportes" ON reportes;
DROP POLICY IF EXISTS "Técnico puede ver sus reportes" ON reportes;
DROP POLICY IF EXISTS "Técnico puede crear reportes" ON reportes;
DROP POLICY IF EXISTS "Técnico puede actualizar sus reportes" ON reportes;
DROP POLICY IF EXISTS "Técnico puede eliminar sus reportes" ON reportes;

-- 2. DESHABILITAR RLS TEMPORALMENTE PARA PRUEBAS
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE reportes DISABLE ROW LEVEL SECURITY;

-- 3. VERIFICAR QUE EL USUARIO ADMIN EXISTE
-- Reemplaza 'bradatecsrl@gmail.com' con tu email si es diferente
UPDATE usuarios 
SET rol = 'admin' 
WHERE email = 'bradatecsrl@gmail.com';

-- Si no existe, insértalo (reemplaza USER_ID con el ID del usuario de auth.users)
-- Para obtener el ID, ejecuta: SELECT id, email FROM auth.users;
-- INSERT INTO usuarios (id, email, rol)
-- VALUES ('TU_USER_ID_AQUI', 'bradatecsrl@gmail.com', 'admin');

-- 4. VERIFICAR DATOS
SELECT * FROM usuarios;
SELECT * FROM reportes;

-- ============================================
-- NOTA: Con RLS deshabilitado, la app funcionará
-- Una vez que funcione, ejecuta supabase-rls-final.sql
-- para habilitar la seguridad correctamente
-- ============================================
