# 🚀 JAK NAPRAWIĆ I URUCHOMIĆ

## ❌ Problem: "Unable to resolve asset" + "Open up App.tsx"

To problem z **cache Expo**. Oto PEWNE rozwiązanie:

---

## ✅ ROZWIĄZANIE (wykonaj po kolei):

### 1️⃣ Zatrzymaj Metro bundler
Jeśli działa, naciśnij `Ctrl+C` w terminalu

### 2️⃣ Wyczyść cache Expo i Metro
```bash
cd window-measurement-app

# Usuń folder cache
rm -rf .expo
rm -rf node_modules/.cache

# Jeśli to nie pomoże, usuń też node_modules
rm -rf node_modules
npm install
```

### 3️⃣ Uruchom z czyszczeniem cache
```bash
npx expo start --clear
```

**WAŻNE:** Użyj `--clear` - to kluczowe!

### 4️⃣ Na telefonie w Expo Go:
- **ZAMKNIJ aplikację** całkowicie (usuń z tła)
- **Zeskanuj QR code ponownie** (nie używaj historii!)

---

## 📱 Co POWINNO się pojawić na telefonie:

```
┌─────────────────────────────┐
│  📏 Moje Pomiary            │  ← NAGŁÓWEK
│  ─────────────────────────  │
│                             │
│                             │
│        📏                   │
│    Brak pomiarów            │  ← ŚRODEK
│                             │
│  Dodaj swój pierwszy pomiar │
│      aby rozpocząć          │
│                             │
│   [ + Dodaj pomiar ]        │
│                             │
│                             │
│                    ( + )    │  ← FLOATING BUTTON
└─────────────────────────────┘
```

**Jeśli widzisz nagłówek "📏 Moje Pomiary" - DZIAŁA!** ✅

---

## 🔍 Diagnostyka - Sprawdź w terminalu:

Po uruchomieniu `npx expo start --clear` powinieneś zobaczyć:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

**Brak błędów o assets = OK!** ✅

---

## ⚠️ Jeśli DALEJ nie działa:

### Opcja 1: Pełny reset
```bash
# Usuń WSZYSTKO i zacznij od nowa
rm -rf node_modules
rm -rf .expo
rm -rf package-lock.json

npm install
npx expo start --clear
```

### Opcja 2: Sprawdź czy masz aktualne Expo
```bash
# Zaktualizuj Expo CLI
npm install -g expo-cli

# Sprawdź wersję
npx expo --version
```

### Opcja 3: Reinstaluj Expo Go
- Odinstaluj Expo Go z telefonu
- Zainstaluj ponownie ze sklepu
- Zeskanuj QR code

---

## 🎯 Test czy działa:

Po uruchomieniu kliknij **niebieski przycisk +** na dole:

1. Powinien się otworzyć **formularz**
2. Wypełnij:
   - Nazwa: "Test"
   - Wysokość: 1500
   - Szerokość: 1000
3. Kliknij **"💾 Zapisz pomiar"**
4. Pomiar pojawi się na liście!

**Jeśli to działa = wszystko działa!** 🎉

---

## 💡 DLACZEGO ten problem występuje?

Expo cache pamięta stary app.json z odnośnikami do `assets/splash.png`.
Nawet gdy usuniesz te linie, cache nadal ich szuka.

**Rozwiązanie:** `--clear` flag wymusza przebudowanie cache.

---

## 📞 Dalej nie działa?

Wyślij screenshot konsoli z błędami!

Lub spróbuj utworzyć projekt od nowa:
```bash
npx create-expo-app test-app
cd test-app
# Skopiuj pliki z naszego projektu
npx expo start
```
