# Aplicativo de Descarga de Videos Institucionales

## Descripción Técnica

Este aplicativo está diseñado para facilitar la descarga segura y eficiente de contenido audiovisual desde diversas plataformas web (como YouTube, TikTok, Instagram, etc.). Su propósito principal es permitir a los usuarios autorizados dentro de la institución obtener copias locales de videos relevantes para fines institucionales, con un enfoque particular en **material relacionado con procesos médicos, educativos y de investigación**.

### Funcionalidades Clave:

*   **Descarga desde Múltiples Fuentes:** Soporte para una amplia gama de plataformas de video populares.
*   **Selección de Formato y Calidad:** Permite al usuario elegir el formato de salida (MP4 para video, MP3 para audio) y la calidad deseada (alta, media, baja) para optimizar el tamaño del archivo y la compatibilidad.
*   **Obtención de Metadatos:** Extrae información relevante del video como título, miniatura y plataforma de origen antes de iniciar la descarga.
*   **Interfaz Intuitiva:** Un diseño claro y fácil de usar basado en Material UI para una experiencia de usuario fluida.
*   **Notificaciones en Tiempo Real:** Informa al usuario sobre el estado del proceso de descarga (inicio, éxito, error) mediante notificaciones.
*   **Manejo de Errores:** Implementa mecanismos para gestionar errores comunes durante la obtención de información o la descarga, proporcionando mensajes claros al usuario.

### Arquitectura (Visión General):

*   **Frontend:** Desarrollado con React y Next.js, utilizando TypeScript para un tipado estático y Material UI (MUI) para los componentes de la interfaz de usuario. Emplea hooks personalizados (`useVideoInfo`, `useSnackbar`) para gestionar el estado y las notificaciones.
*   **Backend:** (Se asume una API REST) Responsable de procesar las solicitudes de descarga, interactuar con las APIs de las plataformas de video (o usar librerías como `yt-dlp`), gestionar la conversión de formatos si es necesario y servir los archivos descargados. La comunicación entre frontend y backend se realiza mediante peticiones HTTP (Axios).
*   **Configuración:** Utiliza un archivo de configuración (`apiConfig.js` o similar) para gestionar la URL base de la API.

### Flujo de Descarga:

1.  El usuario ingresa la URL del video en el campo correspondiente.
2.  El frontend realiza una solicitud al backend (o utiliza un hook) para obtener la información del video (metadatos, formatos disponibles).
3.  La información (título, miniatura) se muestra al usuario.
4.  El usuario selecciona el formato (MP4/MP3) y la calidad (si aplica).
5.  Al pulsar "Descargar", el frontend envía una solicitud al endpoint `/api/download` del backend, incluyendo la URL, la información del video y las opciones seleccionadas (`optionId`).
6.  El backend procesa la solicitud, inicia la descarga desde la fuente original utilizando la `optionId` adecuada.
7.  Una vez descargado y procesado (si es necesario), el backend genera un ID de descarga y una URL temporal (`/api/download-direct/{downloadId}`).
8.  El frontend recibe la URL de descarga directa y simula un clic en un enlace (`<a>`) para iniciar la descarga en el navegador del usuario.
9.  Se muestran notificaciones para informar al usuario sobre el progreso y el resultado.

## Uso Institucional Exclusivo

**Importante:** Este aplicativo ha sido desarrollado y está destinado **exclusivamente para uso interno e institucional**. Su función principal es la recuperación de material audiovisual relacionado con **procesos médicos, formación interna, documentación de casos y otros fines estrictamente profesionales y autorizados** dentro de la organización.

**Queda prohibido el uso de esta herramienta para descargar material protegido por derechos de autor con fines ajenos a los institucionales o para su redistribución no autorizada.** Se espera que todos los usuarios cumplan con las políticas internas y las leyes de propiedad intelectual vigentes. 