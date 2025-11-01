/**
 * HOME SCREEN - LISTA POMIARÓW
 * Główny ekran aplikacji wyświetlający wszystkie pomiary
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeScreen } from '../components/SafeScreen';
import { MeasurementCard } from '../components/MeasurementCard';
import { getAllMeasurements, deleteMeasurement, getMeasurementsCount } from '../database/queries';
import { Measurement } from '../database/models';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS } from '../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [filteredMeasurements, setFilteredMeasurements] = useState<Measurement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Ładuj pomiary przy pierwszym otwarciu ekranu
  useEffect(() => {
    loadMeasurements();
  }, []);

  // Przeładuj listę po powrocie na ekran (np. po dodaniu nowego pomiaru)
  useFocusEffect(
    useCallback(() => {
      loadMeasurements();
    }, [])
  );

  // Filtrowanie pomiarów przy wpisywaniu w wyszukiwarkę
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMeasurements(measurements);
    } else {
      const filtered = measurements.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMeasurements(filtered);
    }
  }, [searchQuery, measurements]);

  /**
   * Ładuje wszystkie pomiary z bazy danych
   */
  const loadMeasurements = async () => {
    try {
      setIsLoading(true);
      const data = await getAllMeasurements();
      setMeasurements(data);
      setFilteredMeasurements(data);
      console.log(`✅ Załadowano ${data.length} pomiarów`);
    } catch (error) {
      console.error('❌ Błąd podczas ładowania pomiarów:', error);
      Alert.alert('Błąd', 'Nie udało się załadować pomiarów');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Odświeżanie listy (pull to refresh)
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMeasurements();
    setIsRefreshing(false);
  };

  /**
   * Przejście do szczegółów pomiaru
   */
  const handlePressMeasurement = (measurement: Measurement) => {
    router.push(`/measurement/${measurement.id}`);
  };

  /**
   * Długie przytrzymanie - opcje usuwania
   */
  const handleLongPressMeasurement = (measurement: Measurement) => {
    Alert.alert(
      'Opcje pomiaru',
      `Co chcesz zrobić z pomiarem "${measurement.name}"?`,
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => handleDeleteMeasurement(measurement),
        },
      ]
    );
  };

  /**
   * Usuwa pomiar po potwierdzeniu
   */
  const handleDeleteMeasurement = (measurement: Measurement) => {
    Alert.alert(
      'Usuń pomiar',
      `Czy na pewno chcesz usunąć pomiar "${measurement.name}"? Tej operacji nie można cofnąć.`,
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMeasurement(measurement.id!);
              await loadMeasurements();
              Alert.alert('Sukces', 'Pomiar został usunięty');
            } catch (error) {
              console.error('❌ Błąd podczas usuwania:', error);
              Alert.alert('Błąd', 'Nie udało się usunąć pomiaru');
            }
          },
        },
      ]
    );
  };

  /**
   * Przejście do ekranu dodawania nowego pomiaru
   */
  const handleAddNew = () => {
    router.push('/measurement/new');
  };

  /**
   * Renderowanie pustego stanu (brak pomiarów)
   */
  const renderEmptyState = () => {
    if (isLoading) return null;

    if (searchQuery.trim() !== '' && filteredMeasurements.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Brak wyników</Text>
          <Text style={styles.emptyText}>
            Nie znaleziono pomiarów zawierających "{searchQuery}"
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📏</Text>
        <Text style={styles.emptyTitle}>Brak pomiarów</Text>
        <Text style={styles.emptyText}>
          Dodaj swój pierwszy pomiar, aby rozpocząć
        </Text>
        <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
          <Text style={styles.emptyButtonText}>+ Dodaj pomiar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Renderowanie pojedynczej karty
   */
  const renderItem = ({ item }: { item: Measurement }) => (
    <MeasurementCard
      measurement={item}
      onPress={() => handlePressMeasurement(item)}
      onLongPress={() => handleLongPressMeasurement(item)}
    />
  );

  /**
   * Renderowanie ekranu ładowania
   */
  if (isLoading) {
    return (
      <SafeScreen backgroundColor={COLORS.background}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Ładowanie pomiarów...</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen backgroundColor={COLORS.background}>
      <View style={styles.container}>
        {/* Pasek wyszukiwania */}
        {measurements.length > 0 && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Szukaj pomiarów..."
                placeholderTextColor={COLORS.text.light}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Statystyki */}
        {measurements.length > 0 && (
          <View style={styles.stats}>
            <Text style={styles.statsText}>
              {filteredMeasurements.length === measurements.length
                ? `Wszystkie pomiary: ${measurements.length}`
                : `Wyniki: ${filteredMeasurements.length} z ${measurements.length}`}
            </Text>
          </View>
        )}

        {/* Lista pomiarów */}
        <FlatList
          data={filteredMeasurements}
          renderItem={renderItem}
          keyExtractor={(item) => item.id!.toString()}
          contentContainerStyle={[
            styles.listContent,
            filteredMeasurements.length === 0 && styles.listContentEmpty,
          ]}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Przycisk dodawania (floating action button) */}
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddNew}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
  },

  // Wyszukiwarka
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.input.borderRadius,
    paddingHorizontal: SPACING.md,
    height: SIZES.input.height,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.text.light,
  },

  // Statystyki
  stats: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  statsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },

  // Lista
  listContent: {
    paddingBottom: 80, // Miejsce na FAB
  },
  listContentEmpty: {
    flexGrow: 1,
  },

  // Pusty stan
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: SIZES.button.borderRadius,
    ...SHADOWS.medium,
  },
  emptyButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.inverse,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.text.inverse,
    fontWeight: '300',
  },
});
