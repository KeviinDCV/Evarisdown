/**
 * Configuración de la API
 * Esto permite que la aplicación funcione tanto en desarrollo local como cuando se accede desde otros dispositivos
 */

// Dirección IP de la máquina que ejecuta el servidor
export const SERVER_IP = '192.168.2.202';

// Puerto del servidor backend
export const SERVER_PORT = 5000;

// Determina si usamos localhost o la IP dependiendo de cómo se accede
const useLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// URL base de la API
export const API_BASE_URL = useLocalhost 
  ? `http://localhost:${SERVER_PORT}`
  : `http://${SERVER_IP}:${SERVER_PORT}`;

export default API_BASE_URL; 