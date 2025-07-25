# 🧠 Coach Emocional AI - Comparador de Modelos

Una aplicación web para comparar respuestas entre GPT-4.1 base y un modelo fine-tuned especializado en coaching emocional.

## 🚀 Características

- **Comparación lado a lado** de modelos GPT-4.1 base vs fine-tuned
- **Interfaz intuitiva** con prompts de ejemplo
- **Autenticación básica** para proteger el acceso
- **Métricas de tokens** y costos en tiempo real
- **Diseño responsive** optimizado para desktop y móvil

## 📁 Estructura del Proyecto

```
coach-emocional-comparador/
├── app/
│   ├── api/
│   │   └── compare/
│   │       └── route.ts          # API endpoint para comparación
│   ├── page.tsx                  # Página principal
│   └── globals.css               # Estilos globales
├── lib/
│   └── systemPrompt.ts           # System prompt del coach emocional
├── middleware.ts                 # Autenticación básica
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## ⚙️ Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# API Key de OpenAI
OPENAI_API_KEY=sk-...

# Modelos a comparar
BASE_MODEL=gpt-4.1-2025-04-14
FT_MODEL=ft:gpt-4.1-2025-04-14:vitaly:coach-salud-emocional:Bwmi6cFQ

# Hiperparámetros para comparación estable
TEMPERATURE=0.2
TOP_P=1
MAX_TOKENS=1024

# Basic Auth para proteger la aplicación
BASIC_AUTH_USER=usuario_pruebas
BASIC_AUTH_PASS=contraseña-muy-larga-y-unica
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔒 Autenticación

La aplicación está protegida con autenticación básica HTTP. Usa las credenciales configuradas en las variables de entorno:

- **Usuario**: `usuario_pruebas` (o el valor de `BASIC_AUTH_USER`)
- **Contraseña**: `contraseña-muy-larga-y-unica` (o el valor de `BASIC_AUTH_PASS`)

## 🎯 Uso de la Aplicación

1. **Accede a la aplicación** con las credenciales configuradas
2. **Escribe una consulta emocional** o usa uno de los ejemplos proporcionados
3. **Haz clic en "Comparar Modelos"** para ver las respuestas lado a lado
4. **Analiza las diferencias** entre el modelo base y el fine-tuned

### Ejemplos de Consultas

- "Me siento muy ansioso últimamente y no sé cómo manejarlo. ¿Podrías ayudarme?"
- "Tengo problemas de autoestima y siempre me comparo con otros. ¿Qué puedo hacer?"
- "Estoy pasando por una ruptura difícil y me siento perdido emocionalmente."
- "¿Cómo puedo gestionar mejor el estrés del trabajo sin que afecte mi vida personal?"

## 🚀 Despliegue

### Despliegue en Vercel (Recomendado)

1. **Subir código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/coach-emocional-comparador.git
   git push -u origin main
   ```

2. **Conectar con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "Import Project"
   - Selecciona tu repositorio de GitHub

3. **Configurar variables de entorno en Vercel**
   - Ve a Settings → Environment Variables
   - Añade todas las variables del archivo `.env.local`

4. **Deploy**
   - Vercel desplegará automáticamente
   - Recibirás una URL pública para acceder

### Despliegue en Netlify

1. **Build settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Variables de entorno**
   - Configura las mismas variables que en `.env.local`

### Despliegue en VPS/Servidor propio

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/coach-emocional-comparador.git
cd coach-emocional-comparador

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
nano .env.local

# Build para producción
npm run build

# Ejecutar en producción
npm start
```

## 🛠️ Desarrollo

### Scripts disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Build para producción
npm run start    # Ejecutar en producción
npm run lint     # Linter de código
```

### Estructura de la API

**GET /api/compare**
- Health check del endpoint
- Retorna estado y modelos configurados

**POST /api/compare**
- Compara respuestas entre modelos
- Body: `{ "prompt": "tu consulta aquí" }`
- Retorna respuestas de ambos modelos con métricas

## 🎨 Personalización

### Modificar el System Prompt

Edita el archivo `lib/systemPrompt.ts` para cambiar el comportamiento del coach:

```typescript
export const SYSTEM_PROMPT = `
Tu nuevo prompt aquí...
`;
```

### Cambiar modelos

Actualiza las variables de entorno:

```env
BASE_MODEL=gpt-4-turbo
FT_MODEL=tu-nuevo-modelo-ft
```

### Estilos y diseño

Los estilos están en:
- `app/globals.css` - Estilos globales
- `tailwind.config.js` - Configuración de Tailwind
- Componentes inline con Tailwind classes

## 📊 Métricas y Monitoreo

La aplicación muestra:
- **Tokens de entrada**: Del prompt + system message
- **Tokens de salida**: De la respuesta generada
- **Total de tokens**: Suma de entrada + salida
- **Timestamp**: Hora de la consulta
- **Configuración**: Temperature, top_p, max_tokens

## 🔧 Solución de Problemas

### Error de autenticación OpenAI
- Verifica que `OPENAI_API_KEY` esté configurada correctamente
- Asegúrate de tener acceso a los modelos especificados

### Error de modelo no encontrado
- Verifica los nombres de los modelos en `BASE_MODEL` y `FT_MODEL`
- Confirma que el modelo fine-tuned esté disponible en tu cuenta

### Error de autenticación básica
- Verifica `BASIC_AUTH_USER` y `BASIC_AUTH_PASS`
- Borra caché del navegador si es necesario

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙋‍♂️ Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la sección de solución de problemas
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

**¡Feliz coaching emocional! 🧠💙** 