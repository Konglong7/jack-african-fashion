@echo off
chcp 65001 >nul
REM 双击运行：全自动上传 + 服务器构建 + 零停机重启
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0auto-update.ps1"
echo.
pause