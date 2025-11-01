/**
 * ROOT LAYOUT
 * Główny layout aplikacji z nawigacją i inicjalizacją
 */

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { initDatabase, isDatabaseInitialized } from '../database/db';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

/**
 * Komponent ekranu ładowania
 */
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>Inicjalizacja aplikacji...</Text>
  </View>
);

/**
 * Komponent ekranu błędu
 */
const ErrorScreen = ({ error }: { error: string }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTitle}>❌ Błąd</Text>
    <Text style={styles.errorText}>{error}</Text>
    <Text style={styles.errorHint}>Spróbuj ponownie uruchomić aplikację</Text>
  </View>
);

/**
 * Root Layout - główny layout z inicjalizacją bazy danych
 */
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Rozpoczynam inicjalizację aplikacji...');
      
      // Inicjalizuj bazę danych
      const dbExists = await isDatabaseInitialized();
      if (!dbExists) {
        console.log('📦 Tworzę nową bazę danych...');
        await initDatabase();
      } else {
        console.log('✅ Baza danych już istnieje');
      }
      
      // Opcjonalnie: Dodaj tutaj inne inicjalizacje
      // np. ładowanie fontów, sprawdzanie uprawnień, itp.
      
      console.log('✅ Aplikacja gotowa');
      setIsReady(true);
    } catch (err) {
      console.error('❌ Błąd podczas inicjalizacji:', err);
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    }
  };

  // Pokaż ekran ładowania podczas inicjalizacji
  if (!isReady && !error) {
    return <LoadingScreen />;
  }

  // Pokaż ekran błędu jeśli coś poszło nie tak
  if (error) {
    return <ErrorScreen error={error} />;
  }

  // Główna nawigacja aplikacji
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.card,
          },
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: true,
          animation: 'slide_from_right',
        }}
      >
        {/* Ekran główny - lista pomiarów */}
        <Stack.Screen 
          name="index" 
          options={{ 
            title: '📏 Moje Pomiary',
            headerLargeTitle: false,
          }} 
        />
        
        {/* Ekran nowego pomiaru */}
        <Stack.Screen 
          name="measurement/new" 
          options={{ 
            title: 'Nowy Pomiar',
            presentation: 'modal',
            headerLeft: () => null, // Usuń przycisk wstecz na modale
          }} 
        />
        
        {/* Ekran szczegółów pomiaru */}
        <Stack.Screen 
          name="measurement/[id]" 
          options={{ 
            title: 'Szczegóły Pomiaru',
            headerBackTitle: 'Wróć',
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // Styl ekranu ładowania
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.md,
    color: COLORS.text.secondary,
  },
  
  // Style ekranu błędu
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  errorTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.danger,
    marginBottom: SPACING.md,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  errorHint: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
