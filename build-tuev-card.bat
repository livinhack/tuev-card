@echo off
setlocal

echo.
echo ========================================
echo  TUEV Card - HACS Bundle Build
echo ========================================
echo.

cd /d "%~dp0"

echo Projektordner:
echo %CD%
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo FEHLER: Node.js wurde nicht gefunden.
    echo.
    echo Bitte Node.js LTS installieren:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
    echo FEHLER: npm.cmd wurde nicht gefunden.
    echo Node.js scheint nicht vollstaendig installiert zu sein.
    echo.
    pause
    exit /b 1
)

if not exist "package.json" (
    echo FEHLER: package.json wurde nicht gefunden.
    echo.
    echo Diese Datei muss im Root-Ordner des tuev-card-Projekts liegen.
    echo Lege diese BAT-Datei bitte neben package.json, src und scripts.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo node_modules fehlt. Fuehre npm install aus...
    echo.
    call npm.cmd install
    if errorlevel 1 (
        echo.
        echo FEHLER: npm install ist fehlgeschlagen.
        echo.
        pause
        exit /b 1
    )
) else (
    echo node_modules gefunden. npm install wird uebersprungen.
    echo Falls Abhaengigkeiten fehlen, loesche node_modules oder fuehre npm.cmd install manuell aus.
    echo.
)

echo Baue HACS-Bundle...
echo.
call npm.cmd run build
if errorlevel 1 (
    echo.
    echo FEHLER: npm run build ist fehlgeschlagen.
    echo.
    pause
    exit /b 1
)

echo.
echo Fuehre JavaScript- und Release-Asset-Check aus...
echo.
call npm.cmd run check
if errorlevel 1 (
    echo.
    echo FEHLER: npm run check ist fehlgeschlagen.
echo Pruefe insbesondere, ob lokale Fontdateien nach dist\fonts kopiert wurden.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Build und Check erfolgreich abgeschlossen.
echo ========================================
echo.

if exist "dist\tuev-card.js" (
    echo Aktualisiert: dist\tuev-card.js
) else (
    echo HINWEIS: Keine erwartete Bundle-Datei unter dist gefunden.
    echo Bitte pruefe package.json und scripts\build-bundle.mjs.
)

echo.

if exist "dist\fonts\GL-Nummernschild-Mtl.ttf" (
    echo Vorhanden: dist\fonts\GL-Nummernschild-Mtl.ttf
) else (
    echo HINWEIS: dist\fonts\GL-Nummernschild-Mtl.ttf fehlt.
    echo Fuer HACS/GitHub-Tests muss die lokale Fontdatei vor dem Build in fonts\ liegen.
)

if exist "dist\fonts\GL-Nummernschild-Eng.ttf" (
    echo Vorhanden: dist\fonts\GL-Nummernschild-Eng.ttf
) else (
    echo HINWEIS: dist\fonts\GL-Nummernschild-Eng.ttf fehlt.
    echo Fuer HACS/GitHub-Tests muss die lokale Fontdatei vor dem Build in fonts\ liegen.
)
echo.
echo Naechster Schritt:
echo In GitHub Desktop die geaenderten Dateien committen und pushen.
echo.
pause
