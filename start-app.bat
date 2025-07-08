@echo off
echo Iniciando VideoDownloader Pro...
echo.
echo === INICIANDO BACKEND (PYTHON/FLASK) ===
start cmd /k "powershell -Command \"$host.UI.RawUI.WindowTitle = 'Backend - VideoDownloader Pro'; Set-ItemProperty -Path 'HKCU:\Console' -Name QuickEdit -Value 0\" & cd C:\Users\Kechavarro\Desktop\Proyectos\Test\backend & python app.py"
echo.
echo === INICIANDO FRONTEND (REACT) ===
start cmd /k "cd C:\Users\Kechavarro\Desktop\Proyectos\Test & npm start"
echo.
echo Si todo funciona correctamente, se abrirá automáticamente el navegador en http://localhost:3000
echo El backend estará disponible en http://localhost:5000
echo.
echo Presiona cualquier tecla para cerrar esta ventana.
pause > nul 