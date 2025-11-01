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
    
    // Pobierz informacje o oryginalnym pliku
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const originalSize = fileInfo.size || 0;
    
    console.log(`📊 Oryginalny rozmiar: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Sprawdź czy plik nie jest już wystarczająco mały
    if (originalSize <= VALIDATION.photos.maxSizeBytes) {
      // Pobierz wymiary bez kompresji
      const result = await manipulateAsync(uri, [], {
        compress: JPEG_QUALITY,
        format: SaveFormat.JPEG,
      });
      
      const info = await FileSystem.getInfoAsync(result.uri);
      
      return {
        uri: result.uri,
        width: result.width,
        height: result.height,
        size: info.size || 0,
      };
    }
    
    // Przeskaluj jeśli za duże
    let width = 0;
    let height = 0;
    
    // Najpierw pobierz wymiary
    const tempResult = await manipulateAsync(uri, []);
    width = tempResult.width;
    height = tempResult.height;
    
    console.log(`📐 Oryginalne wymiary: ${width}x${height}`);
    
    // Oblicz nowe wymiary zachowując proporcje
    let newWidth = width;
    let newHeight = height;
    
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      if (width > height) {
        newWidth = MAX_DIMENSION;
        newHeight = Math.round((height / width) * MAX_DIMENSION);
      } else {
        newHeight = MAX_DIMENSION;
        newWidth = Math.round((width / height) * MAX_DIMENSION);
      }
      console.log(`📏 Nowe wymiary: ${newWidth}x${newHeight}`);
    }
    
    // Kompresuj i przeskaluj
    const result = await manipulateAsync(
      uri,
      [{ resize: { width: newWidth, height: newHeight } }],
      {
        compress: JPEG_QUALITY,
        format: SaveFormat.JPEG,
      }
    );
    
    // Pobierz rozmiar skompresowanego pliku
    const compressedInfo = await FileSystem.getInfoAsync(result.uri);
    const compressedSize = compressedInfo.size || 0;
    
    console.log(`✅ Skompresowany rozmiar: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`💾 Zaoszczędzono: ${((originalSize - compressedSize) / 1024 / 1024).toFixed(2)} MB`);
    
    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
      size: compressedSize,
    };
  } catch (error) {
    console.error('❌ Błąd podczas kompresji zdjęcia:', error);
    throw new Error('Nie udało się skompresować zdjęcia');
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
    return (info.size || 0) <= VALIDATION.photos.maxSizeBytes;
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
