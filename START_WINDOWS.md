# 🪟 INSTRUKCJA DLA WINDOWS

## ✅ SZYBKIE ROZWIĄZANIE (3 kroki):

### KROK 1: Usuń foldery ręcznie

Otwórz folder `window-measurement-app` w Eksploratorze i:

1. **Usuń folder `.expo`** (jeśli istnieje)
   - Może być ukryty - włącz pokazywanie ukrytych plików
   - Widok → Pokaż → Ukryte elementy ✓

2. **Usuń folder `node_modules`** (jeśli problem się powtarza)
   - To duży folder, kasowanie zajmie chwilę

### KROK 2: Otwórz CMD lub PowerShell

```cmd
cd ścieżka\do\window-measurement-app
```

### KROK 3: Zainstaluj i uruchom

```cmd
npm install
npx expo start --clear
```

**WAŻNE:** Koniecznie użyj `--clear`!

---

## 🚀 ALTERNATYWA: Użyj gotowego skryptu

W folderze projektu znajdziesz plik `START_WINDOWS.bat`

**Jak użyć:**

1. Otwórz folder projektu w Eksploratorze
2. Kliknij dwukrotnie na `START_WINDOWS.bat`
3. Postępuj zgodnie z instrukcjami na ekranie

**Co robi skrypt:**
- ✅ Czyści cache automatycznie
- ✅ Pyta czy reinstalować node_modules
- ✅ Uruchamia Expo z --clear

---

## 📱 Na telefonie (WAŻNE!):

Po uruchomieniu na komputerze:

1. **Zamknij Expo Go całkowicie**
   - Usuń aplikację z tła (recent apps)
   - Nie wystarczy minimize!

2. **Otwórz Expo Go ponownie**

3. **Zeskanuj QR code**
   - NIE klikaj w historię!
   - Zawsze skanuj na nowo!

---

## 🔍 Komendy Windows - Ściągawka

### CMD (Wiersz polecenia):
```cmd
# Usuń folder
rmdir /s /q nazwa_folderu

# Wyczyść cache
rmdir /s /q .expo
rmdir /s /q node_modules

# Zainstaluj
npm install

# Uruchom
npx expo start --clear
```

### PowerShell:
```powershell
# Usuń folder
Remove-Item -Recurse -Force nazwa_folderu

# Wyczyść cache
Remove-Item -Recurse -Force .expo
Remove-Item -Recurse -Force node_modules

# Zainstaluj
npm install

# Uruchom
npx expo start --clear
```

---

## 💡 DLACZEGO `--clear` jest ważne?

Expo cache (`.expo` folder) pamięta stary `app.json` z `assets/splash.png`.

**Bez `--clear`:** Cache używa starych danych → błąd  
**Z `--clear`:** Cache jest budowany od nowa → działa ✅

---

## ⚠️ Jeśli DALEJ nie działa:

### Atomowy reset (usuwa WSZYSTKO):

**W Eksploratorze Windows:**
1. Usuń folder `.expo`
2. Usuń folder `node_modules`
3. Usuń plik `package-lock.json`

**W CMD:**
```cmd
npm cache clean --force
npm install
npx expo start --clear
```

---

## 📦 Sprawdź wersje:

```cmd
node --version
npm --version
npx expo --version
```

**Wymagane:**
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

Jeśli masz starsze, zaktualizuj: https://nodejs.org/

---

## ✅ Test czy działa:

Po uruchomieniu na telefonie MUSISZ zobaczyć:

```
┌─────────────────────┐
│ 📏 Moje Pomiary     │  ← To jest NAGŁÓWEK!
│ ─────────────────── │
│                     │
│   📏                │
│ Brak pomiarów       │
│                     │
│ [+ Dodaj pomiar]    │
│                     │
│            (+)      │  ← NIEBIESKI przycisk
└─────────────────────┘
```

**Widzisz nagłówek "📏 Moje Pomiary"?** → **DZIAŁA!** 🎉

**Nadal "Open up App.tsx"?** → Cache nie został wyczyszczony. Spróbuj ponownie z `--clear`.

---

## 🎯 Szybki test funkcjonalności:

1. Kliknij **niebieski przycisk (+)** na dole
2. Wypełnij formularz:
   - Nazwa: Test
   - Wysokość: 1500
   - Szerokość: 1000
3. Kliknij **"💾 Zapisz pomiar"**
4. Pomiar pojawi się na liście!

**Działa?** → Wszystkie funkcje będą działać! ✅

---

## 📞 Pomoc:

**Problem z cache?** → Usuń `.expo` i `node_modules` ręcznie  
**Problem z npm?** → `npm cache clean --force`  
**Problem z Expo Go?** → Reinstaluj aplikację  
**Telefon nie łączy?** → Sprawdź WiFi (musi być ta sama sieć!)

---

Powodzenia! 🚀
