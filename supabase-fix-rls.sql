-- ============================================
-- SOLUCIÓN RÁPIDA: DESACTIVAR RLS TEMPORALMENTE
-- Ejecuta esto en el SQL Editor de Supabase
-- ============================================

-- Desactivar RLS en ambas tablas
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE reportes DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "usuarios_select_own" ON usuarios;
DROP POLICY IF EXISTS "usuarios_select_admin" ON usuarios;
DROP POLICY IF EXISTS "usuarios_insert" ON usuarios;
DROP POLICY IF EXISTS "reportes_select_own" ON reportes;
DROP POLICY IF EXISTS "reportes_select_admin" ON reportes;
DROP POLICY IF EXISTS "reportes_insert" ON reportes;
DROP POLICY IF EXISTS "reportes_update" ON reportes;
DROP POLICY IF EXISTS "reportes_delete" ON reportes;

-- Verificar que RLS está desactivado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('usuarios', 'reportes');

-- Debe mostrar rowsecurity = false para ambas tablas
