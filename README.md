# 🎬 Evarisdown - YouTube Downloader

Una aplicación web moderna y elegante para descargar videos de YouTube con una interfaz intuitiva construida con React y Shadcn/UI.

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.6.3-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue?logo=tailwindcss)
![Python](https://img.shields.io/badge/Python-3.8+-green?logo=python)
![Flask](https://img.shields.io/badge/Flask-Backend-green?logo=flask)

## ✨ Características

- 🎥 **Descarga de videos de YouTube** en diferentes calidades (720p, 1080p, etc.)
- 🎨 **Interfaz moderna** con React 18 y Shadcn/UI
- 🌙 **Tema claro/oscuro** con transiciones suaves
- 👀 **Previsualización de videos** antes de descargar
- 📊 **Historial de descargas** con persistencia local
- ⚡ **Backend rápido** en Python con Flask y yt-dlp
- 📱 **Diseño responsivo** para todos los dispositivos
- 🎭 **Animaciones fluidas** con Framer Motion

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 3.4.17** - Framework de CSS
- **Shadcn/UI** - Componentes de UI modernos
- **Framer Motion** - Animaciones
- **React Router** - Navegación
- **Lucide React** - Iconos
- **Axios** - Cliente HTTP

### Backend
- **Python 3.8+** - Lenguaje de programación
- **Flask** - Framework web
- **yt-dlp** - Descargador de videos
- **CORS** - Manejo de CORS

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- Python (v3.8 o superior)
- npm, yarn o pnpm

### 1. Clonar el repositorio
```bash
git clone https://github.com/KeviinDCV/Evarisdown.git
cd Evarisdown
```

### 2. Configurar el Frontend
```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

### 3. Configurar el Backend
```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias de Python
pip install -r requirements.txt

# Iniciar el servidor Flask
python app.py
```

### 4. Acceder a la aplicación
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📁 Estructura del Proyecto

```
Evarisdown/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 ui/           # Componentes Shadcn/UI
│   │   ├── 📁 layout/       # Layout y navegación
│   │   ├── 📁 downloader/   # Lógica de descarga
│   │   └── 📁 animations/   # Componentes animados
│   ├── 📁 pages/            # Páginas principales
│   ├── 📁 hooks/            # Custom React hooks
│   ├── 📁 lib/              # Utilidades y helpers
│   ├── 📁 context/          # Context providers
│   └── 📁 config/           # Configuraciones
├── 📁 backend/              # Servidor Python Flask
├── 📁 public/               # Archivos estáticos
└── 📁 downloads/            # Videos descargados
```

## 🎯 Uso

1. **Iniciar ambos servidores** (frontend y backend)
2. **Abrir** `http://localhost:3000` en tu navegador
3. **Pegar la URL** del video de YouTube
4. **Seleccionar la calidad** deseada
5. **Hacer clic en "Descargar"**
6. **Esperar** a que se complete la descarga

## 🎨 Componentes UI

El proyecto utiliza **Shadcn/UI** con los siguientes componentes:
- `Button` - Botones con variantes
- `Card` - Tarjetas de contenido
- `Dialog` - Modales y diálogos
- `Input` - Campos de entrada
- `Dropdown Menu` - Menús desplegables
- `Separator` - Separadores visuales

## 🌙 Temas

La aplicación soporta temas claro y oscuro con:
- Variables CSS personalizadas
- Transiciones suaves entre temas
- Persistencia de preferencias
- Detección automática del tema del sistema

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el proyecto
2. **Crear** una rama para tu feature
   ```bash
   git checkout -b feature/nueva-caracteristica
   ```
3. **Commit** tus cambios
   ```bash
   git commit -m 'Agregar nueva característica'
   ```
4. **Push** a la rama
   ```bash
   git push origin feature/nueva-caracteristica
   ```
5. **Abrir** un Pull Request

## 📝 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Kevin Echavarro** - [@KeviinDCV](https://github.com/KeviinDCV)

---

⭐ ¡No olvides dar una estrella al proyecto si te gustó!