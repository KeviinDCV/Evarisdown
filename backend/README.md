# Backend para VideoDownloader Pro

Este es el backend de la aplicación VideoDownloader Pro, desarrollado con Flask y yt-dlp para permitir la descarga de videos de múltiples plataformas como YouTube, Instagram, TikTok, Twitter y Facebook.

## Configuración del Entorno

1. Asegúrate de tener Python 3.8+ instalado

2. Crea un entorno virtual:
   ```
   python -m venv venv
   ```

3. Activa el entorno virtual:
   - En Windows:
     ```
     venv\Scripts\activate
     ```
   - En macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Instala las dependencias:
   ```
   pip install -r requirements.txt
   ```

5. Asegúrate de tener FFmpeg instalado en tu sistema:
   - Windows: Descarga desde [ffmpeg.org](https://ffmpeg.org/download.html) y añade el directorio bin a tu PATH
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt-get install ffmpeg`

## Ejecución

Para iniciar el servidor de desarrollo:

```
python app.py
```

El servidor se ejecutará en http://localhost:5000

## Endpoints de la API

### Obtener información del video
- **URL**: `/api/info`
- **Método**: POST
- **Cuerpo**: `{ "url": "URL_DEL_VIDEO" }`
- **Respuesta**: Información del video (título, miniatura, duración, etc.)

### Obtener formatos disponibles
- **URL**: `/api/formats`
- **Método**: POST
- **Cuerpo**: `{ "url": "URL_DEL_VIDEO", "videoId": "ID_DEL_VIDEO" }`
- **Respuesta**: Lista de formatos disponibles para descarga

### Descargar video
- **URL**: `/api/download`
- **Método**: POST
- **Cuerpo**: `{ "url": "URL_DEL_VIDEO", "videoId": "ID_DEL_VIDEO", "optionId": "ID_DE_OPCION", "videoInfo": {...} }`
- **Respuesta**: Información de la descarga y ID para acceder al archivo

### Obtener historial de descargas
- **URL**: `/api/history`
- **Método**: GET
- **Respuesta**: Lista de descargas realizadas

### Descargar archivo
- **URL**: `/api/download-file/<download_id>`
- **Método**: GET
- **Respuesta**: Archivo descargado

## Estructura de directorios

- `app.py`: Archivo principal de la aplicación
- `requirements.txt`: Dependencias del proyecto
- `downloads/`: Directorio donde se almacenan los archivos descargados
- `download_history.json`: Archivo que guarda el historial de descargas 