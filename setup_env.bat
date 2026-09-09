@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul

:: Cambiar al directorio del script
cd /d "%~dp0"

echo ===================================================
echo       CONFIGURACION DEL ENTORNO VIRTUAL
echo ===================================================

:: 1. Verificar si Python esta en el PATH
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] No se encontro Python en el sistema o PATH.
    echo Por favor instala Python o agregalo a las Variables de Entorno.
    goto :fin_error
)

:: 2. Verificar existencia de requerimientos.txt
if not exist "requerimientos.txt" (
    echo [ERROR] No se encontro el archivo 'requerimientos.txt' en %cd%.
    goto :fin_error
)

:: 3. Crear entorno virtual si no existe
if not exist ".venv\Scripts\activate.bat" (
    echo [1/3] Creando entorno virtual en .venv...
    python -m venv .venv
    if !errorlevel! neq 0 (
        echo [ERROR] Fallo la creacion del entorno virtual.
        goto :fin_error
    )
    echo [OK] Entorno virtual creado exitosamente.
) else (
    echo [1/3] Entorno virtual existente detectado.
)

:: 4. Activar entorno virtual
echo [2/3] Activando entorno virtual...
call ".venv\Scripts\activate.bat"
if !errorlevel! neq 0 (
    echo [ERROR] No se pudo activar el entorno virtual.
    goto :fin_error
)

:: 5. Instalar dependencias
echo [3/3] Instalando dependencias de requerimientos.txt...
python -m pip install --upgrade pip
pip install -r requerimientos.txt
if !errorlevel! neq 0 (
    echo [ERROR] Error durante la instalacion de paquetes.
    goto :fin_error
)

echo ===================================================
echo   [EXITO] Entorno configurado y activado.
echo ===================================================
echo.
cmd /k
goto :eof

:fin_error
echo.
echo ===================================================
echo   [FALLO] La configuracion no pudo completarse.
echo ===================================================
pause
exit /b 1
