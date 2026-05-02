-- Agregar columna activo a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Actualizar usuarios existentes para que estén activos por defecto
UPDATE usuarios SET activo = true WHERE activo IS NULL;

-- Verificar que la columna se agregó correctamente
SELECT id, email, nombre, rol, activo 
FROM usuarios;
