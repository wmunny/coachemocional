# 🚀 Guía Rápida de Configuración

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con esta configuración:

```bash
# ================================
# 🔑 CONFIGURACIÓN OPENAI
# ================================

# Tu API Key de OpenAI (obligatorio)
OPENAI_API_KEY=sk-proj-...

# Modelo base de GPT-4.1
BASE_MODEL=gpt-4.1-2025-04-14

# Tu modelo fine-tuned específico  
FT_MODEL=ft:gpt-4.1-2025-04-14:vitaly:coach-salud-emocional:Bwmi6cFQ

# ================================
# ⚙️ HIPERPARÁMETROS
# ================================

# Temperatura (0.0-1.0, recomendado 0.2 para consistencia)
TEMPERATURE=0.2

# Top P (0.0-1.0, recomendado 1)
TOP_P=1

# Máximo de tokens por respuesta
MAX_TOKENS=1024

# ================================
# 🔐 AUTENTICACIÓN BÁSICA
# ================================

# Usuario para acceder a la aplicación
BASIC_AUTH_USER=usuario_pruebas

# Contraseña para acceder a la aplicación
BASIC_AUTH_PASS=contraseña-muy-larga-y-unica
```

## ⚠️ Notas Importantes

1. **API Key de OpenAI**: 
   - Obtén tu API key desde https://platform.openai.com/api-keys
   - Asegúrate de tener créditos suficientes para usar GPT-4.1

2. **Modelo Fine-Tuned**:
   - Reemplaza `FT_MODEL` con el ID exacto de tu modelo entrenado
   - El formato es: `ft:gpt-4.1-2025-04-14:organization:name:model_id`

3. **Seguridad**:
   - Cambia `BASIC_AUTH_USER` y `BASIC_AUTH_PASS` por credenciales seguras
   - Nunca subas el archivo `.env.local` a Git (ya está en .gitignore)

## 🔧 Verificación de Configuración

Después de configurar las variables, prueba que todo funciona:

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo
npm run dev

# 3. Acceder a http://localhost:3000
# Usuario: usuario_pruebas
# Contraseña: contraseña-muy-larga-y-unica

# 4. Probar el endpoint de health check
curl -u usuario_pruebas:contraseña-muy-larga-y-unica \
     http://localhost:3000/api/compare
```

## 🚀 Comandos de Inicio Rápido

```bash
# Clonar e instalar
git clone <tu-repo>
cd coach-emocional-comparador
npm install

# Configurar entorno
cp SETUP.md .env.local
# Editar .env.local con tus valores

# Ejecutar
npm run dev
```

## 📝 Solución de Problemas Comunes

### Error: "Invalid API Key"
- Verifica que `OPENAI_API_KEY` esté correcta
- Asegúrate de que no haya espacios extras

### Error: "Model not found"
- Confirma que el modelo fine-tuned existe en tu cuenta
- Verifica el formato exacto del ID del modelo

### Error: "Unauthorized" 
- Revisa las credenciales `BASIC_AUTH_USER` y `BASIC_AUTH_PASS`
- Borra caché del navegador

---

¿Todo listo? ¡Prueba tu primer prompt! 🧠✨ 