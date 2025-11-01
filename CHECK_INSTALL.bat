@echo off
echo ============================================
echo   DIAGNOSTYKA INSTALACJI
echo ============================================
echo.

echo [Sprawdzanie Node.js]
node --version
echo.

echo [Sprawdzanie npm]
npm --version
echo.

echo [Sprawdzanie Expo]
npx expo --version
echo.

echo [Sprawdzanie plikow projektu]
if exist package.json (
    echo ✓ package.json istnieje
) else (
    echo ✗ BRAK package.json
)

if exist app.json (
    echo ✓ app.json istnieje
) else (
    echo ✗ BRAK app.json
)

if exist app (
    echo ✓ folder app/ istnieje
) else (
    echo ✗ BRAK folderu app/
)

if exist node_modules (
    echo ✓ node_modules zainstalowane
) else (
    echo ✗ BRAK node_modules - uruchom: npm install
)

echo.
echo [Zawartosc app.json]
echo ----------------------------------------
type app.json
echo ----------------------------------------

echo.
echo ============================================
echo   DIAGNOSTYKA ZAKONCZONA
echo ============================================
echo.
pause
