@echo off
echo Starting Backend...
start "Backend" cmd /k "node local-backend.mjs"
timeout /t 2 >nul
echo Starting Frontend...
start "Frontend" cmd /k "npm run dev"
echo ===================================================
echo   Vibe Coding App is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8787
echo ===================================================
pause
