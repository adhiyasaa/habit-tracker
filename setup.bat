@echo off
REM ====================================
REM HABIT TRACKER - Quick Setup Script
REM ====================================

echo.
echo ========================================
echo  HABIT TRACKER - LOCAL SETUP
echo ========================================
echo.

REM Check Node.js
echo [1/4] Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Install from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo Node.js: %%i
echo.

REM Check npm
echo [2/4] Checking npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do echo npm: %%i
echo.

REM Install dependencies
echo [3/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

REM Start dev server
echo [4/4] Starting development server...
echo.
echo ========================================
echo  Dev server akan dibuka di:
echo  http://localhost:3000
echo.
echo  Untuk stop: Ctrl + C
echo ========================================
echo.
echo CATATAN:
echo 1. Pastikan SQL sudah di-run di Supabase
echo 2. Check .env.local sudah benar
echo 3. Jika error, buka http://localhost:3000 di browser
echo.

call npm run dev

pause
