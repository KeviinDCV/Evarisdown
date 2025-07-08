import os
import json
import uuid
import time
import sys
import shutil
import subprocess
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import requests
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Configuración
UPLOAD_FOLDER = 'downloads'
ALLOWED_EXTENSIONS = {'mp4', 'mp3', 'webm', 'mkv'}
HISTORY_FILE = 'download_history.json'

# Ubicación específica de FFmpeg instalado por winget
FFMPEG_PATH = r"C:\Users\ecom03311\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-7.1.1-full_build\bin\ffmpeg.exe"
FFMPEG_AVAILABLE = os.path.exists(FFMPEG_PATH)

print(f"FFmpeg encontrado en: {FFMPEG_PATH}")
print(f"FFmpeg disponible: {FFMPEG_AVAILABLE}")

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Historial de descargas
download_history = []
if os.path.exists(HISTORY_FILE):
    try:
        with open(HISTORY_FILE, 'r') as f:
            download_history = json.load(f)
    except:
        download_history = []

def save_history():
    with open(HISTORY_FILE, 'w') as f:
        json.dump(download_history, f)

def get_platform(url):
    if 'youtube.com' in url or 'youtu.be' in url:
        return 'youtube'
    elif 'instagram.com' in url:
        return 'instagram'
    elif 'tiktok.com' in url:
        return 'tiktok'
    elif 'twitter.com' in url or 'x.com' in url:
        return 'twitter'
    elif 'facebook.com' in url:
        return 'facebook'
    else:
        return 'other'

@app.route('/api/info', methods=['POST'])
def get_video_info():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({'error': 'URL no proporcionada'}), 400
    
    try:
        # Configuración actualizada para yt-dlp
        ydl_opts = {
            'skip_download': True,
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,  # Cambiar a False para extraer más información
            'force_generic_extractor': False
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extraer información del video
            info = ydl.extract_info(url, download=False)
            
            # Generar un ID único para el video
            video_id = str(uuid.uuid4())
            
            # Extraer y limpiar información
            platform = get_platform(url)
            
            # Obtener título y limpiarlo
            title = info.get('title', 'Título desconocido').strip()
            
            # Manejar diferentes campos de autor según la plataforma
            if platform == 'youtube':
                # YouTube puede tener channel, uploader, o creator
                author = info.get('uploader', 
                         info.get('channel', 
                         info.get('creator', 'Autor desconocido'))).strip()
                # Algunos videos de YouTube incluyen " - Topic" en el nombre del canal
                if author.endswith(' - Topic'):
                    author = author[:-8].strip()
            elif platform == 'tiktok':
                # TikTok suele tener username o uploader
                author = info.get('uploader', 
                         info.get('uploader_id', 
                         info.get('creator', ''))).strip()
                # Algunos extractores añaden "@" al username, asegurar consistencia
                if author and not author.startswith('@'):
                    author = '@' + author
            else:
                # Para otras plataformas
                author = info.get('uploader', 
                         info.get('channel', 
                         info.get('creator', 
                         info.get('uploader_id', 'Autor desconocido')))).strip()
            
            # Obtener mejor miniatura disponible
            thumbnails = info.get('thumbnails', [])
            thumbnail = ''
            if thumbnails:
                # Intentar encontrar la miniatura de mejor calidad
                # Ordenar por resolución si está disponible
                thumbnails_with_resolution = [(t.get('width', 0) * t.get('height', 0), t.get('url', '')) 
                                             for t in thumbnails if t.get('url')]
                
                if thumbnails_with_resolution:
                    # Usar la miniatura de mayor resolución
                    thumbnails_with_resolution.sort(reverse=True)
                    thumbnail = thumbnails_with_resolution[0][1]
                else:
                    # Si no hay información de resolución, usar la última miniatura
                    for t in reversed(thumbnails):
                        if t.get('url'):
                            thumbnail = t.get('url')
                            break
            
            if not thumbnail and info.get('thumbnail'):
                thumbnail = info.get('thumbnail')
            
            # Manejar duración (puede estar en diferentes formatos)
            duration = info.get('duration')
            if duration is not None:
                duration_min = int(duration) // 60
                duration_sec = int(duration) % 60
                duration_str = f"{duration_min}:{duration_sec:02d}"
            else:
                duration_str = "0:00"
            
            # Manejar conteo de vistas
            views = info.get('view_count')
            views_str = str(views) if views is not None else "0"
            
            # Preparar objeto de respuesta
            response = {
                'id': video_id,
                'title': title,
                'thumbnail': thumbnail,
                'duration': duration_str,
                'views': views_str,
                'author': author,
                'platform': platform
            }
            
            return jsonify(response)
    
    except Exception as e:
        print(f"Error al obtener información del video: {e}")
        return jsonify({'error': f'No se pudo obtener información del video: {str(e)}'}), 500

@app.route('/api/formats', methods=['POST'])
def get_formats():
    data = request.get_json()
    url = data.get('url')
    video_id = data.get('videoId')
    
    if not url or not video_id:
        return jsonify({'error': 'URL o ID de video no proporcionados'}), 400
    
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'skip_download': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = info.get('formats', [])
            
            # Filtrar y preparar formatos
            available_formats = []
            
            # Agregar opciones de calidad específicas
            available_formats.append({
                'id': 'opt-best',
                'label': 'Ultra HD (4K/2K)',
                'quality': 'Máxima',
                'format': 'mp4',
                'fileSize': 'Grande',
            })
            
            available_formats.append({
                'id': 'opt-1080',
                'label': 'Full HD (1080p)',
                'quality': '1080p',
                'format': 'mp4',
                'fileSize': 'Mediano',
            })
            
            available_formats.append({
                'id': 'opt-720',
                'label': 'HD (720p)',
                'quality': '720p',
                'format': 'mp4',
                'fileSize': 'Pequeño',
            })
            
            available_formats.append({
                'id': 'opt-480',
                'label': 'SD (480p)',
                'quality': '480p',
                'format': 'mp4',
                'fileSize': 'Muy pequeño',
            })
            
            # Siempre añadir opción de MP3 ya que tenemos la ruta directa a FFmpeg
            audio_format = "MP3"
            audio_desc = "Solo Audio MP3 (Alta Calidad)"
                
            available_formats.append({
                'id': 'opt-audio',
                'label': audio_desc,
                'quality': '320kbps',
                'format': audio_format.lower(),
                'fileSize': 'Variable'
            })
            
            return jsonify(available_formats)
    
    except Exception as e:
        print(f"Error al obtener formatos: {e}")
        return jsonify({'error': 'No se pudieron obtener los formatos disponibles'}), 500

@app.route('/api/download', methods=['POST'])
def download_video():
    data = request.get_json()
    url = data.get('url')
    video_id = data.get('videoId')
    option_id = data.get('optionId')
    video_info = data.get('videoInfo')
    
    if not url or not video_id or not option_id or not video_info:
        return jsonify({'error': 'Información incompleta'}), 400
    
    try:
        print(f"Iniciando descarga de video: {url}, opción: {option_id}")
        
        # Mejorar formato del nombre de archivo según la plataforma
        platform = video_info.get('platform', 'other')
        author = video_info.get('author', '').strip()
        title = video_info.get('title', '').strip()
        
        # Generar nombre de archivo limpio según la plataforma
        if platform == 'youtube':
            # Para YouTube, intentar formatear como "Título - Autor"
            # Primero verificar si el título ya contiene al autor
            if author and author.lower() not in title.lower():
                clean_filename = f"{title} - {author}"
            else:
                clean_filename = title
        elif platform == 'tiktok':
            # Para TikTok, usar "@usuario - descripción"
            if author:
                clean_filename = f"@{author} - {title}"
            else:
                clean_filename = title
        elif platform in ['instagram', 'facebook', 'twitter']:
            # Para redes sociales, incluir la plataforma y usuario
            if author:
                clean_filename = f"{platform.capitalize()} - {author} - {title}"
            else:
                clean_filename = f"{platform.capitalize()} - {title}"
        else:
            # Para otras plataformas, solo título
            clean_filename = title
            
        # Reemplazar caracteres problemáticos y limitar longitud
        clean_filename = clean_filename.replace('/', '_').replace('\\', '_')
        clean_filename = clean_filename[:100]  # Limitar longitud a 100 caracteres
        
        # Asegurar que el nombre del archivo sea seguro para el sistema
        safe_filename = secure_filename(clean_filename)
        if not safe_filename:  # Si después de la limpieza queda vacío
            safe_filename = f"download_{str(uuid.uuid4())[:8]}"
            
        # Usar solo un ID corto para evitar nombres muy largos
        short_id = str(uuid.uuid4())[:8]
        output_path = os.path.join(UPLOAD_FOLDER, f"{safe_filename}_{short_id}")
        
        # Imprimir el nombre de archivo que se usará
        print(f"Nombre de archivo generado: {safe_filename}_{short_id}")
        
        # Crear carpeta si no existe
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        
        # Determinar formato basado en la opción
        is_audio_only = option_id == 'opt-audio'
        download_id = str(uuid.uuid4())
        
        # Configuraciones comunes para evitar timeouts
        common_options = {
            'quiet': False,
            'ffmpeg_location': FFMPEG_PATH,
            'socket_timeout': 60,  # Aumenta el timeout de socket a 60 segundos (por defecto es 20)
            'retries': 10,         # Aumenta la cantidad de reintentos a 10 (por defecto es 3)
            'fragment_retries': 10, # Reintentos para fragmentos (importante para videos largos)
            'file_access_retries': 5, # Reintentos para problemas de acceso a archivos
            'extractor_retries': 5,   # Reintentos para el extractor
            'retry_sleep': 5,       # Espera entre reintentos en segundos
            'buffersize': 1024*1024, # Aumenta el tamaño del buffer a 1MB
        }
        
        if is_audio_only:
            # Configuración para audio MP3 usando la ruta específica a FFmpeg
            print("Descargando audio y convirtiendo a MP3 de alta calidad...")
            ydl_opts = {
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '320',
                }],
                'outtmpl': f'{output_path}.%(ext)s',
                **common_options
            }
            final_path = f'{output_path}.mp3'
        else:
            # Configuración para video basada en la resolución seleccionada
            print(f"Descargando video con la opción: {option_id}...")
            print(f"Datos recibidos - optionId: {option_id}, quality: {data.get('quality')}, format: {data.get('format')}")

            # Determinar formato de video según la opción seleccionada
            if option_id == 'opt-best':
                print(">>> Seleccionada máxima calidad (4K/8K/máxima disponible)")
                # Máxima calidad disponible sin restricciones de altura
                format_spec = 'bestvideo[ext=mp4]/bestvideo+bestaudio[ext=m4a]/bestvideo+bestaudio/best[ext=mp4]/best'
            elif option_id == 'opt-1080':
                print(">>> Seleccionada calidad Full HD (1080p)")
                # Full HD 1080p
                format_spec = 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best'
            elif option_id == 'opt-720':
                print(">>> Seleccionada calidad HD (720p)")
                # HD 720p
                format_spec = 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best'
            elif option_id == 'opt-480':
                print(">>> Seleccionada calidad SD (480p)")
                # SD 480p
                format_spec = 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best'
            else:
                # Opción por defecto (1080p)
                print(">>> Usando calidad predeterminada Full HD (1080p)")
                format_spec = 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best'

            print(f">>> Formato final seleccionado: {format_spec}")

            ydl_opts = {
                'format': format_spec,
                'merge_output_format': 'mp4',
                'outtmpl': f'{output_path}.%(ext)s',
                'postprocessors': [{
                    'key': 'FFmpegMetadata',
                }],
                **common_options
            }
            final_path = f'{output_path}.mp4'
        
        # Descargar el contenido
        print(f"Ejecutando descarga con opciones: {ydl_opts}")
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                print(f"Descargando {url}...")
                info = ydl.extract_info(url, download=True)
                print("Extracción de información completada")
                
                # Verificar nombre real del archivo descargado
                if hasattr(info, 'get') and info.get('_filename'):
                    real_filename = info.get('_filename')
                    print(f"Archivo descargado realmente como: {real_filename}")
                    if os.path.exists(real_filename):
                        final_path = real_filename
                
        except Exception as e:
            error_msg = str(e)
            print(f"Error durante la descarga: {error_msg}")
            
            # Si es un error de timeout, intentar con formato más simple
            if "timed out" in error_msg.lower() or "timeout" in error_msg.lower():
                print("Error de timeout, reintentando con formato más simple y más reintentos...")
                
                # Configuraciones más agresivas para manejar timeout
                retry_options = {
                    'quiet': False,
                    'ffmpeg_location': FFMPEG_PATH,
                    'socket_timeout': 120,    # Timeout aún mayor
                    'retries': 20,            # Más reintentos
                    'fragment_retries': 20,
                    'skip_unavailable_fragments': True, # Ignorar fragmentos con problemas
                    'external_downloader': 'aria2c' if shutil.which('aria2c') else None, # Usar aria2c si está disponible
                    'external_downloader_args': ['--min-split-size=1M', '--max-connection-per-server=16'] if shutil.which('aria2c') else None,
                }
                
                # Para video, usar el formato más simple que funcione
                if not is_audio_only:
                    retry_options['format'] = 'best'  # Formato más simple que incluye audio y video
                else:
                    retry_options['format'] = 'bestaudio'
                
                retry_output_path = f'{output_path}_retry'
                retry_options['outtmpl'] = f'{retry_output_path}.%(ext)s'
                
                with yt_dlp.YoutubeDL(retry_options) as ydl:
                    info = ydl.extract_info(url, download=True)
                    
                    # Establecer la ruta del archivo descargado
                    if hasattr(info, 'get') and info.get('ext'):
                        ext = info.get('ext')
                    else:
                        ext = "mp4" if not is_audio_only else "webm"
                    
                    final_path = f'{retry_output_path}.{ext}'
                    print(f"Archivo descargado con formato simple: {final_path}")
                    
                    # Si el audio se descargó como webm o otro formato que no sea mp3, convertirlo
                    if is_audio_only and not final_path.endswith('.mp3'):
                        mp3_path = f'{output_path}.mp3'
                        try:
                            command = [
                                FFMPEG_PATH,
                                '-i', final_path,
                                '-vn',  # Sin video
                                '-ar', '44100',  # Tasa de muestreo
                                '-ac', '2',  # Canales (estéreo)
                                '-b:a', '320k',  # Bitrate
                                mp3_path
                            ]
                            subprocess.run(command, check=True)
                            
                            # Si la conversión fue exitosa, reemplazar la ruta
                            if os.path.exists(mp3_path):
                                # Borrar el archivo original
                                os.remove(final_path)
                                final_path = mp3_path
                                print(f"Audio convertido a MP3: {final_path}")
                        except Exception as conv_error:
                            print(f"Error durante la conversión a MP3: {conv_error}")
            
            elif "ffmpeg" in error_msg.lower() and is_audio_only:
                # Para audio: si falla FFmpeg, intentar sin conversión
                print("Error con FFmpeg, reintentando sin conversión...")
                ydl_opts = {
                    'format': 'bestaudio/best',
                    'outtmpl': f'{output_path}.%(ext)s',
                    'quiet': False,
                    'postprocessors': [],
                    **common_options
                }
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(url, download=True)
                    if hasattr(info, 'get') and info.get('ext'):
                        ext = info.get('ext')
                    else:
                        ext = "webm"
                    final_path = f'{output_path}.{ext}'
                    print(f"Audio descargado sin conversión: {final_path}")
                    
                    # Intentar convertir a MP3 manualmente si no es MP3
                    if not final_path.endswith('.mp3'):
                        try:
                            mp3_path = f'{os.path.splitext(final_path)[0]}.mp3'
                            command = [
                                FFMPEG_PATH,
                                '-i', final_path,
                                '-vn',
                                '-ar', '44100',
                                '-ac', '2',
                                '-b:a', '320k',
                                mp3_path
                            ]
                            subprocess.run(command, check=True)
                            
                            if os.path.exists(mp3_path):
                                os.remove(final_path)
                                final_path = mp3_path
                                print(f"Audio convertido exitosamente a MP3: {final_path}")
                        except Exception as e:
                            print(f"Error convertiendo a MP3: {e}")
            else:
                # Para video: si falla la descarga con formato específico, intentar con formato simple
                print("Error con el formato específico, reintentando con formato simple...")
                ydl_opts = {
                    'format': 'best[ext=mp4]/best',  # Formato simple que incluye audio y video
                    'outtmpl': f'{output_path}.%(ext)s',
                    'quiet': False,
                    'ffmpeg_location': FFMPEG_PATH,
                    **common_options
                }
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(url, download=True)
                    final_path = f'{output_path}.mp4'
                    print(f"Video descargado con formato simple: {final_path}")
        
        # Comprobar si el archivo se ha descargado correctamente
        if not os.path.exists(final_path):
            # Buscar archivos con la base del nombre
            base_filename = os.path.basename(output_path)
            potential_files = [f for f in os.listdir(UPLOAD_FOLDER) if f.startswith(base_filename)]
            
            if potential_files:
                final_path = os.path.join(UPLOAD_FOLDER, potential_files[0])
                print(f"Archivo encontrado con nombre diferente: {final_path}")
                
                # Si queríamos MP3 pero tenemos otro formato, convertir manualmente
                if is_audio_only and not final_path.endswith('.mp3'):
                    print("Convirtiendo manualmente a MP3...")
                    mp3_path = os.path.splitext(final_path)[0] + '.mp3'
                    
                    # Usar subprocess para llamar a FFmpeg directamente
                    try:
                        command = [
                            FFMPEG_PATH,
                            '-i', final_path,
                            '-vn',  # Sin video
                            '-ar', '44100',  # Tasa de muestreo
                            '-ac', '2',  # Canales (estéreo)
                            '-b:a', '320k',  # Bitrate
                            mp3_path
                        ]
                        subprocess.run(command, check=True)
                        
                        # Si la conversión fue exitosa, reemplazar la ruta
                        if os.path.exists(mp3_path):
                            # Borrar el archivo original
                            os.remove(final_path)
                            final_path = mp3_path
                            print(f"Convertido exitosamente a MP3: {final_path}")
                    except Exception as conv_error:
                        print(f"Error durante la conversión manual: {conv_error}")
                        
                # Verificar si el video tiene audio
                if not is_audio_only and final_path.endswith('.mp4'):
                    try:
                        # Verificar si el archivo tiene audio
                        cmd = [
                            FFMPEG_PATH,
                            '-i', final_path,
                            '-af', 'volumedetect',
                            '-f', 'null',
                            '-'
                        ]
                        result = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
                        
                        # Si no hay pista de audio, intentar con otro método
                        if "Stream #0:1" not in result.stderr:
                            print("¡El video no tiene audio! Reintentando con otro método...")
                            
                            # Usar simplemente 'best' que generalmente incluye audio y video juntos
                            new_output = f'{os.path.splitext(final_path)[0]}_with_audio.mp4'
                            with yt_dlp.YoutubeDL({
                                'format': 'best',
                                'outtmpl': new_output,
                                'quiet': False,
                                'ffmpeg_location': FFMPEG_PATH,
                            }) as ydl:
                                ydl.extract_info(url, download=True)
                            
                            if os.path.exists(new_output):
                                os.remove(final_path)  # Eliminar el video sin audio
                                final_path = new_output
                                print(f"Video con audio descargado correctamente: {final_path}")
                    except Exception as audio_check_error:
                        print(f"Error al verificar audio: {audio_check_error}")
            else:
                raise Exception("No se pudo encontrar el archivo descargado")
        
        # Registrar en el historial
        download_entry = {
            'id': download_id,
            'videoInfo': video_info,
            'downloadDate': datetime.now().isoformat(),
            'option': {
                'id': option_id,
                'format': os.path.splitext(final_path)[1][1:],
                'quality': '320kbps' if is_audio_only else video_info.get('quality', 'HD')
            },
            'status': 'completed',
            'filePath': final_path
        }
        
        download_history.append(download_entry)
        save_history()
        
        # Devolver información de la descarga
        return jsonify({
            'success': True,
            'downloadId': download_id,
            'filePath': final_path
        })
        
    except Exception as e:
        error_msg = f"Error al descargar el video: {str(e)}"
        print(error_msg)
        import traceback
        traceback.print_exc()
        
        failed_entry = {
            'id': str(uuid.uuid4()),
            'videoInfo': video_info,
            'downloadDate': datetime.now().isoformat(),
            'option': {
                'id': option_id,
                'format': 'mp3' if option_id == 'opt-audio' else 'mp4',
                'quality': '320kbps' if option_id == 'opt-audio' else 'HD'
            },
            'status': 'failed',
            'error': str(e)
        }
        
        download_history.append(failed_entry)
        save_history()
        
        return jsonify({
            'error': error_msg, 
            'details': str(e)
        }), 500

@app.route('/api/download-file/<download_id>', methods=['GET'])
def download_file(download_id):
    # Buscar la descarga en el historial
    download = next((d for d in download_history if d['id'] == download_id), None)
    
    if not download:
        return jsonify({'error': 'Descarga no encontrada'}), 404
    
    if not os.path.exists(download.get('filePath')):
        return jsonify({'error': 'Archivo no encontrado'}), 404
    
    return send_file(
        download.get('filePath'),
        as_attachment=True,
        download_name=os.path.basename(download.get('filePath'))
    )

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(download_history)

if __name__ == "__main__":
    app.run(debug=True) 