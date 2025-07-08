module.exports = {
  // Configuración para concurrently
  killOthers: ['failure', 'success'],
  restartTries: 3,
  prefix: 'name',
  timestampFormat: 'HH:mm:ss',
  prefixColors: ['bgBlue.bold', 'bgGreen.bold'],
  names: ['BACKEND', 'FRONTEND']
};
