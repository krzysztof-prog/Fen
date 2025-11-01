/**
 * NEW MEASUREMENT SCREEN
 * Ekran dodawania nowego pomiaru okna
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../components/SafeScreen';
import { MeasurementForm, MeasurementFormData } from '../../components/MeasurementForm';
import { PhotoGallery, PhotoItem } from '../../components/PhotoGallery';
import { createMeasurement, addPhotos } from '../../database/queries';
import { validateMeasurementForm, hasErrors } from '../../utils/validation';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS } from '../../constants/theme';

export default function NewMeasurementScreen() {
  const router = useRouter();
  
  // Stan formularza
  const [formData, setFormData] = useState<MeasurementFormData>({
    name: '',
    width: '',
    height: '',
    handlePosition: 'right',
    openingType: 'tilt',
    notes: '',
  });

  // Stan zdjęć
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  // Stan zapisywania
  const [isSaving, setIsSaving] = useState(false);

  // Błędy walidacji
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  /**
   * Waliduje formularz przed zapisem
   */
  const validateForm = (): boolean => {
    const errors = validateMeasurementForm({
      name: formData.name,
      height: formData.height,
      width: formData.width,
      notes: formData.notes,
      photoCount: photos.length,
    });

    setValidationErrors(errors);

    if (hasErrors(errors)) {
      // Pokaż pierwszy błąd
      const firstError = Object.values(errors)[0];
      Alert.alert('Błąd walidacji', firstError);
      return false;
    }

    return true;
  };

  /**
   * Zapisuje pomiar do bazy danych
   */
  const handleSave = async () => {
    // Waliduj formularz
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      // Konwertuj dane
      const width = parseInt(formData.width, 10);
      const height = parseInt(formData.height, 10);

      // Utwórz pomiar
      const now = new Date().toISOString();
      const measurementId = await createMeasurement({
        name: formData.name.trim(),
        width,
        height,
        handle_position: formData.handlePosition,
        opening_type: formData.openingType,
        notes: formData.notes.trim() || undefined,
        created_at: now,
        updated_at: now,
      });

      console.log(`✅ Utworzono pomiar ID: ${measurementId}`);

      // Dodaj zdjęcia jeśli są
      if (photos.length > 0) {
        const photosData = photos.map((photo) => ({
          measurement_id: measurementId,
          uri: photo.uri,
          order_index: photo.index,
          created_at: now,
        }));

        await addPhotos(photosData);
        console.log(`✅ Dodano ${photos.length} zdjęć`);
      }

      // Pokaż sukces
      Alert.alert(
        'Sukces',
        'Pomiar został zapisany',
        [
          {
            text: 'OK',
            onPress: () => {
              // Wróć do listy
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Błąd podczas zapisywania:', error);
      Alert.alert(
        'Błąd',
        'Nie udało się zapisać pomiaru. Spróbuj ponownie.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Anuluje dodawanie i wraca do listy
   */
  const handleCancel = () => {
    if (
      formData.name.trim() !== '' ||
      formData.width !== '' ||
      formData.height !== '' ||
      formData.notes.trim() !== '' ||
      photos.length > 0
    ) {
      Alert.alert(
        'Anulować?',
        'Czy na pewno chcesz anulować? Wszystkie wprowadzone dane zostaną utracone.',
        [
          {
            text: 'Kontynuuj edycję',
            style: 'cancel',
          },
          {
            text: 'Anuluj',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  /**
   * Czyści błędy walidacji po zmianie danych
   */
  const handleFormChange = (data: MeasurementFormData) => {
    setFormData(data);
    // Wyczyść błędy walidacji
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  };

  return (
    <SafeScreen backgroundColor={COLORS.background}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Instrukcje */}
          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              📏 Wypełnij poniższy formularz, aby zapisać pomiar okna.
              Pola oznaczone * są wymagane.
            </Text>
          </View>

          {/* Formularz */}
          <View style={styles.formContainer}>
            <MeasurementForm
              data={formData}
              onChange={handleFormChange}
              errors={validationErrors}
            />
          </View>

          {/* Galeria zdjęć */}
          <View style={styles.photoSection}>
            <PhotoGallery photos={photos} onPhotosChange={setPhotos} />
          </View>

          {/* Spacer na dole */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Przyciski akcji */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleCancel}
            disabled={isSaving}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Anuluj
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={COLORS.text.inverse} />
            ) : (
              <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
                💾 Zapisz pomiar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },

  // Instrukcje
  instructions: {
    backgroundColor: COLORS.info + '15',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  instructionsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary,
    lineHeight: 20,
  },

  // Formularz
  formContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.card.borderRadius,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },

  // Sekcja zdjęć
  photoSection: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.card.borderRadius,
    padding: SPACING.md,
    ...SHADOWS.small,
  },

  // Spacer
  bottomSpacer: {
    height: 100,
  },

  // Przyciski akcji
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.medium,
  },
  button: {
    flex: 1,
    height: SIZES.button.height,
    borderRadius: SIZES.button.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  buttonSecondary: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonText: {
    ...TYPOGRAPHY.button,
  },
  buttonTextPrimary: {
    color: COLORS.text.inverse,
  },
  buttonTextSecondary: {
    color: COLORS.text.primary,
  },
});
