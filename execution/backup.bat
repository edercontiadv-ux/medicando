@echo off
setlocal enabledelayedexpansion

REM Backup do projeto Medicando
REM Padrao: Backup em DD-MM-AAAA; HH-MM-SS

set PROJECT_DIR=C:\Users\USUARIO\Desktop\Medicando
set BACKUP_DIR=%PROJECT_DIR%\Backup

REM Criar timestamp
for /f "tokens=1-6 delims=/: " %%a in ("%DATE% %TIME%") do (
    set DD=%%a
    set MM=%%b
    set YYYY=%%c
    set HH=%%d
    set MI=%%e
    set SS=%%f
)

REM Formatar data
set BACKUP_NAME=Backup em %DD%-%MM%-%YYYY%; %HH%-%MI%-%SS%

REM Criar diretorio do backup
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
mkdir "%BACKUP_DIR%\%BACKUP_NAME%"

REM Copiar arquivos do projeto (excluindo node_modules, .next, .git, .tmp, Backup)
echo Copiando arquivos para %BACKUP_DIR%\%BACKUP_NAME%...
xcopy /E /I /Q /Y "%PROJECT_DIR%\*" "%BACKUP_DIR%\%BACKUP_NAME%\" > nul

REM Remover pastas indesejadas do backup
if exist "%BACKUP_DIR%\%BACKUP_NAME%\node_modules" rmdir /S /Q "%BACKUP_DIR%\%BACKUP_NAME%\node_modules"
if exist "%BACKUP_DIR%\%BACKUP_NAME%\.next" rmdir /S /Q "%BACKUP_DIR%\%BACKUP_NAME%\.next"
if exist "%BACKUP_DIR%\%BACKUP_NAME%\.git" rmdir /S /Q "%BACKUP_DIR%\%BACKUP_NAME%\.git"
if exist "%BACKUP_DIR%\%BACKUP_NAME%\Backup" rmdir /S /Q "%BACKUP_DIR%\%BACKUP_NAME%\Backup"
if exist "%BACKUP_DIR%\%BACKUP_NAME%\.tmp" rmdir /S /Q "%BACKUP_DIR%\%BACKUP_NAME%\.tmp"

echo Backup concluido: %BACKUP_DIR%\%BACKUP_NAME%
