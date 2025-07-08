# Instrucciones para Ejecutar VideoDownloader Pro

## Preparación del Entorno

### Requisitos Previos
- Node.js 14+ instalado
- Python 3.8+ instalado
- FFmpeg instalado 

## Paso 1: Iniciar el Backend (Python/Flask)

1. Abre una terminal o línea de comandos
2. Navega al directorio del backend:
   ```
   cd youtube-downloader/backend
   ```
3. (Opcional) Crea y activa un entorno virtual:
   ```
   # Crear entorno virtual
   python -m venv venv
   
   # Activar en Windows
   venv\Scripts\activate
   
   # Activar en macOS/Linux
   source venv/bin/activate
   ```
4. Instala las dependencias:
   ```
   pip install -r requirements.txt
   ```
5. Inicia el servidor Flask:
   ```
   python app.py
   ```
6. El backend estará funcionando en http://localhost:5000

## Paso 2: Iniciar el Frontend (React)

1. Abre una nueva terminal (mantén la terminal del backend abierta)
2. Navega al directorio del proyecto React:
   ```
   cd youtube-downloader
   ```
3. Instala las dependencias si no lo has hecho:
   ```
   npm install
   ```
4. Inicia la aplicación React:
   ```
   npm start
   ```
5. La aplicación web se abrirá automáticamente en tu navegador en http://localhost:3000

## Uso de la Aplicación

1. En tu navegador, verás la interfaz de VideoDownloader Pro
2. Pega la URL de un video de YouTube, Instagram, TikTok, Twitter o Facebook en el campo de texto
3. Haz clic en el botón "Descargar"
4. La aplicación obtendrá información del video y mostrará:
   - Vista previa del video con detalles (título, autor, duración)
   - Opciones de descarga disponibles (diferentes calidades y formatos)
5. Selecciona tu opción preferida y haz clic en "Descargar"
6. El archivo comenzará a descargarse automáticamente
7. Puedes ver el historial de tus descargas en la pestaña "Historial"

## Solución de Problemas

### El backend no se inicia
- Verifica que Python 3.8+ esté instalado: `python --version`
- Asegúrate de que se hayan instalado todas las dependencias
- Comprueba que FFmpeg esté correctamente instalado en tu sistema

### El frontend no se inicia
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de ejecutar los comandos desde el directorio correcto (`youtube-downloader`)
- Instala las dependencias con `npm install` si no lo has hecho

### No se pueden descargar videos
- Verifica que tanto el backend como el frontend estén ejecutándose
- Asegúrate de que el backend esté accesible en http://localhost:5000
- Comprueba la conexión a internet
- Verifica que la URL del video sea válida y accesible 