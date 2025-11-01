/**
 * ZAPYTANIA SQL
 * Wszystkie operacje CRUD dla pomiarów i zdjęć
 */

import { openDatabase } from './db';
import { 
  Measurement, 
  Photo, 
  MeasurementWithPhotos, 
  NewMeasurement, 
  NewPhoto,
  MeasurementUpdate 
} from './models';

const db = openDatabase();

// ============================================
// CREATE - Tworzenie nowych rekordów
// ============================================

/**
 * Tworzy nowy pomiar w bazie danych
 * @param measurement Dane nowego pomiaru
 * @returns ID utworzonego pomiaru
 */
export const createMeasurement = async (measurement: NewMeasurement): Promise<number> => {
  try {
    const result = await db.runAsync(
      `INSERT INTO measurements (name, width, height, handle_position, opening_type, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        measurement.name.trim(),
        measurement.width,
        measurement.height,
        measurement.handle_position,
        measurement.opening_type,
        measurement.notes?.trim() || null,
        measurement.created_at,
        measurement.updated_at
      ]
    );
    
    console.log(`✅ Utworzono pomiar ID: ${result.lastInsertRowId}`);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('❌ Błąd podczas tworzenia pomiaru:', error);
    throw new Error('Nie udało się zapisać pomiaru');
  }
};

/**
 * Dodaje zdjęcie do pomiaru
 * @param photo Dane zdjęcia
 * @returns ID utworzonego zdjęcia
 */
export const addPhoto = async (photo: NewPhoto): Promise<number> => {
  try {
    // Sprawdź czy nie przekroczono limitu 8 zdjęć
    const count = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM photos WHERE measurement_id = ?',
      [photo.measurement_id]
    );

    if (count && count.count >= 8) {
      throw new Error('Osiągnięto limit 8 zdjęć dla tego pomiaru');
    }

    const result = await db.runAsync(
      `INSERT INTO photos (measurement_id, uri, order_index, created_at)
       VALUES (?, ?, ?, ?)`,
      [photo.measurement_id, photo.uri, photo.order_index, photo.created_at]
    );
    
    console.log(`✅ Dodano zdjęcie ID: ${result.lastInsertRowId}`);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('❌ Błąd podczas dodawania zdjęcia:', error);
    throw error;
  }
};

/**
 * Dodaje wiele zdjęć do pomiaru (bulk insert)
 * @param photos Tablica zdjęć do dodania
 * @returns Liczba dodanych zdjęć
 */
export const addPhotos = async (photos: NewPhoto[]): Promise<number> => {
  try {
    if (photos.length === 0) return 0;
    if (photos.length > 8) {
      throw new Error('Można dodać maksymalnie 8 zdjęć');
    }

    let addedCount = 0;
    for (const photo of photos) {
      await addPhoto(photo);
      addedCount++;
    }

    return addedCount;
  } catch (error) {
    console.error('❌ Błąd podczas dodawania zdjęć:', error);
    throw error;
  }
};

// ============================================
// READ - Odczyt danych
// ============================================

/**
 * Pobiera wszystkie pomiary (bez zdjęć) posortowane od najnowszych
 * @returns Tablica pomiarów
 */
export const getAllMeasurements = async (): Promise<Measurement[]> => {
  try {
    const measurements = await db.getAllAsync<Measurement>(
      'SELECT * FROM measurements ORDER BY created_at DESC'
    );
    return measurements;
  } catch (error) {
    console.error('❌ Błąd podczas pobierania pomiarów:', error);
    return [];
  }
};

/**
 * Pobiera pomiar wraz ze zdjęciami po ID
 * @param id ID pomiaru
 * @returns Pomiar ze zdjęciami lub null
 */
export const getMeasurementById = async (id: number): Promise<MeasurementWithPhotos | null> => {
  try {
    const measurement = await db.getFirstAsync<Measurement>(
      'SELECT * FROM measurements WHERE id = ?',
      [id]
    );
    
    if (!measurement) {
      console.warn(`⚠️ Nie znaleziono pomiaru o ID: ${id}`);
      return null;
    }

    const photos = await db.getAllAsync<Photo>(
      'SELECT * FROM photos WHERE measurement_id = ? ORDER BY order_index ASC',
      [id]
    );

    return { ...measurement, photos };
  } catch (error) {
    console.error('❌ Błąd podczas pobierania pomiaru:', error);
    return null;
  }
};

/**
 * Wyszukuje pomiary po nazwie
 * @param searchTerm Fraza do wyszukania
 * @returns Tablica znalezionych pomiarów
 */
export const searchMeasurements = async (searchTerm: string): Promise<Measurement[]> => {
  try {
    const measurements = await db.getAllAsync<Measurement>(
      `SELECT * FROM measurements 
       WHERE name LIKE ? 
       ORDER BY created_at DESC`,
      [`%${searchTerm}%`]
    );
    return measurements;
  } catch (error) {
    console.error('❌ Błąd podczas wyszukiwania:', error);
    return [];
  }
};

/**
 * Pobiera liczbę wszystkich pomiarów
 * @returns Liczba pomiarów
 */
export const getMeasurementsCount = async (): Promise<number> => {
  try {
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM measurements'
    );
    return result?.count ?? 0;
  } catch (error) {
    console.error('❌ Błąd podczas pobierania liczby pomiarów:', error);
    return 0;
  }
};

/**
 * Pobiera zdjęcia dla konkretnego pomiaru
 * @param measurementId ID pomiaru
 * @returns Tablica zdjęć
 */
export const getPhotosByMeasurementId = async (measurementId: number): Promise<Photo[]> => {
  try {
    const photos = await db.getAllAsync<Photo>(
      'SELECT * FROM photos WHERE measurement_id = ? ORDER BY order_index ASC',
      [measurementId]
    );
    return photos;
  } catch (error) {
    console.error('❌ Błąd podczas pobierania zdjęć:', error);
    return [];
  }
};

// ============================================
// UPDATE - Aktualizacja danych
// ============================================

/**
 * Aktualizuje pomiar
 * @param id ID pomiaru do aktualizacji
 * @param updates Dane do zaktualizowania
 */
export const updateMeasurement = async (
  id: number, 
  updates: MeasurementUpdate
): Promise<void> => {
  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name.trim());
    }
    if (updates.width !== undefined) {
      fields.push('width = ?');
      values.push(updates.width);
    }
    if (updates.height !== undefined) {
      fields.push('height = ?');
      values.push(updates.height);
    }
    if (updates.handle_position !== undefined) {
      fields.push('handle_position = ?');
      values.push(updates.handle_position);
    }
    if (updates.opening_type !== undefined) {
      fields.push('opening_type = ?');
      values.push(updates.opening_type);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes?.trim() || null);
    }

    // Zawsze aktualizuj updated_at
    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    
    values.push(id);

    if (fields.length === 1) { // Tylko updated_at
      return;
    }

    await db.runAsync(
      `UPDATE measurements SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    console.log(`✅ Zaktualizowano pomiar ID: ${id}`);
  } catch (error) {
    console.error('❌ Błąd podczas aktualizacji pomiaru:', error);
    throw new Error('Nie udało się zaktualizować pomiaru');
  }
};

// ============================================
// DELETE - Usuwanie danych
// ============================================

/**
 * Usuwa pomiar (wraz z powiązanymi zdjęciami przez CASCADE)
 * @param id ID pomiaru do usunięcia
 */
export const deleteMeasurement = async (id: number): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM measurements WHERE id = ?', [id]);
    console.log(`✅ Usunięto pomiar ID: ${id}`);
  } catch (error) {
    console.error('❌ Błąd podczas usuwania pomiaru:', error);
    throw new Error('Nie udało się usunąć pomiaru');
  }
};

/**
 * Usuwa pojedyncze zdjęcie
 * @param id ID zdjęcia do usunięcia
 */
export const deletePhoto = async (id: number): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM photos WHERE id = ?', [id]);
    console.log(`✅ Usunięto zdjęcie ID: ${id}`);
  } catch (error) {
    console.error('❌ Błąd podczas usuwania zdjęcia:', error);
    throw new Error('Nie udało się usunąć zdjęcia');
  }
};

/**
 * Usuwa wszystkie zdjęcia dla danego pomiaru
 * @param measurementId ID pomiaru
 */
export const deletePhotosByMeasurementId = async (measurementId: number): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM photos WHERE measurement_id = ?', [measurementId]);
    console.log(`✅ Usunięto wszystkie zdjęcia dla pomiaru ID: ${measurementId}`);
  } catch (error) {
    console.error('❌ Błąd podczas usuwania zdjęć:', error);
    throw new Error('Nie udało się usunąć zdjęć');
  }
};
