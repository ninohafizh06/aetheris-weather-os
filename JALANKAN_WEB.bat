@echo off
title AETHERIS Weather OS - Launcher
color 0b

echo ============================================================
echo   🌤️ AETHERIS Weather OS — Dashboard Monitoring Cuaca
echo ============================================================
echo.
echo [1/2] Menyiapkan server lokal...
echo [2/2] Membuka browser otomatis ke http://localhost:3000...
echo.
echo * Catatan: Jangan tutup jendela hitam ini selama Anda menggunakan web.
echo   Untuk mematikan server, cukup tutup jendela ini atau tekan Ctrl+C.
echo ============================================================
echo.

:: Pindah ke folder tempat file bat ini berada
cd /d "%~dp0"

:: Tunggu 3 detik lalu buka browser secara otomatis
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: Jalankan server Next.js
call npm run dev

pause
