/**
 * KOMPRESJA OBRAZÓW
 * Funkcje do kompresji i optymalizacji zdjęć
 */

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { VALIDATION } from '../constants/theme';

export interface ImageInfo {
  uri: string;
  width: number;
  height: number;
  size: number; // w bajtach
}

/**
 * Maksymalna szerokość/wysokość zdjęcia
 * Większe zdjęcia zostaną przeskalowane z zachowaniem proporcji
 */
const MAX_DIMENSION = 1920;

/**
 * Jakość kompresji JPEG (0-1)
 */
const JPEG_QUALITY = 0.8;

/**
 * Kompresuje i optymalizuje zdjęcie
 * @param uri URI oryginalnego zdjęcia
 * @returns Informacje o skompresowanym zdjęciu
 */
export const compressImage = async (uri: string): Promise<ImageInfo> => {
  try {
    console.log('🖼️ Rozpoczynam kompresję zdjęcia:', uri);

    // Zawsze wykonaj kompresję - manipulateAsync automatycznie dostosuje rozmiar
    const result = await manipulateAsync(
      uri,
      [{ resize: { width: MAX_DIMENSION } }], // Automatycznie zachowa proporcje
      {
        compress: JPEG_QUALITY,
        format: SaveFormat.JPEG,
      }
    );

    console.log(`📐 Skompresowane wymiary: ${result.width}x${result.height}`);

    // Spróbuj pobrać rozmiar pliku (może nie być dostępny dla wszystkich URI)
    let size = 0;
    try {
      const info = await FileSystem.getInfoAsync(result.uri);
      if (info.exists && 'size' in info) {
        size = info.size;
        console.log(`✅ Rozmiar po kompresji: ${formatFileSize(size)}`);
      }
    } catch (err) {
      console.log('⚠️ Nie można pobrać rozmiaru pliku (to normalne dla niektórych URI)');
    }

    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
      size: size,
    };
  } catch (error) {
    console.error('❌ Błąd podczas kompresji zdjęcia:', error);
    console.error('Szczegóły błędu:', JSON.stringify(error, null, 2));
    throw error; // Rzuć oryginalny błąd, żeby zobaczyć dokładny komunikat
  }
};

/**
 * Kompresuje wiele zdjęć jednocześnie
 * @param uris Tablica URI zdjęć
 * @param onProgress Callback postępu (opcjonalny)
 * @returns Tablica informacji o skompresowanych zdjęciach
 */
export const compressImages = async (
  uris: string[],
  onProgress?: (current: number, total: number) => void
): Promise<ImageInfo[]> => {
  const results: ImageInfo[] = [];
  
  for (let i = 0; i < uris.length; i++) {
    const compressed = await compressImage(uris[i]);
    results.push(compressed);
    
    if (onProgress) {
      onProgress(i + 1, uris.length);
    }
  }
  
  return results;
};

/**
 * Generuje miniaturkę zdjęcia
 * @param uri URI oryginalnego zdjęcia
 * @param size Rozmiar miniatury (kwadrat)
 * @returns URI miniatury
 */
export const generateThumbnail = async (
  uri: string,
  size: number = 200
): Promise<string> => {
  try {
    const result = await manipulateAsync(
      uri,
      [{ resize: { width: size, height: size } }],
      {
        compress: 0.7,
        format: SaveFormat.JPEG,
      }
    );
    
    return result.uri;
  } catch (error) {
    console.error('❌ Błąd podczas generowania miniatury:', error);
    throw new Error('Nie udało się wygenerować miniatury');
  }
};

/**
 * Sprawdza czy rozmiar pliku nie przekracza limitu
 * @param uri URI pliku
 * @returns true jeśli rozmiar jest OK
 */
export const validateFileSize = async (uri: string): Promise<boolean> => {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    const size = (info.exists && 'size' in info) ? info.size : 0;
    return size <= VALIDATION.photos.maxSizeBytes;
  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania rozmiaru pliku:', error);
    return false;
  }
};

/**
 * Formatuje rozmiar pliku do czytelnej postaci
 * @param bytes Rozmiar w bajtach
 * @returns Sformatowany string (np. "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};
