# 📏 Aplikacja do Pomiaru Okien - Dokumentacja Techniczna

**Wersja:** 1.0.0  
**Data:** Październik 2025  
**Technologia:** React Native (Expo SDK 52)  
**Język:** Polski

---

## 📋 Spis treści

1. [Opis projektu](#opis-projektu)
2. [Wymagania systemowe](#wymagania-systemowe)
3. [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
4. [Architektura aplikacji](#architektura-aplikacji)
5. [Struktura projektu](#struktura-projektu)
6. [Baza danych](#baza-danych)
7. [Komponenty UI](#komponenty-ui)
8. [Funkcjonalności](#funkcjonalności)
9. [Walidacja danych](#walidacja-danych)
10. [Eksport PDF](#eksport-pdf)
11. [Zarządzanie zdjęciami](#zarządzanie-zdjęciami)
12. [Konfiguracja](#konfiguracja)
13. [Testowanie](#testowanie)
14. [Rozwiązywanie problemów](#rozwiązywanie-problemów)
15. [Dalszy rozwój](#dalszy-rozwój)

---

## 🎯 Opis projektu

### Cel aplikacji

Aplikacja mobilna do szybkiego i profesjonalnego dokumentowania pomiarów otworów okiennych. Umożliwia:
- Zapisywanie wymiarów okien (wysokość, szerokość w milimetrach)
- Dokumentowanie typu otwierania i pozycji klamki
- Dodawanie zdjęć (do 8 na pomiar)
- Eksportowanie pomiarów do PDF
- Przechowywanie historii wszystkich pomiarów

### Dla kogo?

- Monterzy okien i drzwi
- Firmy budowlane
- Projektanci wnętrz
- Właściciele nieruchomości planujący wymianę okien

### Kluczowe cechy

✅ **Prostota** - intuicyjny interfejs, minimalna liczba kroków  
✅ **Precyzja** - pomiary w milimetrach z walidacją  
✅ **Dokumentacja** - zdjęcia i notatki dla każdego pomiaru  
✅ **Profesjonalizm** - eksport do PDF z logo i danymi  
✅ **Offline** - działa bez internetu (SQLite)  
✅ **Kolorowy design** - łatwa identyfikacja typów okien  

---

## 💻 Wymagania systemowe

### Dla developera (uruchomienie projektu)

- **Node.js** ≥ 18.0.0
- **npm** lub **yarn**
- **Expo CLI** (instalowane automatycznie)
- **Git** (opcjonalnie)

### Dla użytkownika końcowego

#### Android:
- Android 6.0 (API 23) lub nowszy
- 50 MB wolnej przestrzeni
- Aparat (dla funkcji zdjęć)

#### iOS:
- iOS 13.0 lub nowszy
- 50 MB wolnej przestrzeni
- Aparat (dla funkcji zdjęć)

### Testowanie w developmencie

- **Expo Go app** (Android/iOS) - dla szybkiego testowania
- **Android Emulator** (Android Studio)
- **iOS Simulator** (Xcode, tylko macOS)

---

## 🚀 Instalacja i uruchomienie

### 1. Pobranie projektu

```bash
# Rozpakuj archiwum
unzip window-measurement-app-FIXED.zip
cd window-measurement-app
```

### 2. Instalacja zależności

```bash
npm install
```

**Czas trwania:** 2-5 minut  
**Rozmiar:** ~300 MB (node_modules)

### 3. Uruchomienie development server

```bash
npx expo start
```

lub z czyszczeniem cache:

```bash
npx expo start --clear
```

### 4. Testowanie na urządzeniu

#### Opcja A: Telefon z Expo Go (zalecane)

1. Zainstaluj **Expo Go** z:
   - Google Play Store (Android)
   - App Store (iOS)

2. Zeskanuj QR code z terminala

3. Aplikacja uruchomi się automatycznie

#### Opcja B: Emulator/Simulator

**Android:**
```bash
npx expo start --android
```

**iOS (tylko macOS):**
```bash
npx expo start --ios
```

### 5. Build produkcyjny

#### Android APK:
```bash
npx eas build --platform android --profile preview
```

#### iOS:
```bash
npx eas build --platform ios --profile preview
```

**Wymagania:** Konto Expo (darmowe na expo.dev)

---

## 🏗️ Architektura aplikacji

### Stack technologiczny

| Kategoria | Technologia | Wersja |
|-----------|-------------|--------|
| **Framework** | React Native | 0.76.3 |
| **Platform** | Expo | ~52.0.0 |
| **Nawigacja** | Expo Router | ~4.0.0 |
| **Język** | TypeScript | ~5.3.3 |
| **Baza danych** | SQLite (expo-sqlite) | ~15.0.3 |
| **Zdjęcia** | expo-camera | ~16.0.7 |
| **Kompresja** | expo-image-manipulator | ~13.0.5 |
| **PDF** | expo-print | ~14.0.1 |
| **SafeArea** | react-native-safe-area-context | 4.12.0 |

### Wzorce projektowe

- **File-based routing** (Expo Router)
- **Component-driven development**
- **Separation of concerns** (UI / Logic / Data)
- **TypeScript strict mode**
- **Functional components + Hooks**

### Przepływ danych

```
User Input → Validation → SQLite Database → UI Update
                ↓
          Image Compression
                ↓
          File System
                ↓
          PDF Generation
```

---

## 📁 Struktura projektu

```
window-measurement-app/
│
├── 📱 app/                          # Ekrany aplikacji (Expo Router)
│   ├── _layout.tsx                 # Root layout z nawigacją
│   ├── index.tsx                   # Ekran główny (lista pomiarów)
│   └── measurement/
│       ├── new.tsx                 # Ekran nowego pomiaru
│       └── [id].tsx                # Ekran szczegółów pomiaru
│
├── 🎨 components/                   # Komponenty UI
│   ├── SafeScreen.tsx              # Wrapper z SafeArea
│   ├── MeasurementCard.tsx         # Karta pomiaru na liście
│   ├── MeasurementForm.tsx         # Formularz danych pomiaru
│   └── PhotoGallery.tsx            # Galeria zdjęć z aparatem
│
├── 💾 database/                     # Warstwa bazodanowa
│   ├── db.ts                       # Inicjalizacja SQLite
│   ├── models.ts                   # TypeScript types
│   └── queries.ts                  # CRUD operations
│
├── 🛠️ utils/                        # Narzędzia pomocnicze
│   ├── validation.ts               # Walidacja formularzy
│   ├── imageCompression.ts         # Kompresja zdjęć
│   └── pdfExport.ts                # Generowanie PDF
│
├── 🎨 constants/                    # Stałe i konfiguracja
│   └── theme.ts                    # Kolory, spacing, typography
│
├── ⚙️ Pliki konfiguracyjne
│   ├── package.json                # Zależności npm
│   ├── app.json                    # Konfiguracja Expo
│   ├── tsconfig.json               # Konfiguracja TypeScript
│   └── babel.config.js             # Konfiguracja Babel
│
└── 📚 Dokumentacja
    ├── README.md                   # Podstawowe info
    ├── DOKUMENTACJA.md             # Ten plik
    ├── INSTRUKCJA_URUCHOMIENIA.md  # Jak uruchomić
    └── FIX_ERRORS.md               # Rozwiązywanie problemów
```

---

## 💾 Baza danych

### SQLite Schema

#### Tabela: `measurements`

```sql
CREATE TABLE measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(length(trim(name)) > 0),
  width INTEGER NOT NULL CHECK(width >= 400 AND width <= 6000),
  height INTEGER NOT NULL CHECK(height >= 400 AND height <= 2600),
  handle_position TEXT NOT NULL CHECK(handle_position IN ('left', 'right')),
  opening_type TEXT NOT NULL CHECK(opening_type IN ('tilt', 'swing', 'fixed')),
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**Kolumny:**
- `id` - Unikalny identyfikator (auto-increment)
- `name` - Nazwa pomiaru (np. "Salon - okno lewe")
- `width` - Szerokość w mm (400-6000)
- `height` - Wysokość w mm (400-2600)
- `handle_position` - Pozycja klamki: 'left' | 'right'
- `opening_type` - Typ otwierania: 'tilt' | 'swing' | 'fixed'
- `notes` - Opcjonalne notatki (max 500 znaków)
- `created_at` - Data utworzenia (ISO string)
- `updated_at` - Data ostatniej edycji (ISO string)

#### Tabela: `photos`

```sql
CREATE TABLE photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  measurement_id INTEGER NOT NULL,
  uri TEXT NOT NULL,
  order_index INTEGER NOT NULL CHECK(order_index >= 0 AND order_index <= 7),
  created_at TEXT NOT NULL,
  FOREIGN KEY (measurement_id) REFERENCES measurements(id) ON DELETE CASCADE,
  UNIQUE(measurement_id, order_index)
);
```

**Kolumny:**
- `id` - Unikalny identyfikator
- `measurement_id` - ID powiązanego pomiaru (FK)
- `uri` - Ścieżka do pliku zdjęcia
- `order_index` - Kolejność zdjęcia (0-7)
- `created_at` - Data dodania

**Relacje:**
- CASCADE DELETE: usunięcie pomiaru usuwa wszystkie jego zdjęcia
- UNIQUE constraint: zapobiega duplikatom order_index

#### Indexy

```sql
CREATE INDEX idx_measurements_created ON measurements(created_at DESC);
CREATE INDEX idx_measurements_name ON measurements(name);
CREATE INDEX idx_photos_measurement ON photos(measurement_id, order_index);
```

### TypeScript Models

```typescript
export interface Measurement {
  id?: number;
  name: string;
  width: number;  // mm
  height: number; // mm
  handle_position: 'left' | 'right';
  opening_type: 'tilt' | 'swing' | 'fixed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id?: number;
  measurement_id: number;
  uri: string;
  order_index: number; // 0-7
  created_at: string;
}

export interface MeasurementWithPhotos extends Measurement {
  photos: Photo[];
}
```

---

## 🎨 Komponenty UI

### 1. SafeScreen

**Plik:** `components/SafeScreen.tsx`

**Cel:** Wrapper zapewniający bezpieczne obszary (notch, status bar) na iOS i Android.

**Props:**
```typescript
interface SafeScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
}
```

**Użycie:**
```typescript
<SafeScreen backgroundColor={COLORS.background}>
  <View>{/* Twoja zawartość */}</View>
</SafeScreen>
```

### 2. MeasurementCard

**Plik:** `components/MeasurementCard.tsx`

**Cel:** Wyświetla pojedynczy pomiar na liście.

**Props:**
```typescript
interface MeasurementCardProps {
  measurement: Measurement;
  onPress: () => void;
  onLongPress?: () => void;
}
```

**Features:**
- Kolorowa ikona typu okna
- Wymiary w cm i mm
- Data utworzenia
- Parametry (klamka, typ)
- Notatki (jeśli są)
- Smooth animations

### 3. MeasurementForm

**Plik:** `components/MeasurementForm.tsx`

**Cel:** Formularz do wprowadzania danych pomiaru.

**Props:**
```typescript
interface MeasurementFormProps {
  data: MeasurementFormData;
  onChange: (data: MeasurementFormData) => void;
  errors?: { [key: string]: string };
}
```

**Pola:**
- Nazwa (text input)
- Wysokość (numeric input w mm)
- Szerokość (numeric input w mm)
- Pozycja klamki (przyciski: lewo/prawo)
- Typ otwierania (przyciski: uchylne/rozwierane/stałe)
- Notatki (multiline text)

**Walidacja:** Real-time, z wyświetlaniem błędów.

### 4. PhotoGallery

**Plik:** `components/PhotoGallery.tsx`

**Cel:** Zarządzanie zdjęciami (max 8).

**Props:**
```typescript
interface PhotoGalleryProps {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
  maxPhotos?: number;
}
```

**Features:**
- Dostęp do aparatu
- Automatyczna kompresja
- Miniaturki z numerami
- Usuwanie pojedynczych zdjęć
- Licznik zdjęć (X / 8)

---

## ⚙️ Funkcjonalności

### 1. Lista pomiarów (Home Screen)

**Plik:** `app/index.tsx`

**Funkcje:**
- ✅ Wyświetlanie wszystkich pomiarów
- ✅ Wyszukiwarka (filtrowanie po nazwie)
- ✅ Sortowanie (najnowsze na górze)
- ✅ Pull to refresh
- ✅ Licznik pomiarów
- ✅ Empty state
- ✅ Floating Action Button (+)
- ✅ Nawigacja do szczegółów (tap)
- ✅ Usuwanie (long press)

### 2. Nowy pomiar

**Plik:** `app/measurement/new.tsx`

**Funkcje:**
- ✅ Formularz z walidacją
- ✅ Dodawanie zdjęć (aparat)
- ✅ Kompresja zdjęć
- ✅ Podgląd przed zapisem
- ✅ Anulowanie z potwierdzeniem
- ✅ Loading state podczas zapisu
- ✅ Powrót do listy po zapisie

**Przepływ:**
1. User klika FAB (+)
2. Otwiera się modal z formularzem
3. Wypełnia dane + robi zdjęcia
4. Kliknięcie "Zapisz" → walidacja
5. Zapis do SQLite
6. Powrót do listy

### 3. Szczegóły pomiaru

**Plik:** `app/measurement/[id].tsx`

**Funkcje:**
- ✅ Wyświetlanie wszystkich danych
- ✅ Duże, czytelne wymiary
- ✅ Kolorowe ikony parametrów
- ✅ Galeria zdjęć (horizontal scroll)
- ✅ Pełnoekranowy podgląd zdjęć
- ✅ Eksport do PDF
- ✅ Usuwanie pomiaru
- ✅ Data utworzenia i edycji

**Przepływ eksportu PDF:**
1. User klika "📄 Eksportuj do PDF"
2. Generowanie HTML z danymi
3. Konwersja do PDF (expo-print)
4. Share sheet (udostępnienie)

### 4. Wyszukiwanie

**Funkcja:** Filtrowanie pomiarów w czasie rzeczywistym.

**Algorytm:**
```typescript
const filtered = measurements.filter(m =>
  m.name.toLowerCase().includes(searchQuery.toLowerCase())
);
```

**UX:**
- Wyczyść przycisk (X) gdy coś wpisano
- Licznik wyników
- Komunikat gdy brak wyników

---

## ✅ Walidacja danych

### Limity wymiarów

```typescript
export const VALIDATION = {
  measurement: {
    name: {
      minLength: 1,
      maxLength: 100,
    },
    dimensions: {
      height: {
        min: 400,    // mm
        max: 2600,   // mm
      },
      width: {
        min: 400,    // mm
        max: 6000,   // mm
      },
    },
    notes: {
      maxLength: 500,
    },
  },
  photos: {
    maxCount: 8,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
  },
};
```

### Funkcje walidacyjne

**Plik:** `utils/validation.ts`

```typescript
// Walidacja nazwy
validateName(name: string): ValidationResult

// Walidacja wysokości
validateHeight(height: number): ValidationResult

// Walidacja szerokości
validateWidth(width: number): ValidationResult

// Walidacja notatek
validateNotes(notes: string): ValidationResult

// Walidacja liczby zdjęć
validatePhotoCount(count: number): ValidationResult

// Walidacja całego formularza
validateMeasurementForm(data: FormData): { [key: string]: string }
```

### Komunikaty błędów

Wszystkie komunikaty po polsku:
- "Nazwa pomiaru jest wymagana"
- "Wysokość musi wynosić co najmniej 400 mm"
- "Szerokość może wynosić maksymalnie 6000 mm"
- "Możesz dodać maksymalnie 8 zdjęć"

### Walidacja na poziomie bazy

SQLite CHECK constraints zapewniają dodatkową ochronę:

```sql
CHECK(width >= 400 AND width <= 6000)
CHECK(height >= 400 AND height <= 2600)
CHECK(handle_position IN ('left', 'right'))
CHECK(opening_type IN ('tilt', 'swing', 'fixed'))
```

---

## 📄 Eksport PDF

### Architektura

**Plik:** `utils/pdfExport.ts`

**Biblioteka:** expo-print (wykorzystuje WebView do renderowania HTML → PDF)

### Funkcje publiczne

```typescript
// Eksport pojedynczego pomiaru
exportMeasurementToPDF(measurement: MeasurementWithPhotos): Promise<string>

// Eksport wielu pomiarów
exportMeasurementsToPDF(measurements: MeasurementWithPhotos[], title: string): Promise<string>

// Udostępnianie PDF (share sheet)
sharePDF(pdfUri: string, filename: string): Promise<void>

// Generowanie nazwy pliku
generatePDFFilename(measurement: MeasurementWithPhotos): string
```

### Layout PDF

```
┌─────────────────────────────────────┐
│         📏 Pomiary Okien            │
│     Wygenerowano: 26.10.2025       │
├─────────────────────────────────────┤
│                                     │
│   Pomiar: Salon - okno lewe        │
│   Utworzono: 20.10.2025 14:30      │
│                                     │
│   📐 Wymiary:                       │
│   ┌──────────┬──────────┐          │
│   │ Wysokość │ Szerokość│          │
│   │ 150.0 cm │ 120.0 cm │          │
│   │ (1500mm) │ (1200mm) │          │
│   └──────────┴──────────┘          │
│                                     │
│   ⚙️ Parametry:                     │
│   • Otwieranie: Uchylne            │
│   • Klamka: Prawa                  │
│                                     │
│   📝 Notatki:                       │
│   [tekst notatek jeśli są]         │
│                                     │
│   📷 Zdjęcia (grid 2x2):           │
│   [zdjęcia jeśli są]               │
│                                     │
└─────────────────────────────────────┘
```

### Style CSS

PDF wykorzystuje profesjonalny CSS z:
- Gradientowe nagłówki (niebieski → fioletowy)
- Kolorowe karty wymiarów
- Responsywny grid dla zdjęć
- Print-friendly layout

### Przepływ eksportu

```
1. User klika "Eksportuj PDF"
2. generateMeasurementHTML(measurement)
3. generatePDFHTML(html)
4. Print.printToFileAsync(html) → PDF
5. sharePDF(uri) → Share sheet
6. User wybiera gdzie zapisać/wysłać
```

---

## 📸 Zarządzanie zdjęciami

### Kompresja obrazów

**Plik:** `utils/imageCompression.ts`

**Parametry:**
- Max dimension: 1920px (szerokość lub wysokość)
- JPEG quality: 0.8 (80%)
- Max size: 5MB

**Funkcje:**

```typescript
// Kompresja pojedynczego zdjęcia
compressImage(uri: string): Promise<ImageInfo>

// Kompresja wielu zdjęć
compressImages(uris: string[], onProgress?: Function): Promise<ImageInfo[]>

// Generowanie miniaturki
generateThumbnail(uri: string, size: number): Promise<string>

// Formatowanie rozmiaru
formatFileSize(bytes: number): string
```

### Proces kompresji

```
1. Zdjęcie z aparatu (może być 4-8 MB)
2. Sprawdzenie rozmiaru oryginalnego
3. Resize jeśli > 1920px (zachowanie proporcji)
4. Kompresja JPEG (quality 0.8)
5. Zapis do FileSystem
6. Return nowego URI
```

**Przykład:**
- Input: 3024x4032px, 6.2 MB
- Output: 1440x1920px, 800 KB
- Oszczędność: ~87%

### Uprawnienia

**Android (app.json):**
```json
"permissions": [
  "android.permission.CAMERA",
  "android.permission.READ_MEDIA_IMAGES"
]
```

**iOS (app.json):**
```json
"infoPlist": {
  "NSCameraUsageDescription": "Aplikacja potrzebuje dostępu...",
  "NSPhotoLibraryUsageDescription": "Aplikacja potrzebuje dostępu..."
}
```

### Limit zdjęć

- Maksymalnie **8 zdjęć** na pomiar
- Walidacja na poziomie UI i bazy danych
- UNIQUE constraint: `(measurement_id, order_index)`

---

## ⚙️ Konfiguracja

### Theme Configuration

**Plik:** `constants/theme.ts`

#### Kolory

```typescript
export const COLORS = {
  primary: '#3b82f6',      // Niebieski główny
  secondary: '#8b5cf6',    // Fioletowy akcent
  success: '#10b981',      // Zielony
  danger: '#ef4444',       // Czerwony
  
  // Typy okien
  window: {
    tilt: '#3b82f6',       // Uchylne - niebieski
    swing: '#10b981',      // Rozwierane - zielony
    fixed: '#64748b',      // Stałe - szary
  },
  
  // Pozycje klamki
  handle: {
    left: '#f59e0b',       // Lewa - pomarańczowy
    right: '#8b5cf6',      // Prawa - fioletowy
  },
};
```

#### Spacing

```typescript
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

#### Typography

```typescript
export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
};
```

#### Shadows

```typescript
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  // ...medium, large
};
```

### Expo Configuration

**Plik:** `app.json`

```json
{
  "expo": {
    "name": "Pomiary Okien",
    "slug": "window-measurement-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "windowmeasurement",
    "plugins": [
      "expo-router",
      ["expo-camera", { "cameraPermission": "..." }],
      ["expo-media-library", { "photosPermission": "..." }]
    ],
    "ios": { "bundleIdentifier": "com.yourcompany.windowmeasurement" },
    "android": { "package": "com.yourcompany.windowmeasurement" }
  }
}
```

---

## 🧪 Testowanie

### Testowanie manualne

#### Scenariusz 1: Dodanie pomiaru

1. Uruchom aplikację
2. Kliknij FAB (+)
3. Wypełnij formularz:
   - Nazwa: "Test - okno testowe"
   - Wysokość: 1500
   - Szerokość: 1000
   - Wybierz klamkę i typ
4. Dodaj zdjęcie (opcjonalnie)
5. Kliknij "Zapisz"
6. **Oczekiwany rezultat:** Pomiar pojawia się na liście

#### Scenariusz 2: Walidacja

1. Otwórz formularz nowego pomiaru
2. Pozostaw nazwę pustą
3. Wpisz wysokość: 300 (za mało)
4. Kliknij "Zapisz"
5. **Oczekiwany rezultat:** Błędy walidacji

#### Scenariusz 3: Zdjęcia

1. Otwórz formularz
2. Kliknij "Dodaj zdjęcie"
3. Zrób zdjęcie aparatem
4. Sprawdź czy pojawia się miniaturka
5. Dodaj 8 zdjęć
6. **Oczekiwany rezultat:** Przycisk "Dodaj" znika po 8 zdjęciach

#### Scenariusz 4: Eksport PDF

1. Otwórz szczegóły pomiaru
2. Kliknij "Eksportuj do PDF"
3. Poczekaj na generowanie
4. Wybierz aplikację do udostępnienia
5. **Oczekiwany rezultat:** PDF z danymi pomiaru

### Testowanie na różnych urządzeniach

- **Android 6-14** - sprawdź na starszych i nowszych wersjach
- **iOS 13-17** - sprawdź na różnych iPhone
- **Tablet** - sprawdź layout na większych ekranach
- **SafeArea** - sprawdź na urządzeniach z notch/wyspa dynamiczna

### Checklist funkcjonalności

- [ ] Lista pomiarów ładuje się poprawnie
- [ ] Wyszukiwarka filtruje wyniki
- [ ] Formularz waliduje dane
- [ ] Zdjęcia kompresują się < 1MB
- [ ] PDF generuje się bez błędów
- [ ] Usuwanie pomiaru działa
- [ ] Baza danych persystuje po restarcie
- [ ] SafeArea działa na notch
- [ ] Pull to refresh odświeża listę
- [ ] Floating button jest zawsze widoczny

---

## 🔧 Rozwiązywanie problemów

### Problem: Metro bundler nie startuje

**Objawy:**
```
Unable to start server
Port 8081 is already in use
```

**Rozwiązanie:**
```bash
# Zabij proces na porcie 8081
lsof -ti:8081 | xargs kill -9

# Lub użyj innego portu
npx expo start --port 8082
```

### Problem: "Cannot find module"

**Objawy:**
```
Error: Cannot find module 'expo-sqlite'
```

**Rozwiązanie:**
```bash
# Reinstalacja
rm -rf node_modules
npm install

# Wyczyść cache
npx expo start --clear
```

### Problem: Aparat nie działa w Expo Go (iOS)

**Objawy:**
- Przycisk "Dodaj zdjęcie" nic nie robi
- Permission denied

**Rozwiązanie:**
```bash
# Użyj Expo Dev Client zamiast Expo Go
npx expo install expo-dev-client
npx expo run:ios
```

### Problem: SQLite nie zapisuje danych

**Objawy:**
- Pomiary znikają po restarcie
- Empty list po dodaniu pomiarów

**Rozwiązanie:**
```bash
# Sprawdź logi
npx expo start
# Naciśnij 'j' aby otworzyć DevTools

# Reset bazy (UWAGA: usuwa wszystkie dane!)
# W kodzie wywołaj: await resetDatabase()
```

### Problem: PDF nie generuje się

**Objawy:**
- "Nie udało się wygenerować PDF"
- Timeout

**Rozwiązanie:**
1. Sprawdź czy masz połączenie z internetem (expo-print wymaga)
2. Zredukuj rozmiar zdjęć
3. Spróbuj bez zdjęć najpierw

### Problem: Slow performance

**Objawy:**
- Wolne ładowanie listy
- Lag podczas scrollowania

**Rozwiązanie:**
```bash
# Włącz Hermes engine (domyślnie włączony)
# W app.json sprawdź:
"jsEngine": "hermes"

# Optymalizacja zdjęć
# Zmniejsz JPEG_QUALITY w imageCompression.ts
```

---

## 🚀 Dalszy rozwój

### Planowane funkcje (v2.0)

#### 1. Edycja pomiarów
- Możliwość edycji istniejących pomiarów
- Historia zmian

#### 2. Kategorie / Projekty
- Grupowanie pomiarów w projekty
- Filtry po projektach

#### 3. Cloud backup
- Synchronizacja z chmurą
- Współdzielenie pomiarów między urządzeniami

#### 4. AI rozpoznawanie
- Automatyczne wykrywanie wymiarów ze zdjęcia
- OCR dla tekstu na zdjęciach

#### 5. Rysunki techniczne
- Automatyczne generowanie rysunków okien
- SVG export

#### 6. Multi-język
- Obsługa wielu języków (en, de, pl)
- i18n

#### 7. Statystyki
- Dashboard z statystykami
- Wykresy ilości pomiarów w czasie

#### 8. Export do Excel
- Eksport listy pomiarów do XLSX
- Import z Excel

### Jak dodać nową funkcję?

#### Przykład: Dodanie pola "Kolor ramy"

**1. Rozszerz model:**
```typescript
// database/models.ts
export interface Measurement {
  // ... existing fields
  frame_color?: string; // Nowe pole
}
```

**2. Zaktualizuj schema:**
```typescript
// database/db.ts
CREATE TABLE IF NOT EXISTS measurements (
  // ... existing columns
  frame_color TEXT
);
```

**3. Dodaj do formularza:**
```typescript
// components/MeasurementForm.tsx
<TextInput
  placeholder="Kolor ramy"
  value={data.frame_color}
  onChangeText={(v) => updateField('frame_color', v)}
/>
```

**4. Zaktualizuj queries:**
```typescript
// database/queries.ts
export const createMeasurement = async (measurement) => {
  // Dodaj frame_color do INSERT
};
```

**5. Wyświetl w szczegółach:**
```typescript
// app/measurement/[id].tsx
<Text>Kolor ramy: {measurement.frame_color}</Text>
```

**6. Dodaj do PDF:**
```typescript
// utils/pdfExport.ts
<tr>
  <td>Kolor ramy:</td>
  <td>${measurement.frame_color || 'Nie określono'}</td>
</tr>
```

---

## 📞 Wsparcie i kontakt

### Dokumentacja zewnętrzna

- **Expo:** https://docs.expo.dev
- **React Native:** https://reactnative.dev
- **TypeScript:** https://www.typescriptlang.org/docs
- **SQLite:** https://www.sqlite.org/docs.html

### Community

- **Expo Forum:** https://forums.expo.dev
- **React Native Community:** https://reactnative.dev/community/overview
- **Stack Overflow:** Tag `expo`, `react-native`

### Zgłaszanie błędów

Przy zgłaszaniu błędów dołącz:
1. Wersję systemu (Android/iOS)
2. Logi z terminala
3. Kroki do reprodukcji
4. Screenshots / video

---

## 📜 Licencja i prawa

**Projekt:** Window Measurement App  
**Wersja:** 1.0.0  
**Licencja:** MIT (do określenia)  

---

## 🎉 Podziękowania

Projekt wykorzystuje następujące biblioteki open-source:
- React Native & Expo Team
- SQLite
- React Navigation
- TypeScript Team

---

**Ostatnia aktualizacja:** 26.10.2025  
**Status dokumentacji:** ✅ Kompletna  
**Wersja dokumentacji:** 1.0.0
