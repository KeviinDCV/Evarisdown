#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando EvariDown en modo desarrollo...\n');

// Verificar si existe el directorio backend
if (!fs.existsSync('./backend')) {
  console.error('❌ Error: No se encontró el directorio backend');
  process.exit(1);
}

// Verificar si existe requirements.txt
if (!fs.existsSync('./backend/requirements.txt')) {
  console.error('❌ Error: No se encontró backend/requirements.txt');
  process.exit(1);
}

// Verificar si existe app.py
if (!fs.existsSync('./backend/app.py')) {
  console.error('❌ Error: No se encontró backend/app.py');
  process.exit(1);
}

console.log('✅ Verificaciones completadas');
console.log('📦 Iniciando servidores...\n');

// Ejecutar concurrently
const concurrently = spawn('npx', [
  'concurrently',
  '--names', '🐍 BACKEND,⚛️  FRONTEND',
  '--prefix-colors', 'bgBlue.bold,bgGreen.bold',
  '--timestamp-format', 'HH:mm:ss',
  '--kill-others-on-fail',
  'cd backend && python app.py',
  'react-scripts start'
], {
  stdio: 'inherit',
  shell: true
});

concurrently.on('close', (code) => {
  console.log(`\n🏁 Proceso terminado con código ${code}`);
});

concurrently.on('error', (err) => {
  console.error('❌ Error al ejecutar concurrently:', err);
});

// Manejar Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo servidores...');
  concurrently.kill('SIGINT');
});
