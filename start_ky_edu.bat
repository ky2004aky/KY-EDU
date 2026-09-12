@echo off
title KY EDU - Launching Portal
echo =========================================================
echo               STARTING KY EDU PORTAL
echo =========================================================
echo 1. Checking MongoDB service...
sc query MongoDB | find "RUNNING" >nul
if %ERRORLEVEL% equ 0 (
    echo [OK] MongoDB service is running.
) else (
    echo [INFO] Starting MongoDB service (requires admin if stopped)...
    net start MongoDB >nul 2>&1
)

echo 2. Launching PHP 8.2 Backend on port 8000...
start "KY EDU Backend (PHP:8000)" cmd /k "php -S 0.0.0.0:8000 -t backend"

timeout /t 2 /nobreak >nul

echo 3. Launching React 18 Frontend on port 5173...
start "KY EDU Frontend (Vite:5173)" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo =========================================================
echo  [SUCCESS] KY EDU Portal is launching!
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://localhost:8000
echo  - Admin PIN: 123456
echo =========================================================
pause
