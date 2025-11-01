# 🚀 INSTRUKCJA URUCHOMIENIA - Krok po kroku

## ✅ KROK 1: Pobierz i rozpakuj projekt

```bash
# Wypakuj archiwum
tar -xzf window-measurement-app-FINAL.tar.gz
cd window-measurement-app
```

---

## ✅ KROK 2: Zainstaluj zależności

```bash
npm install
```

⏳ To zajmie 2-5 minut. Poczekaj aż wszystko się zainstaluje.

---

## ✅ KROK 3: Uruchom aplikację

```bash
npx expo start
```

Zobaczysz QR code i menu w terminalu.

---

## 📱 OPCJA A: Testuj na prawdziwym telefonie (ZALECANE)

### Android:
1. Zainstaluj **Expo Go** z Google Play Store
2. Otwórz Expo Go
3. Zeskanuj QR code z terminala
4. Aplikacja się uruchomi! 🎉

### iOS:
1. Zainstaluj **Expo Go** z App Store
2. Otwórz Expo Go
3. Zeskanuj QR code z terminala (lub wpisz URL)
4. Aplikacja się uruchomi! 🎉

**UWAGA dla iOS:** Aparat może nie działać w Expo Go. Użyj Expo Dev Client lub buduj natywnie.

---

## 💻 OPCJA B: Testuj na emulatorze

### Android Emulator:
```bash
# Po uruchomieniu npx expo start, naciśnij:
a
```

**Wymagania:**
- Android Studio zainstalowane
- Emulator Android skonfigurowany

### iOS Simulator (tylko macOS):
```bash
# Po uruchomieniu npx expo start, naciśnij:
i
```

**Wymagania:**
- Xcode zainstalowany
- Simulator skonfigurowany

---

## 🌐 OPCJA C: Testuj w przeglądarce (OGRANICZONE)

```bash
# Po uruchomieniu npx expo start, naciśnij:
w
```

**⚠️ UWAGA:** W przeglądarce NIE DZIAŁAJĄ:
- Aparat
- Baza danych SQLite
- Część funkcji mobilnych

---

## 🔧 Rozwiązywanie problemów

### Problem: "expo: command not found"
```bash
npm install -g expo-cli
```

### Problem: Port zajęty
```bash
npx expo start --port 8082
```

### Problem: Expo Go nie łączy się
- Upewnij się że telefon i komputer są w tej samej sieci WiFi
- Wyłącz VPN
- Sprawdź firewall

### Problem: "Cannot find module"
```bash
# Wyczyść cache i reinstaluj
rm -rf node_modules
npm install
npx expo start --clear
```

---

## 📋 Komendy pomocnicze

```bash
# Uruchom z czyszczeniem cache
npx expo start --clear

# Uruchom na Androidzie
npx expo start --android

# Uruchom na iOS
npx expo start --ios

# Uruchom w przeglądarce
npx expo start --web

# Zobacz logi
npx expo start --dev-client
```

---

## 🎯 Co dalej?

### Testuj aplikację:
1. **Dodaj pomiar** - kliknij niebieski przycisk + na dole
2. **Wypełnij formularz** - nazwa, wymiary, klamka, typ
3. **Zrób zdjęcia** - do 8 zdjęć z aparatu
4. **Zapisz** - pomiar pojawi się na liście
5. **Kliknij pomiar** - zobacz szczegóły
6. **Eksportuj PDF** - wygeneruj profesjonalny PDF

### Build produkcyjny:
```bash
# Android APK
npx eas build --platform android

# iOS
npx eas build --platform ios
```

Potrzebujesz konta Expo: https://expo.dev

---

## 📞 Potrzebujesz pomocy?

- Dokumentacja Expo: https://docs.expo.dev
- React Native: https://reactnative.dev
- Forum: https://forums.expo.dev

---

## ✅ Sprawdź czy działa:

Po uruchomieniu powinieneś zobaczyć:
- ✅ Ekran główny z napisem "📏 Moje Pomiary"
- ✅ Niebieski przycisk + na dole
- ✅ Komunikat "Brak pomiarów" (pierwszym razem)

Jeśli widzisz to wszystko - **DZIAŁA!** 🎉
