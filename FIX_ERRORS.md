# 🔧 SZYBKA NAPRAWA - Jeśli masz błędy

## ❌ Błąd: "Unable to resolve asset"

**Rozwiązanie:** app.json został już naprawiony - nie potrzebujesz żadnych obrazów!

```bash
# Usuń cache i uruchom ponownie
npx expo start --clear
```

---

## ❌ Błąd: "Open up App.tsx to start working"

**To NIE jest błąd!** To domyślny komunikat Expo. Twoja aplikacja działa!

**Sprawdź czy widzisz:**
- Nagłówek "📏 Moje Pomiary" na górze
- Niebieski przycisk "+" na dole

Jeśli TAK - **WSZYSTKO DZIAŁA!** 🎉

---

## ❌ Błąd: Metro bundler nie startuje

```bash
# Wyczyść cache
npx expo start --clear

# Jeśli nie pomaga:
rm -rf node_modules
npm install
npx expo start --clear
```

---

## ❌ Błąd: "Cannot find module"

```bash
# Zainstaluj brakujące zależności
npm install
```

---

## ❌ Telefon nie łączy się z Expo

1. **Sprawdź WiFi** - telefon i komputer w tej samej sieci!
2. **Wyłącz VPN** - może blokować połączenie
3. **Sprawdź firewall** - pozwól na połączenia lokalne
4. **Wpisz URL ręcznie** w Expo Go zamiast skanować QR

---

## ✅ JAK SPRAWDZIĆ CZY DZIAŁA?

### Po uruchomieniu `npx expo start` powinieneś zobaczyć:

**W terminalu:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

**Na telefonie (po zeskanowaniu):**
```
┌─────────────────────┐
│ 📏 Moje Pomiary     │ ← Nagłówek
│                     │
│  Brak pomiarów      │
│                     │
│      [+]            │ ← Niebieski przycisk
└─────────────────────┘
```

**Jeśli widzisz ekran jak wyżej - DZIAŁA!** 🎉

---

## 🧪 Test podstawowych funkcji:

1. **Kliknij przycisk +** → Powinieneś zobaczyć formularz
2. **Wypełnij dane:**
   - Nazwa: "Test"
   - Wysokość: 1500
   - Szerokość: 1000
3. **Kliknij Zapisz** → Pomiar pojawi się na liście!

Jeśli to działa - wszystkie funkcje będą działać! ✅

---

## 📞 Dalej nie działa?

Uruchom z pełnymi logami:
```bash
npx expo start --dev-client
```

Skopiuj błędy i sprawdź w dokumentacji Expo:
https://docs.expo.dev/troubleshooting/overview/
