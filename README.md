# Sistema de Reportes

Aplicación moderna de gestión de reportes con React y Supabase.

## 🚀 Instalación

```bash
npm install
```

## ⚙️ Configuración

1. Crea un archivo `.env` basado en `.env.example`
2. Configura tu proyecto en Supabase
3. Agrega las credenciales en el archivo `.env`

## 📊 Base de Datos Supabase

### Tabla: usuarios
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'tecnico')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: reportes
```sql
CREATE TABLE reportes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tecnico_id UUID REFERENCES usuarios(id),
  descripcion TEXT NOT NULL,
  lugar TEXT NOT NULL,
  imagen_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Storage Bucket
- Nombre: `reportes`
- Público: Sí

### RLS (Row Level Security)

**Tabla usuarios:**
```sql
-- Admin puede ver todos
CREATE POLICY "Admin puede ver todos" ON usuarios
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM usuarios WHERE rol = 'admin')
  );

-- Técnico puede ver su propio perfil
CREATE POLICY "Técnico puede ver su perfil" ON usuarios
  FOR SELECT USING (auth.uid() = id);
```

**Tabla reportes:**
```sql
-- Admin puede ver todos
CREATE POLICY "Admin puede ver todos" ON reportes
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM usuarios WHERE rol = 'admin')
  );

-- Técnico puede ver sus reportes
CREATE POLICY "Técnico puede ver sus reportes" ON reportes
  FOR SELECT USING (tecnico_id = auth.uid());

-- Técnico puede crear reportes
CREATE POLICY "Técnico puede crear reportes" ON reportes
  FOR INSERT WITH CHECK (tecnico_id = auth.uid());
```

**Storage reportes:**
```sql
-- Permitir subida a técnicos
CREATE POLICY "Técnicos pueden subir" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'reportes');

-- Permitir lectura pública
CREATE POLICY "Lectura pública" ON storage.objects
  FOR SELECT USING (bucket_id = 'reportes');
```

## 🎯 Desarrollo

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## ✨ Características

- ✅ Autenticación con Supabase
- ✅ Panel Admin y Técnico
- ✅ Subida de imágenes
- ✅ Diseño moderno y responsive
- ✅ Animaciones suaves
- ✅ Notificaciones toast
- ✅ RLS para seguridad
