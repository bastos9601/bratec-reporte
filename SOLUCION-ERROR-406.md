# Solución al Error 406 de Supabase

## Problema
El error 406 (Not Acceptable) ocurre porque las políticas RLS (Row Level Security) están bloqueando el acceso a las tablas.

## Solución Rápida

### Paso 1: Ir a Supabase Dashboard
1. Abre tu proyecto en https://supabase.com/dashboard
2. Ve a **SQL Editor** en el menú lateral

### Paso 2: Ejecutar el Script de Corrección
Copia y pega el contenido del archivo `supabase-fix-rls.sql` en el SQL Editor y ejecuta:

```sql
-- Desactivar RLS temporalmente
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE reportes DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "usuarios_select_own" ON usuarios;
DROP POLICY IF EXISTS "usuarios_select_admin" ON usuarios;
DROP POLICY IF EXISTS "usuarios_insert" ON usuarios;
DROP POLICY IF EXISTS "reportes_select_own" ON reportes;
DROP POLICY IF EXISTS "reportes_select_admin" ON reportes;
DROP POLICY IF EXISTS "reportes_insert" ON reportes;
DROP POLICY IF EXISTS "reportes_update" ON reportes;
DROP POLICY IF EXISTS "reportes_delete" ON reportes;
```

### Paso 3: Reiniciar la Aplicación
```bash
npm run dev
```

## Cambios Realizados en el Código

1. **usuariosServicio.js**: Mejorado el manejo de errores con `maybeSingle()` en lugar de `single()`
2. **supabaseCliente.js**: Agregada configuración de autenticación
3. **reportesServicio.js**: Simplificada la consulta de reportes y mejorado manejo de errores

## Verificación
Después de ejecutar el script, verifica que RLS esté desactivado:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('usuarios', 'reportes');
```

Debe mostrar `rowsecurity = false` para ambas tablas.

## Nota de Seguridad
⚠️ Desactivar RLS es solo para desarrollo. En producción, deberás configurar las políticas correctamente usando el archivo `supabase-rls-final.sql`.
