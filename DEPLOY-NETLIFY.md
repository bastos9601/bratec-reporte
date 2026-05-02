# Guía de Despliegue en Netlify

## Opción 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Preparar el repositorio
```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Preparar proyecto para Netlify"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### Paso 2: Conectar con Netlify
1. Ve a https://app.netlify.com/
2. Haz clic en "Add new site" > "Import an existing project"
3. Selecciona "GitHub" y autoriza Netlify
4. Selecciona tu repositorio
5. Configura el build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Branch to deploy**: `main`

### Paso 3: Configurar Variables de Entorno
En Netlify, ve a:
- Site settings > Environment variables
- Agrega las siguientes variables:
  - `VITE_SUPABASE_URL`: Tu URL de Supabase
  - `VITE_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase

### Paso 4: Deploy
- Haz clic en "Deploy site"
- Netlify construirá y desplegará tu aplicación automáticamente

---

## Opción 2: Despliegue Manual con Netlify CLI

### Paso 1: Instalar Netlify CLI
```bash
npm install -g netlify-cli
```

### Paso 2: Login en Netlify
```bash
netlify login
```

### Paso 3: Construir el proyecto
```bash
npm run build
```

### Paso 4: Desplegar
```bash
# Primera vez (crear nuevo sitio)
netlify deploy --prod

# O si ya tienes un sitio
netlify deploy --prod --dir=dist
```

---

## Opción 3: Despliegue con Drag & Drop

### Paso 1: Construir el proyecto
```bash
npm run build
```

### Paso 2: Subir manualmente
1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `dist` a la zona de drop
3. Netlify desplegará tu sitio automáticamente

### Paso 3: Configurar Variables de Entorno
- Ve a tu sitio en Netlify
- Site settings > Environment variables
- Agrega las variables de Supabase

---

## Verificación Post-Despliegue

### 1. Verificar que el sitio carga correctamente
- Abre la URL de Netlify
- Verifica que el login funcione
- Prueba crear un reporte

### 2. Verificar las rutas
- Navega entre diferentes páginas
- Recarga la página en diferentes rutas
- Todas las rutas deben funcionar gracias a `netlify.toml`

### 3. Verificar variables de entorno
- Si hay errores de conexión a Supabase
- Verifica que las variables estén configuradas correctamente
- Reconstruye el sitio si es necesario

---

## Configuración de Dominio Personalizado (Opcional)

### En Netlify:
1. Ve a Site settings > Domain management
2. Haz clic en "Add custom domain"
3. Ingresa tu dominio
4. Sigue las instrucciones para configurar DNS

---

## Actualizaciones Automáticas

Si usaste la Opción 1 (GitHub):
- Cada vez que hagas `git push` a la rama `main`
- Netlify reconstruirá y desplegará automáticamente
- Puedes ver el progreso en el dashboard de Netlify

---

## Solución de Problemas

### Error: "Build failed"
- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en Netlify
- Asegúrate de que todas las dependencias estén en `package.json`

### Error: "Page not found" en rutas
- Verifica que `netlify.toml` esté en la raíz del proyecto
- Asegúrate de que la redirección esté configurada

### Error: "Cannot connect to Supabase"
- Verifica las variables de entorno en Netlify
- Asegúrate de usar el prefijo `VITE_` en las variables
- Reconstruye el sitio después de agregar variables

---

## Comandos Útiles

```bash
# Ver el estado del sitio
netlify status

# Ver logs
netlify logs

# Abrir el sitio en el navegador
netlify open

# Abrir el dashboard de Netlify
netlify open:admin

# Ver las variables de entorno
netlify env:list
```

---

## Recursos Adicionales

- [Documentación de Netlify](https://docs.netlify.com/)
- [Netlify CLI](https://cli.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
