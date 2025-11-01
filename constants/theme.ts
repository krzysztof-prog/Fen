/**
 * MOTYW APLIKACJI
 * Kolorystyka, spacing, typografia i inne stałe designu
 */

// ============================================
// KOLORY
// ============================================

export const COLORS = {
  // Główne kolory aplikacji
  primary: '#3b82f6',        // Niebieski - główny kolor akcji
  primaryDark: '#2563eb',    // Ciemniejszy niebieski
  primaryLight: '#60a5fa',   // Jaśniejszy niebieski
  
  secondary: '#8b5cf6',      // Fioletowy - akcent
  secondaryDark: '#7c3aed',
  secondaryLight: '#a78bfa',
  
  // Kolory statusów
  success: '#10b981',        // Zielony - sukces
  successLight: '#34d399',
  warning: '#f59e0b',        // Pomarańczowy - ostrzeżenie
  warningLight: '#fbbf24',
  danger: '#ef4444',         // Czerwony - błąd/usuwanie
  dangerLight: '#f87171',
  info: '#06b6d4',          // Cyan - informacja
  infoLight: '#22d3ee',
  
  // Tła
  background: '#f8fafc',     // Jasny szary - tło główne
  backgroundDark: '#f1f5f9',
  card: '#ffffff',           // Białe - karty
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Teksty
  text: {
    primary: '#0f172a',      // Prawie czarny - główny tekst
    secondary: '#64748b',    // Szary - tekst pomocniczy
    light: '#94a3b8',        // Jasny szary - placeholder
    disabled: '#cbd5e1',     // Bardzo jasny - wyłączone
    inverse: '#ffffff',      // Biały - tekst na ciemnym tle
  },
  
  // Granice i separatory
  border: '#e2e8f0',
  borderDark: '#cbd5e1',
  
  // Specjalne
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Kolory dla typów okien
  window: {
    tilt: '#3b82f6',         // Uchylne - niebieski
    swing: '#10b981',        // Rozwierane - zielony
    fixed: '#64748b',        // Stałe - szary
  },
  
  // Kolory dla pozycji klamki
  handle: {
    left: '#f59e0b',         // Lewa - pomarańczowy
    right: '#8b5cf6',        // Prawa - fioletowy
  }
};

// ============================================
// SPACING (odstępy)
// ============================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ============================================
// TYPOGRAFIA
// ============================================

export const TYPOGRAPHY = {
  // Nagłówki
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    color: COLORS.text.primary,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    color: COLORS.text.primary,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: COLORS.text.primary,
  },
  
  // Tekst podstawowy
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: COLORS.text.primary,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: COLORS.text.primary,
  },
  
  // Tekst mały
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: COLORS.text.secondary,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: COLORS.text.secondary,
  },
  
  // Tekst bardzo mały
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: COLORS.text.light,
  },
  
  // Przycisk
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  
  // Label (etykieta formularza)
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: COLORS.text.primary,
  },
};

// ============================================
// ROZMIARY
// ============================================

export const SIZES = {
  // Przyciski
  button: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
  },
  buttonSmall: {
    height: 36,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
  },
  
  // Input
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
  },
  
  // Karty
  card: {
    borderRadius: 16,
    padding: SPACING.md,
  },
  
  // Ikony
  icon: {
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 48,
  },
  
  // Zdjęcia
  photo: {
    thumbnail: 80,
    preview: 120,
    full: 300,
  },
};

// ============================================
// CIENIE
// ============================================

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// ============================================
// ANIMACJE
// ============================================

export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};

// ============================================
// WALIDACJA - Limity pomiarów
// ============================================

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
    maxSizeBytes: 5 * 1024 * 1024, // 5MB per photo
  },
};

// ============================================
// TEKSTY POMOCNICZE
// ============================================

export const LABELS = {
  handlePosition: {
    left: 'Lewa',
    right: 'Prawa',
  },
  openingType: {
    tilt: 'Uchylne',
    swing: 'Rozwierane',
    fixed: 'Stałe',
  },
  units: {
    mm: 'mm',
    cm: 'cm',
  },
};
