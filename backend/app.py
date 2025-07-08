import os
import json
import uuid
import time
import shutil
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import yt_dlp
import requests
from werkzeug.utils import secure_filename
import threading

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  # Configuración CORS mejorada

# Configuración
UPLOAD_FOLDER = 'downloads'
ALLOWED_EXTENSIONS = {'mp4', 'mp3', 'webm', 'mkv'}
HISTORY_FILE = 'download_history.json'
MAX_STORAGE_DAYS = 7  # Días máximos que se guardan los archivos
MAX_STORAGE_SIZE_MB = 10000  # Tamaño máximo del almacenamiento en MB (10GB)
CLEANUP_DELAY = 60  # Segundos para eliminar archivos después de la descarga

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

def delete_file_after_delay(file_path, delay=CLEANUP_DELAY):
    """Elimina un archivo después de un tiempo determinado"""
    def delete_task():
        time.sleep(delay)
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"Archivo eliminado automáticamente después de la descarga: {file_path}")
                
                # Actualizar registro de historial para marcar el archivo como eliminado
                global download_history
                for item in download_history:
                    if item.get('filePath') == file_path:
                        item['fileDeleted'] = True
                        item['filePath'] = None
                save_history()
        except Exception as e:
            print(f"Error al eliminar archivo automáticamente: {e}")
    
    # Iniciar limpieza en un hilo separado
    threading.Thread(target=delete_task).start()
    print(f"Programada eliminación de {file_path} en {delay} segundos")

def clean_old_downloads():
    """Limpia descargas antiguas basado en fecha y tamaño total"""
    try:
        print("Iniciando limpieza de descargas antiguas...")
        # Obtener la fecha límite
        cutoff_date = datetime.now() - timedelta(days=MAX_STORAGE_DAYS)
        cutoff_date_str = cutoff_date.isoformat()
        
        # 1. Eliminar archivos antiguos basados en fecha
        files_deleted = []
        global download_history
        updated_history = []
        
        for item in download_history:
            # Verificar si el item es más antiguo que el límite
            if item.get('downloadDate', '') < cutoff_date_str:
                file_path = item.get('filePath')
                if file_path and os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                        files_deleted.append(file_path)
                        print(f"Archivo eliminado por antigüedad: {file_path}")
                    except Exception as e:
                        print(f"Error al eliminar archivo: {e}")
                # Mantener en el historial pero marcar como eliminado
                item['fileDeleted'] = True
                item['filePath'] = None
                updated_history.append(item)
            else:
                updated_history.append(item)
        
        # 2. Comprobar el tamaño total y eliminar archivos más antiguos si es necesario
        total_size_mb = 0
        download_folder_size = 0
        
        if os.path.exists(UPLOAD_FOLDER):
            for dirpath, dirnames, filenames in os.walk(UPLOAD_FOLDER):
                for f in filenames:
                    fp = os.path.join(dirpath, f)
                    download_folder_size += os.path.getsize(fp)
            
            # Convertir a MB
            total_size_mb = download_folder_size / (1024 * 1024)
            print(f"Tamaño total de la carpeta de descargas: {total_size_mb:.2f} MB")
        
        # Si aún excede el límite, eliminar más archivos empezando por los más antiguos
        if total_size_mb > MAX_STORAGE_SIZE_MB and updated_history:
            print(f"El tamaño de almacenamiento ({total_size_mb:.2f} MB) excede el límite de {MAX_STORAGE_SIZE_MB} MB")
            # Ordenar por fecha de descarga, más antiguo primero
            updated_history.sort(key=lambda x: x.get('downloadDate', ''))
            
            # Eliminar archivos hasta estar por debajo del límite
            for item in updated_history:
                file_path = item.get('filePath')
                if file_path and os.path.exists(file_path) and not item.get('fileDeleted', False):
                    try:
                        file_size = os.path.getsize(file_path) / (1024 * 1024)  # Tamaño en MB
                        os.remove(file_path)
                        total_size_mb -= file_size
                        files_deleted.append(file_path)
                        item['fileDeleted'] = True
                        item['filePath'] = None
                        print(f"Archivo eliminado por exceso de tamaño: {file_path} ({file_size:.2f} MB)")
                    except Exception as e:
                        print(f"Error al eliminar archivo: {e}")
                
                # Salir del bucle si ya estamos por debajo del límite
                if total_size_mb <= MAX_STORAGE_SIZE_MB:
                    break
        
        # Actualizar el historial
        download_history = updated_history
        save_history()
        
        if files_deleted:
            print(f"Se eliminaron {len(files_deleted)} archivos durante la limpieza.")
        else:
            print("No fue necesario eliminar archivos durante la limpieza.")
            
    except Exception as e:
        print(f"Error durante la limpieza de descargas: {e}")

# Ejecutar limpieza al iniciar
clean_old_downloads()

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
            'extract_flat': True,
            'force_generic_extractor': False
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extraer información del video
            info = ydl.extract_info(url, download=False)
            
            # Generar un ID único para el video
            video_id = str(uuid.uuid4())
            
            # Preparar la respuesta con manejo de valores faltantes
            title = info.get('title', 'Título desconocido')
            thumbnail = info.get('thumbnail', '')
            
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
                'author': info.get('uploader', 'Autor desconocido'),
                'platform': get_platform(url)
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
            seen_qualities = set()
            
            # Añadir opciones de video
            for i, f in enumerate(formats):
                if f.get('vcodec') != 'none' and f.get('acodec') != 'none':  # Solo formatos con video y audio
                    resolution = f.get('height', 0)
                    if resolution in seen_qualities:
                        continue
                        
                    if resolution >= 360:  # Solo calidades decentes
                        seen_qualities.add(resolution)
                        size_mb = round(f.get('filesize', 0) / 1024 / 1024, 2) if f.get('filesize') else "Desconocido"
                        
                        available_formats.append({
                            'id': f'opt-{i}',
                            'label': f'MP4 {resolution}p',
                            'quality': f'{resolution}p',
                            'format': 'mp4',
                            'fileSize': f'{size_mb} MB' if isinstance(size_mb, (int, float)) else 'Tamaño desconocido',
                            'format_id': f.get('format_id', '')
                        })
            
            # Añadir opción de solo audio
            available_formats.append({
                'id': 'opt-audio',
                'label': 'Solo Audio MP3',
                'quality': '320kbps',
                'format': 'mp3',
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
    download_directly = data.get('downloadDirectly', False)
    
    if not url:
        return jsonify({'error': 'URL no proporcionada'}), 400
    
    # Para compatibilidad con la interfaz de usuario anterior
    if not video_id:
        video_id = str(uuid.uuid4())
    if not option_id:
        option_id = 'opt-1'  # Formato predeterminado
        if data.get('format') == 'audio':
            option_id = 'opt-audio'
    if not video_info:
        video_info = {
            'title': 'Video descargado',
            'platform': get_platform(url),
            'quality': data.get('quality', 'high')
        }
    
    try:
        # Ejecutar limpieza antes de cada descarga
        clean_old_downloads()
        
        print(f"Iniciando descarga de video: {url}, opción: {option_id}")
        
        # Crear nombre de archivo seguro sin UUID
        safe_title = secure_filename(video_info.get('title', 'video'))
        # Generar un ID interno único para tracking
        internal_id = str(uuid.uuid4())
        # Usamos solo el nombre seguro para el archivo
        output_path = os.path.join(UPLOAD_FOLDER, f"{safe_title}")
        
        # Crear carpeta si no existe
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        
        # Determinar formato basado en la opción
        is_audio_only = option_id == 'opt-audio'
        download_id = str(uuid.uuid4())
        
        if is_audio_only:
            # Configuración para solo audio
            print("Descargando audio...")
            ydl_opts = {
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '320',
                }],
                'outtmpl': f'{output_path}.%(ext)s',
                'quiet': False,  # Para ver logs en consola
            }
            final_path = f'{output_path}.mp3'
        else:
            # Configuración para video con calidad seleccionada
            print("Descargando video...")
            requested_quality = video_info.get('quality', '').lower()
            
            # Seleccionar el formato según la calidad solicitada
            if requested_quality == 'highest' or requested_quality == 'high':
                # Para 4K o mayor calidad
                format_option = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
            elif requested_quality == 'medium':
                # Para calidad media (720p-1080p)
                format_option = 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best'
            elif requested_quality == 'low':
                # Para calidad baja (480p o menos)
                format_option = 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best'
            else:
                # Por defecto, usar la mejor calidad
                format_option = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
            
            print(f"Calidad solicitada: {requested_quality}, formato: {format_option}")
            
            ydl_opts = {
                'format': format_option,
                'merge_output_format': 'mp4',
                'outtmpl': f'{output_path}.%(ext)s',
                'quiet': False,  # Para ver logs en consola
            }
            final_path = f'{output_path}.mp4'
        
        # Descargar el contenido
        print(f"Ejecutando descarga con opciones: {ydl_opts}")
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print(f"Descargando {url}...")
            ydl.download([url])
            print(f"Descarga completada: {final_path}")
        
        # Comprobar si el archivo se ha descargado correctamente
        if not os.path.exists(final_path):
            raise Exception(f"El archivo no se ha creado en la ruta esperada: {final_path}")
        
        # Registrar en el historial
        download_entry = {
            'id': download_id,
            'url': url,
            'videoInfo': video_info,
            'downloadDate': datetime.now().isoformat(),
            'option': {
                'id': option_id,
                'format': 'mp3' if is_audio_only else 'mp4',
                'quality': '320kbps' if is_audio_only else video_info.get('quality', 'HD')
            },
            'status': 'completed',
            'filePath': final_path,
            'fileDeleted': False  # Nuevo campo para rastrear si se ha eliminado
        }
        
        download_history.append(download_entry)
        save_history()
        
        # Si se solicitó descarga directa, programar eliminación automática
        if download_directly:
            delete_file_after_delay(final_path)
        
        # Devolver información de la descarga
        return jsonify({
            'success': True,
            'downloadId': download_id,
            'filePath': final_path
        })
        
    except Exception as e:
        error_msg = f"Error al descargar el video: {str(e)}"
        print(error_msg)
        failed_entry = {
            'id': str(uuid.uuid4()),
            'url': url,
            'videoInfo': video_info,
            'downloadDate': datetime.now().isoformat(),
            'option': {
                'id': option_id,
                'format': 'mp3' if option_id == 'opt-audio' else 'mp4',
                'quality': '320kbps' if option_id == 'opt-audio' else 'HD'
            },
            'status': 'failed',
            'error': str(e),
            'fileDeleted': True  # No hay archivo para descargas fallidas
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
    
    file_path = download.get('filePath')
    if not file_path or not os.path.exists(file_path) or download.get('fileDeleted', False):
        return jsonify({'error': 'Archivo no encontrado o ya ha sido eliminado'}), 404
    
    return send_file(
        file_path,
        as_attachment=True,
        download_name=os.path.basename(file_path)
    )

@app.route('/api/download-direct/<download_id>', methods=['GET'])
def download_direct(download_id):
    """Ruta para descargar directamente un archivo y luego eliminarlo"""
    # Buscar la descarga en el historial
    download = next((d for d in download_history if d['id'] == download_id), None)
    
    if not download:
        return jsonify({'error': 'Descarga no encontrada'}), 404
    
    file_path = download.get('filePath')
    if not file_path or not os.path.exists(file_path) or download.get('fileDeleted', False):
        return jsonify({'error': 'Archivo no encontrado o ya ha sido eliminado'}), 404
    
    try:
        # Obtener el nombre real del archivo
        filename = os.path.basename(file_path)
        
        # Programar la eliminación del archivo después de descargarlo
        @after_this_request
        def schedule_deletion(response):
            try:
                # Programar eliminación después de enviar la respuesta
                delete_file_after_delay(file_path)
            except Exception as e:
                print(f"Error al programar eliminación: {e}")
            return response
        
        # Corrección para evitar problemas con dispositivos móviles
        response = send_file(
            file_path,
            as_attachment=True,
            download_name=filename,
            mimetype='application/octet-stream'  # Forzar descarga en lugar de reproducción
        )
        
        # Agregar headers para forzar descarga
        response.headers["Content-Disposition"] = f"attachment; filename={filename}"
        response.headers["Content-Type"] = "application/octet-stream"
        
        return response
    except Exception as e:
        print(f"Error al descargar: {str(e)}")
        return jsonify({'error': f'Error al descargar: {str(e)}'}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(download_history)

@app.route('/api/history/<download_id>', methods=['DELETE', 'OPTIONS'])
def delete_history_item(download_id):
    # Permitimos opciones OPTIONS para CORS preflight
    if request.method == 'OPTIONS':
        return '', 200
        
    # Buscar y eliminar el item del historial
    global download_history
    initial_length = len(download_history)
    
    # Encontrar el elemento
    item_to_delete = next((item for item in download_history if item['id'] == download_id), None)
    
    # Si existe, intentar eliminar el archivo asociado
    if item_to_delete:
        try:
            file_path = item_to_delete.get('filePath')
            if file_path and os.path.exists(file_path) and not item_to_delete.get('fileDeleted', False):
                os.remove(file_path)
                print(f"Archivo eliminado: {file_path}")
        except Exception as e:
            print(f"Error al eliminar archivo: {e}")
    
    # Filtrar el historial
    download_history = [item for item in download_history if item['id'] != download_id]
    
    if len(download_history) < initial_length:
        save_history()
        return jsonify({'success': True, 'message': 'Elemento eliminado correctamente'})
    else:
        return jsonify({'error': 'Elemento no encontrado'}), 404

@app.route('/api/download-by-id/<download_id>', methods=['GET'])
def download_by_id(download_id):
    # Buscar la descarga en el historial
    download = next((d for d in download_history if d['id'] == download_id), None)
    
    if not download:
        return jsonify({'error': 'Descarga no encontrada'}), 404
    
    file_path = download.get('filePath')
    if not file_path or not os.path.exists(file_path) or download.get('fileDeleted', False):
        return jsonify({'error': 'Archivo no encontrado o ya ha sido eliminado'}), 404
    
    try:
        # Obtener el nombre real del archivo
        filename = os.path.basename(file_path)
        
        # No eliminar el archivo después de descargar (esta ruta es para historial)
        
        # Corrección para evitar problemas con dispositivos móviles
        response = send_file(
            file_path,
            as_attachment=True,
            download_name=filename,
            mimetype='application/octet-stream'  # Forzar descarga en lugar de reproducción
        )
        
        # Agregar headers para forzar descarga
        response.headers["Content-Disposition"] = f"attachment; filename={filename}"
        response.headers["Content-Type"] = "application/octet-stream"
        
        return response
    except Exception as e:
        print(f"Error al descargar: {str(e)}")
        return jsonify({'error': f'Error al descargar: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0') 