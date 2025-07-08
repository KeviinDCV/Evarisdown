import yt_dlp

def test_yt_dlp():
    print("Probando yt-dlp...")
    url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # Un video que sabemos que existe
    
    try:
        # Configuración más simple para probar el funcionamiento básico
        ydl_opts = {
            'quiet': False,  # Mostrar logs para ver qué sucede
            'skip_download': True,
            'listformats': True  # Esto mostrará los formatos disponibles
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            print("yt-dlp está funcionando correctamente!")
            
    except Exception as e:
        print(f"Error al probar yt-dlp: {e}")

if __name__ == "__main__":
    test_yt_dlp() 