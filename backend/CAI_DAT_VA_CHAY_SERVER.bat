@echo off
echo ========================================================
echo DANG TIEN HANH CAI DAT THU VIEN (NPM INSTALL)
echo ========================================================
echo Vui long kiem nhan cho doi (co the mat tu 1-3 phut tuy toc do mang)...
echo KHONG DUOC BAM CTRL+C HAY TAT CUA SO NAY.
echo.

cd /d "%~dp0"
call npm install --no-package-lock --no-audit --no-fund --legacy-peer-deps

echo.
echo ========================================================
echo CAI DAT HOAN TAT! DANG KHOI DONG SERVER...
echo ========================================================
echo.
call npm start
pause
