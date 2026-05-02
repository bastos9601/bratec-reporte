-- Agregar columna nombre a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS nombre VARCHAR(255);

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'usuarios';
