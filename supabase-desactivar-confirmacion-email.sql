-- IMPORTANTE: Esto es solo para desarrollo
-- En producción, debes mantener la confirmación de email activada

-- Este cambio se hace desde el Dashboard de Supabase, no desde SQL
-- Ve a: Authentication > Settings > Email Auth

-- Configuración recomendada para desarrollo:
-- 1. Ve a tu proyecto en https://supabase.com/dashboard
-- 2. Authentication > Settings
-- 3. Busca "Enable email confirmations"
-- 4. Desactívalo temporalmente para desarrollo
-- 5. Guarda los cambios

-- Alternativamente, puedes confirmar manualmente los usuarios:
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'correo@ejemplo.com';

-- Para ver usuarios pendientes de confirmación:
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email_confirmed_at IS NULL;
