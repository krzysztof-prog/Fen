@echo off
echo ============================================
echo   PELNY RESET PROJEKTU - WINDOWS
echo ============================================
echo.
echo UWAGA: To usunie wszystkie zainstalowane zaleznosci
echo i zainstaluje je od nowa.
echo.
pause

echo.
echo [1/5] Usuwanie cache Expo...
if exist .expo (
    rmdir /s /q .expo
    echo ✓ Usunieto .expo
) else (
    echo - Folder .expo nie istnieje
)

echo.
echo [2/5] Usuwanie node_modules...
if exist node_modules (
    echo To moze zajac chwile...
    rmdir /s /q node_modules
    echo ✓ Usunieto node_modules
) else (
    echo - Folder node_modules nie istnieje
)

echo.
echo [3/5] Usuwanie package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo ✓ Usunieto package-lock.json
) else (
    echo - Plik package-lock.json nie istnieje
)

echo.
echo [4/5] Czyszczenie cache npm...
call npm cache clean --force
echo ✓ Cache npm wyczyszczony

echo.
echo [5/5] Instalowanie zaleznosci (2-5 minut)...
call npm install

echo.
echo ============================================
echo   INSTALACJA ZAKONCZONA
echo ============================================
echo.
echo Teraz uruchom:
echo   npx expo start --clear
echo.
pause
