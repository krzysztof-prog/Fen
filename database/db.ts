/**
 * BAZA DANYCH SQLite
 * Inicjalizacja i konfiguracja bazy danych dla aplikacji pomiarów okien
 */

import * as SQLite from 'expo-sqlite';

const DB_NAME = 'window_measurements.db';

/**
 * Otwiera połączenie z bazą danych
 * @returns Instancja bazy danych
 */
export const openDatabase = (): SQLite.SQLiteDatabase => {
  try {
    const db = SQLite.openDatabaseSync(DB_NAME);
    return db;
  } catch (error) {
    console.error('Błąd podczas otwierania bazy danych:', error);
    throw error;
  }
};

/**
 * Inicjalizuje strukturę bazy danych
 * Tworzy tabele i indexy jeśli nie istnieją
 */
export const initDatabase = async (): Promise<void> => {
  try {
    const db = openDatabase();
    
    // Tworzenie tabel i indexów w jednej transakcji
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      -- Tabela pomiarów okien
      CREATE TABLE IF NOT EXISTS measurements (
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

      -- Tabela zdjęć (max 8 na pomiar)
      CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        measurement_id INTEGER NOT NULL,
        uri TEXT NOT NULL,
        order_index INTEGER NOT NULL CHECK(order_index >= 0 AND order_index <= 7),
        created_at TEXT NOT NULL,
        FOREIGN KEY (measurement_id) REFERENCES measurements(id) ON DELETE CASCADE,
        UNIQUE(measurement_id, order_index)
      );

      -- Indexy dla wydajności zapytań
      CREATE INDEX IF NOT EXISTS idx_measurements_created 
        ON measurements(created_at DESC);
      
      CREATE INDEX IF NOT EXISTS idx_measurements_name 
        ON measurements(name);
      
      CREATE INDEX IF NOT EXISTS idx_photos_measurement 
        ON photos(measurement_id, order_index);
    `);

    console.log('✅ Baza danych zainicjalizowana pomyślnie');
  } catch (error) {
    console.error('❌ Błąd podczas inicjalizacji bazy danych:', error);
    throw error;
  }
};

/**
 * Resetuje bazę danych (usuwa wszystkie dane)
 * UWAGA: Używać tylko w developmencie!
 */
export const resetDatabase = async (): Promise<void> => {
  try {
    const db = openDatabase();
    await db.execAsync(`
      DROP TABLE IF EXISTS photos;
      DROP TABLE IF EXISTS measurements;
      DROP INDEX IF EXISTS idx_measurements_created;
      DROP INDEX IF EXISTS idx_measurements_name;
      DROP INDEX IF EXISTS idx_photos_measurement;
    `);
    await initDatabase();
    console.log('✅ Baza danych zresetowana');
  } catch (error) {
    console.error('❌ Błąd podczas resetowania bazy danych:', error);
    throw error;
  }
};

/**
 * Sprawdza czy baza danych jest poprawnie zainicjalizowana
 * @returns true jeśli tabele istnieją
 */
export const isDatabaseInitialized = async (): Promise<boolean> => {
  try {
    const db = openDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='measurements'"
    );
    return (result?.count ?? 0) > 0;
  } catch (error) {
    console.error('Błąd podczas sprawdzania bazy danych:', error);
    return false;
  }
};
