/**
 * MODELE DANYCH - TypeScript Interfaces
 * Definicje typów dla pomiarów okien i zdjęć
 */

export interface Measurement {
  id?: number;
  name: string;           // Nazwa pomiaru (wymagana, nie może być pusta)
  width: number;          // Szerokość w mm (min: 400, max: 6000)
  height: number;         // Wysokość w mm (min: 400, max: 2600)
  handle_position: 'left' | 'right';
  opening_type: 'tilt' | 'swing' | 'fixed';
  notes?: string;         // Opcjonalne notatki
  created_at: string;     // ISO string
  updated_at: string;     // ISO string
}

export interface Photo {
  id?: number;
  measurement_id: number;
  uri: string;            // Ścieżka do pliku zdjęcia
  order_index: number;    // Kolejność (0-7, max 8 zdjęć)
  created_at: string;     // ISO string
}

export interface MeasurementWithPhotos extends Measurement {
  photos: Photo[];        // Tablica zdjęć powiązanych z pomiarem
}

/**
 * Typ dla tworzenia nowego pomiaru (bez ID)
 */
export type NewMeasurement = Omit<Measurement, 'id'>;

/**
 * Typ dla tworzenia nowego zdjęcia (bez ID)
 */
export type NewPhoto = Omit<Photo, 'id'>;

/**
 * Typ dla częściowej aktualizacji pomiaru
 */
export type MeasurementUpdate = Partial<Omit<Measurement, 'id' | 'created_at'>>;
