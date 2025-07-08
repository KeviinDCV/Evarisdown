import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Comprueba si el sistema prefiere el modo oscuro
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Añade o elimina la clase 'dark' de la etiqueta HTML según la preferencia del sistema
// Esto ayuda a que no haya un parpadeo antes de que React cargue
if (prefersDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 