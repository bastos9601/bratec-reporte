-- ============================================
-- HABILITAR RLS CORRECTAMENTE
-- Ejecuta esto DESPUÉS de que la app funcione
-- ============================================

-- 1. HABILITAR RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS PARA USUARIOS
-- Permitir que usuarios autenticados vean su propio perfil
CREATE POLICY "usuarios_select_own"
ON usuarios FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Permitir que admins vean todos los usuarios
CREATE POLICY "usuarios_select_admin"
ON usuarios FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid() 
    AND usuarios.rol = 'admin'
  )
);

-- Permitir insertar usuarios (para el trigger y para admins)
CREATE POLICY "usuarios_insert"
ON usuarios FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. POLÍTICAS PARA REPORTES
-- Técnicos pueden ver sus propios reportes
CREATE POLICY "reportes_select_own"
ON reportes FOR SELECT
TO authenticated
USING (tecnico_id = auth.uid());

-- Admins pueden ver todos los reportes
CREATE POLICY "reportes_select_admin"
ON reportes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid() 
    AND usuarios.rol = 'admin'
  )
);

-- Técnicos pueden crear reportes
CREATE POLICY "reportes_insert"
ON reportes FOR INSERT
TO authenticated
WITH CHECK (tecnico_id = auth.uid());

-- Técnicos pueden actualizar sus reportes
CREATE POLICY "reportes_update"
ON reportes FOR UPDATE
TO authenticated
USING (tecnico_id = auth.uid())
WITH CHECK (tecnico_id = auth.uid());

-- Técnicos pueden eliminar sus reportes
CREATE POLICY "reportes_delete"
ON reportes FOR DELETE
TO authenticated
USING (tecnico_id = auth.uid());

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('usuarios', 'reportes');
