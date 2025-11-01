/**
 * WALIDACJA DANYCH
 * Funkcje walidujące dane formularza pomiarów
 */

import { VALIDATION } from '../constants/theme';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Waliduje nazwę pomiaru
 * @param name Nazwa do walidacji
 * @returns Wynik walidacji
 */
export const validateName = (name: string): ValidationResult => {
  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return {
      isValid: false,
      error: 'Nazwa pomiaru jest wymagana',
    };
  }
  
  if (trimmedName.length < VALIDATION.measurement.name.minLength) {
    return {
      isValid: false,
      error: `Nazwa musi mieć co najmniej ${VALIDATION.measurement.name.minLength} znak`,
    };
  }
  
  if (trimmedName.length > VALIDATION.measurement.name.maxLength) {
    return {
      isValid: false,
      error: `Nazwa może mieć maksymalnie ${VALIDATION.measurement.name.maxLength} znaków`,
    };
  }
  
  return { isValid: true };
};

/**
 * Waliduje wysokość okna
 * @param height Wysokość w mm
 * @returns Wynik walidacji
 */
export const validateHeight = (height: number | string): ValidationResult => {
  const heightNum = typeof height === 'string' ? parseInt(height, 10) : height;
  
  if (isNaN(heightNum)) {
    return {
      isValid: false,
      error: 'Wysokość musi być liczbą',
    };
  }
  
  if (heightNum < VALIDATION.measurement.dimensions.height.min) {
    return {
      isValid: false,
      error: `Wysokość musi wynosić co najmniej ${VALIDATION.measurement.dimensions.height.min} mm`,
    };
  }
  
  if (heightNum > VALIDATION.measurement.dimensions.height.max) {
    return {
      isValid: false,
      error: `Wysokość może wynosić maksymalnie ${VALIDATION.measurement.dimensions.height.max} mm`,
    };
  }
  
  return { isValid: true };
};

/**
 * Waliduje szerokość okna
 * @param width Szerokość w mm
 * @returns Wynik walidacji
 */
export const validateWidth = (width: number | string): ValidationResult => {
  const widthNum = typeof width === 'string' ? parseInt(width, 10) : width;
  
  if (isNaN(widthNum)) {
    return {
      isValid: false,
      error: 'Szerokość musi być liczbą',
    };
  }
  
  if (widthNum < VALIDATION.measurement.dimensions.width.min) {
    return {
      isValid: false,
      error: `Szerokość musi wynosić co najmniej ${VALIDATION.measurement.dimensions.width.min} mm`,
    };
  }
  
  if (widthNum > VALIDATION.measurement.dimensions.width.max) {
    return {
      isValid: false,
      error: `Szerokość może wynosić maksymalnie ${VALIDATION.measurement.dimensions.width.max} mm`,
    };
  }
  
  return { isValid: true };
};

/**
 * Waliduje notatki
 * @param notes Notatki do walidacji
 * @returns Wynik walidacji
 */
export const validateNotes = (notes: string): ValidationResult => {
  if (notes.length > VALIDATION.measurement.notes.maxLength) {
    return {
      isValid: false,
      error: `Notatki mogą mieć maksymalnie ${VALIDATION.measurement.notes.maxLength} znaków`,
    };
  }
  
  return { isValid: true };
};

/**
 * Waliduje liczbę zdjęć
 * @param photoCount Liczba zdjęć
 * @returns Wynik walidacji
 */
export const validatePhotoCount = (photoCount: number): ValidationResult => {
  if (photoCount > VALIDATION.photos.maxCount) {
    return {
      isValid: false,
      error: `Możesz dodać maksymalnie ${VALIDATION.photos.maxCount} zdjęć`,
    };
  }
  
  return { isValid: true };
};

/**
 * Waliduje cały formularz pomiaru
 * @param data Dane formularza
 * @returns Obiekt z błędami dla każdego pola
 */
export const validateMeasurementForm = (data: {
  name: string;
  height: number | string;
  width: number | string;
  notes?: string;
  photoCount?: number;
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }
  
  const heightValidation = validateHeight(data.height);
  if (!heightValidation.isValid) {
    errors.height = heightValidation.error!;
  }
  
  const widthValidation = validateWidth(data.width);
  if (!widthValidation.isValid) {
    errors.width = widthValidation.error!;
  }
  
  if (data.notes) {
    const notesValidation = validateNotes(data.notes);
    if (!notesValidation.isValid) {
      errors.notes = notesValidation.error!;
    }
  }
  
  if (data.photoCount !== undefined) {
    const photoValidation = validatePhotoCount(data.photoCount);
    if (!photoValidation.isValid) {
      errors.photos = photoValidation.error!;
    }
  }
  
  return errors;
};

/**
 * Sprawdza czy formularz ma jakiekolwiek błędy
 * @param errors Obiekt błędów
 * @returns true jeśli są błędy
 */
export const hasErrors = (errors: { [key: string]: string }): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Konwertuje cm na mm
 * @param cm Wartość w cm
 * @returns Wartość w mm
 */
export const cmToMm = (cm: number): number => {
  return Math.round(cm * 10);
};

/**
 * Konwertuje mm na cm
 * @param mm Wartość w mm
 * @returns Wartość w cm
 */
export const mmToCm = (mm: number): number => {
  return mm / 10;
};

/**
 * Formatuje liczbę jako string z określoną liczbą miejsc po przecinku
 * @param value Wartość do sformatowania
 * @param decimals Liczba miejsc po przecinku (domyślnie 1)
 * @returns Sformatowany string
 */
export const formatNumber = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};
