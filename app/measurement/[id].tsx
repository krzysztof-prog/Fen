/**
 * MEASUREMENT DETAIL SCREEN
 * Ekran szczegółów pomiaru z możliwością edycji i usuwania
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeScreen } from '../../components/SafeScreen';
import {
  getMeasurementById,
  deleteMeasurement,
  updateMeasurement,
  deletePhoto,
} from '../../database/queries';
import { MeasurementWithPhotos } from '../../database/models';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS, LABELS } from '../../constants/theme';
import {
  exportMeasurementToPDF,
  sharePDF,
  generatePDFFilename,
} from '../../utils/pdfExport';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MeasurementDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const measurementId = parseInt(params.id as string, 10);

  const [measurement, setMeasurement] = useState<MeasurementWithPhotos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadMeasurement();
  }, [measurementId]);

  /**
   * Ładuje dane pomiaru z bazy
   */
  const loadMeasurement = async () => {
    try {
      setIsLoading(true);
      const data = await getMeasurementById(measurementId);
      
      if (!data) {
        Alert.alert('Błąd', 'Nie znaleziono pomiaru', [
          { text: 'OK', onPress: () => router.back() },
        ]);
        return;
      }

      setMeasurement(data);
    } catch (error) {
      console.error('❌ Błąd podczas ładowania pomiaru:', error);
      Alert.alert('Błąd', 'Nie udało się załadować pomiaru');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Formatuje datę
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} o ${hours}:${minutes}`;
  };

  /**
   * Konwersja mm na cm
   */
  const mmToCm = (mm: number): string => {
    return (mm / 10).toFixed(1);
  };

  /**
   * Kolor typu otwierania
   */
  const getOpeningTypeColor = () => {
    if (!measurement) return COLORS.secondary;
    switch (measurement.opening_type) {
      case 'tilt':
        return COLORS.window.tilt;
      case 'swing':
        return COLORS.window.swing;
      case 'fixed':
        return COLORS.window.fixed;
      default:
        return COLORS.secondary;
    }
  };

  /**
   * Kolor pozycji klamki
   */
  const getHandleColor = () => {
    if (!measurement) return COLORS.secondary;
    return measurement.handle_position === 'left'
      ? COLORS.handle.left
      : COLORS.handle.right;
  };

  /**
   * Usuwa pomiar
   */
  const handleDelete = () => {
    Alert.alert(
      'Usuń pomiar',
      `Czy na pewno chcesz usunąć pomiar "${measurement?.name}"? Tej operacji nie można cofnąć.`,
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
              await deleteMeasurement(measurementId);
              Alert.alert('Sukces', 'Pomiar został usunięty', [
                { text: 'OK', onPress: () => router.back() },
              ]);
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
   * Eksportuje pomiar do PDF
   */
  const handleExportPDF = async () => {
    if (!measurement) return;

    try {
      setIsExporting(true);

      // Generuj PDF
      const pdfUri = await exportMeasurementToPDF(measurement);
      
      // Wygeneruj nazwę pliku
      const filename = generatePDFFilename(measurement);

      // Udostępnij PDF
      await sharePDF(pdfUri, filename);

      Alert.alert('Sukces', 'PDF został wygenerowany i udostępniony');
    } catch (error) {
      console.error('❌ Błąd podczas eksportu PDF:', error);
      Alert.alert('Błąd', 'Nie udało się wygenerować PDF');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Renderuje menu opcji
   */
  const renderOptionsMenu = () => (
    <View style={styles.optionsMenu}>
      <TouchableOpacity
        style={[styles.optionButton, styles.optionButtonPrimary]}
        onPress={handleExportPDF}
        disabled={isExporting}
      >
        {isExporting ? (
          <ActivityIndicator color={COLORS.text.inverse} />
        ) : (
          <Text style={styles.optionButtonText}>📄 Eksportuj do PDF</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionButton, styles.optionButtonDanger]}
        onPress={handleDelete}
      >
        <Text style={styles.optionButtonText}>🗑️ Usuń pomiar</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderuje nagłówek z podstawowymi info
   */
  const renderHeader = () => {
    if (!measurement) return null;

    return (
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{measurement.name}</Text>
            <Text style={styles.date}>
              Utworzono: {formatDate(measurement.created_at)}
            </Text>
            {measurement.updated_at !== measurement.created_at && (
              <Text style={styles.dateUpdated}>
                Edytowano: {formatDate(measurement.updated_at)}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.typeIndicator,
              { backgroundColor: getOpeningTypeColor() },
            ]}
          >
            <Text style={styles.typeIcon}>
              {measurement.opening_type === 'tilt'
                ? '↕️'
                : measurement.opening_type === 'swing'
                ? '↔️'
                : '⬜'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Renderuje wymiary
   */
  const renderDimensions = () => {
    if (!measurement) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📐 Wymiary</Text>
        <View style={styles.dimensionsGrid}>
          <View style={styles.dimensionCard}>
            <Text style={styles.dimensionLabel}>Wysokość</Text>
            <Text style={styles.dimensionValue}>
              {mmToCm(measurement.height)} <Text style={styles.unit}>cm</Text>
            </Text>
            <Text style={styles.dimensionMm}>{measurement.height} mm</Text>
          </View>
          <View style={styles.dimensionCard}>
            <Text style={styles.dimensionLabel}>Szerokość</Text>
            <Text style={styles.dimensionValue}>
              {mmToCm(measurement.width)} <Text style={styles.unit}>cm</Text>
            </Text>
            <Text style={styles.dimensionMm}>{measurement.width} mm</Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Renderuje parametry
   */
  const renderParameters = () => {
    if (!measurement) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Parametry</Text>
        <View style={styles.parametersGrid}>
          {/* Typ otwierania */}
          <View style={styles.parameterCard}>
            <View
              style={[
                styles.parameterIcon,
                { backgroundColor: getOpeningTypeColor() },
              ]}
            >
              <Text style={styles.parameterIconText}>
                {measurement.opening_type === 'tilt'
                  ? '↕️'
                  : measurement.opening_type === 'swing'
                  ? '↔️'
                  : '⬜'}
              </Text>
            </View>
            <Text style={styles.parameterLabel}>Otwieranie</Text>
            <Text style={styles.parameterValue}>
              {LABELS.openingType[measurement.opening_type]}
            </Text>
          </View>

          {/* Pozycja klamki */}
          <View style={styles.parameterCard}>
            <View
              style={[
                styles.parameterIcon,
                { backgroundColor: getHandleColor() },
              ]}
            >
              <Text style={styles.parameterIconText}>
                {measurement.handle_position === 'left' ? '👈' : '👉'}
              </Text>
            </View>
            <Text style={styles.parameterLabel}>Klamka</Text>
            <Text style={styles.parameterValue}>
              {LABELS.handlePosition[measurement.handle_position]}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Renderuje notatki
   */
  const renderNotes = () => {
    if (!measurement || !measurement.notes) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Notatki</Text>
        <View style={styles.notesCard}>
          <Text style={styles.notesText}>{measurement.notes}</Text>
        </View>
      </View>
    );
  };

  /**
   * Renderuje zdjęcia
   */
  const renderPhotos = () => {
    if (!measurement || measurement.photos.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          📷 Zdjęcia ({measurement.photos.length})
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photosContainer}
        >
          {measurement.photos.map((photo, index) => (
            <TouchableOpacity
              key={photo.id}
              style={styles.photoWrapper}
              onPress={() => setSelectedPhotoIndex(index)}
            >
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <View style={styles.photoNumber}>
                <Text style={styles.photoNumberText}>{index + 1}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  /**
   * Renderuje modal pełnego zdjęcia
   */
  const renderPhotoModal = () => {
    if (selectedPhotoIndex === null || !measurement) return null;

    const photo = measurement.photos[selectedPhotoIndex];

    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPhotoIndex(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setSelectedPhotoIndex(null)}
          >
            <Text style={styles.modalCloseIcon}>✕</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: photo.uri }}
            style={styles.modalPhoto}
            resizeMode="contain"
          />

          <View style={styles.modalInfo}>
            <Text style={styles.modalInfoText}>
              Zdjęcie {selectedPhotoIndex + 1} / {measurement.photos.length}
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  /**
   * Ekran ładowania
   */
  if (isLoading) {
    return (
      <SafeScreen backgroundColor={COLORS.background}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Ładowanie pomiaru...</Text>
        </View>
      </SafeScreen>
    );
  }

  /**
   * Główny widok
   */
  return (
    <SafeScreen backgroundColor={COLORS.background}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderDimensions()}
        {renderParameters()}
        {renderNotes()}
        {renderPhotos()}
        {renderOptionsMenu()}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {renderPhotoModal()}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
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

  // Header
  header: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.card.borderRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  name: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  dateUpdated: {
    ...TYPOGRAPHY.small,
    color: COLORS.text.light,
    marginTop: SPACING.xs / 2,
  },
  typeIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 24,
  },

  // Section
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },

  // Wymiary
  dimensionsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  dimensionCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  dimensionLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  dimensionValue: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  unit: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  dimensionMm: {
    ...TYPOGRAPHY.small,
    color: COLORS.text.light,
  },

  // Parametry
  parametersGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  parameterCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  parameterIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  parameterIconText: {
    fontSize: 28,
  },
  parameterLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  parameterValue: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.text.primary,
  },

  // Notatki
  notesCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  notesText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    lineHeight: 24,
  },

  // Zdjęcia
  photosContainer: {
    paddingVertical: SPACING.sm,
  },
  photoWrapper: {
    marginRight: SPACING.md,
    position: 'relative',
  },
  photo: {
    width: SIZES.photo.preview,
    height: SIZES.photo.preview,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundDark,
  },
  photoNumber: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoNumberText: {
    color: COLORS.text.inverse,
    fontSize: 12,
    fontWeight: '600',
  },

  // Modal zdjęcia
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalCloseIcon: {
    color: COLORS.text.inverse,
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalPhoto: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  modalInfo: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: COLORS.overlay,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  modalInfoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.inverse,
  },

  // Menu opcji
  optionsMenu: {
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  optionButton: {
    height: SIZES.button.height,
    borderRadius: SIZES.button.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  optionButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  optionButtonDanger: {
    backgroundColor: COLORS.danger,
  },
  optionButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.inverse,
  },

  // Spacer
  bottomSpacer: {
    height: 40,
  },
});
