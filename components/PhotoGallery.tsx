/**
 * PHOTO GALLERY COMPONENT
 * Komponent do zarządzania zdjęciami (max 8) z obsługą aparatu
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS, VALIDATION } from '../constants/theme';
import { compressImage, formatFileSize } from '../utils/imageCompression';

export interface PhotoItem {
  uri: string;
  index: number;
}

interface PhotoGalleryProps {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
  maxPhotos?: number;
}

/**
 * PhotoGallery - komponent galerii zdjęć z aparatem
 * 
 * @param photos - Tablica zdjęć
 * @param onPhotosChange - Callback zmiany zdjęć
 * @param maxPhotos - Maksymalna liczba zdjęć (domyślnie 8)
 */
export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = VALIDATION.photos.maxCount,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');

  /**
   * Sprawdza i żąda uprawnień do aparatu
   */
  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Brak uprawnień',
        'Aplikacja potrzebuje dostępu do aparatu, aby robić zdjęcia.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  };

  /**
   * Sprawdza i żąda uprawnień do galerii
   */
  const requestMediaLibraryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Brak uprawnień',
        'Aplikacja potrzebuje dostępu do galerii, aby wybrać zdjęcia.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  };

  /**
   * Otwiera aparat i robi zdjęcie
   */
  const takePhoto = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert(
        'Limit zdjęć',
        `Możesz dodać maksymalnie ${maxPhotos} zdjęć.`,
        [{ text: 'OK' }]
      );
      return;
    }

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      console.log('📷 Uruchamiam aparat...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      console.log('📷 Wynik z aparatu:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('📷 Zdjęcie zrobione, URI:', result.assets[0].uri);
        await processImage(result.assets[0].uri);
      } else {
        console.log('📷 Użytkownik anulował robienie zdjęcia');
      }
    } catch (error) {
      console.error('❌ Błąd podczas robienia zdjęcia:', error);
      Alert.alert('Błąd', `Nie udało się zrobić zdjęcia: ${error}`);
    }
  };

  /**
   * Wybiera zdjęcie z galerii
   */
  const pickFromGallery = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert(
        'Limit zdjęć',
        `Możesz dodać maksymalnie ${maxPhotos} zdjęć.`,
        [{ text: 'OK' }]
      );
      return;
    }

    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    try {
      console.log('🖼️ Otwieranie galerii...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      console.log('🖼️ Wynik z galerii:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('🖼️ Zdjęcie wybrane, URI:', result.assets[0].uri);
        await processImage(result.assets[0].uri);
      } else {
        console.log('🖼️ Użytkownik anulował wybór zdjęcia');
      }
    } catch (error) {
      console.error('❌ Błąd podczas wybierania zdjęcia:', error);
      Alert.alert('Błąd', `Nie udało się wybrać zdjęcia: ${error}`);
    }
  };

  /**
   * Pokazuje opcje dodawania zdjęcia (aparat lub galeria)
   */
  const showAddPhotoOptions = () => {
    Alert.alert(
      'Dodaj zdjęcie',
      'Wybierz źródło zdjęcia',
      [
        {
          text: 'Aparat',
          onPress: takePhoto,
        },
        {
          text: 'Galeria',
          onPress: pickFromGallery,
        },
        {
          text: 'Anuluj',
          style: 'cancel',
        },
      ]
    );
  };

  /**
   * Przetwarza i kompresuje zdjęcie
   */
  const processImage = async (uri: string) => {
    try {
      setIsProcessing(true);
      setProcessingText('Przetwarzanie zdjęcia...');

      // Kompresuj zdjęcie
      const compressed = await compressImage(uri);
      
      console.log(`📸 Dodano zdjęcie: ${formatFileSize(compressed.size)}`);

      // Dodaj do galerii
      const newPhoto: PhotoItem = {
        uri: compressed.uri,
        index: photos.length,
      };

      onPhotosChange([...photos, newPhoto]);
    } catch (error) {
      console.error('❌ Błąd podczas przetwarzania zdjęcia:', error);
      Alert.alert('Błąd', 'Nie udało się przetworzyć zdjęcia');
    } finally {
      setIsProcessing(false);
      setProcessingText('');
    }
  };

  /**
   * Usuwa zdjęcie z galerii
   */
  const removePhoto = (index: number) => {
    Alert.alert(
      'Usuń zdjęcie',
      'Czy na pewno chcesz usunąć to zdjęcie?',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => {
            const updatedPhotos = photos
              .filter((_, i) => i !== index)
              .map((photo, i) => ({ ...photo, index: i }));
            onPhotosChange(updatedPhotos);
          },
        },
      ]
    );
  };

  /**
   * Renderowanie pojedynczego zdjęcia
   */
  const renderPhoto = (photo: PhotoItem, index: number) => (
    <View key={index} style={styles.photoContainer}>
      <Image source={{ uri: photo.uri }} style={styles.photo} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removePhoto(index)}
      >
        <Text style={styles.removeIcon}>✕</Text>
      </TouchableOpacity>
      <View style={styles.photoIndex}>
        <Text style={styles.photoIndexText}>{index + 1}</Text>
      </View>
    </View>
  );

  /**
   * Renderowanie przycisku dodawania zdjęcia
   */
  const renderAddButton = () => {
    if (photos.length >= maxPhotos) return null;

    return (
      <TouchableOpacity
        style={styles.addButton}
        onPress={showAddPhotoOptions}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <>
            <Text style={styles.addIcon}>📷</Text>
            <Text style={styles.addText}>Dodaj zdjęcie</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zdjęcia</Text>
        <Text style={styles.counter}>
          {photos.length} / {maxPhotos}
        </Text>
      </View>

      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.processingText}>{processingText}</Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gallery}
      >
        {photos.map((photo, index) => renderPhoto(photo, index))}
        {renderAddButton()}
      </ScrollView>

      {photos.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📷</Text>
          <Text style={styles.emptyText}>
            Brak zdjęć. Dodaj zdjęcia okna, aby lepiej udokumentować pomiar.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },

  // Nagłówek
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.label,
  },
  counter: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },

  // Galeria
  gallery: {
    paddingVertical: SPACING.sm,
  },

  // Zdjęcie
  photoContainer: {
    marginRight: SPACING.md,
    position: 'relative',
  },
  photo: {
    width: SIZES.photo.preview,
    height: SIZES.photo.preview,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundDark,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  removeIcon: {
    color: COLORS.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoIndex: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIndexText: {
    color: COLORS.text.inverse,
    fontSize: 12,
    fontWeight: '600',
  },

  // Przycisk dodawania
  addButton: {
    width: SIZES.photo.preview,
    height: SIZES.photo.preview,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  addIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  addText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Przetwarzanie
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  processingText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
  },

  // Pusty stan
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginTop: SPACING.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
