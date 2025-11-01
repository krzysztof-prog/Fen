@echo off
echo ============================================
echo   CZYSZCZENIE CACHE - WINDOWS
echo ============================================
echo.

echo [1/3] Czyszczenie cache Expo...
if exist .expo rmdir /s /q .expo
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✓ Cache wyczyszczony

echo.
echo [2/3] Czy chcesz usunac node_modules i reinstalowac? (Y/N)
set /p choice=
if /i "%choice%"=="Y" (
    echo Usuwanie node_modules...
    if exist node_modules rmdir /s /q node_modules
    echo Instalowanie zaleznosci...
    call npm install
)

echo.
echo [3/3] Uruchamianie Expo...
echo.
echo ============================================
echo   Expo uruchomi sie za chwile
echo   Zeskanuj QR code w Expo Go
echo ============================================
echo.

call npx expo start --clear

pause
