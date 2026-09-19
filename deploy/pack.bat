@echo off
chcp 65001 >nul
REM 双击运行：打包项目并打印上传步骤
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0pack.ps1"
pause