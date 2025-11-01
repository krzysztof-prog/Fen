# 📏 Aplikacja do Pomiaru Okien

Aplikacja mobilna (React Native + Expo) do dokumentowania pomiarów otworów okiennych.

## 🚀 Uruchomienie

### 1. Zainstaluj zależności
```bash
npm install
```

### 2. Uruchom aplikację
```bash
npx expo start
```

### 3. Wybierz platformę:
- **Android**: Naciśnij `a` lub zeskanuj QR code w Expo Go
- **iOS**: Naciśnij `i` lub zeskanuj QR code w Expo Go
- **Web**: Naciśnij `w` (ograniczona funkcjonalność)

## 📱 Wymagania

- Node.js 18+
- Expo Go app (na telefonie)
- lub Android Studio / Xcode (dla emulatora)

## 🎯 Funkcje

- ✅ Dodawanie pomiarów (wymiary w mm)
- ✅ Zdjęcia z aparatu (max 8)
- ✅ Lista i wyszukiwanie
- ✅ Eksport do PDF
- ✅ Baza danych SQLite

## 📦 Struktura

```
app/                    # Ekrany (Expo Router)
├── index.tsx          # Lista pomiarów
├── measurement/
│   ├── new.tsx        # Nowy pomiar
│   └── [id].tsx       # Szczegóły
components/            # Komponenty UI
database/              # SQLite + queries
utils/                 # Walidacja, PDF, kompresja
constants/             # Theme i kolory
```

## 🔧 Limity walidacji

- Wysokość: 400-2600 mm
- Szerokość: 400-6000 mm
- Zdjęcia: max 8 per pomiar
- Nazwa: wymagana, max 100 znaków
