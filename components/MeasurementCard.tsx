/**
 * MEASUREMENT CARD COMPONENT
 * Karta pojedynczego pomiaru wyświetlana na liście
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Measurement } from '../database/models';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, SHADOWS, LABELS } from '../constants/theme';

interface MeasurementCardProps {
  measurement: Measurement;
  onPress: () => void;
  onLongPress?: () => void;
}

/**
 * MeasurementCard - karta pomiaru z podstawowymi informacjami
 * 
 * @param measurement - Dane pomiaru do wyświetlenia
 * @param onPress - Callback po kliknięciu (przejście do szczegółów)
 * @param onLongPress - Callback po długim przytrzymaniu (opcje)
 */
export const MeasurementCard: React.FC<MeasurementCardProps> = ({
  measurement,
  onPress,
  onLongPress,
}) => {
  // Formatowanie daty
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  // Konwersja mm na cm dla czytelności
  const widthCm = (measurement.width / 10).toFixed(1);
  const heightCm = (measurement.height / 10).toFixed(1);

  // Kolor typu otwierania
  const getOpeningTypeColor = () => {
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

  // Kolor pozycji klamki
  const getHandleColor = () => {
    return measurement.handle_position === 'left' 
      ? COLORS.handle.left 
      : COLORS.handle.right;
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Nagłówek karty */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name} numberOfLines={1}>
            {measurement.name}
          </Text>
          <Text style={styles.date}>
            {formatDate(measurement.created_at)}
          </Text>
        </View>
        
        {/* Ikona typu okna */}
        <View style={[
          styles.typeIndicator,
          { backgroundColor: getOpeningTypeColor() }
        ]}>
          <Text style={styles.typeIcon}>
            {measurement.opening_type === 'tilt' ? '↕️' : 
             measurement.opening_type === 'swing' ? '↔️' : '⬜'}
          </Text>
        </View>
      </View>

      {/* Wymiary */}
      <View style={styles.dimensions}>
        <View style={styles.dimensionBox}>
          <Text style={styles.dimensionLabel}>Wysokość</Text>
          <Text style={styles.dimensionValue}>
            {heightCm} <Text style={styles.unit}>cm</Text>
          </Text>
          <Text style={styles.dimensionMm}>
            ({measurement.height} mm)
          </Text>
        </View>

        <View style={styles.dimensionDivider} />

        <View style={styles.dimensionBox}>
          <Text style={styles.dimensionLabel}>Szerokość</Text>
          <Text style={styles.dimensionValue}>
            {widthCm} <Text style={styles.unit}>cm</Text>
          </Text>
          <Text style={styles.dimensionMm}>
            ({measurement.width} mm)
          </Text>
        </View>
      </View>

      {/* Parametry */}
      <View style={styles.parameters}>
        {/* Typ otwierania */}
        <View style={styles.parameterItem}>
          <View style={[
            styles.parameterDot,
            { backgroundColor: getOpeningTypeColor() }
          ]} />
          <Text style={styles.parameterText}>
            {LABELS.openingType[measurement.opening_type]}
          </Text>
        </View>

        {/* Pozycja klamki */}
        <View style={styles.parameterItem}>
          <View style={[
            styles.parameterDot,
            { backgroundColor: getHandleColor() }
          ]} />
          <Text style={styles.parameterText}>
            Klamka: {LABELS.handlePosition[measurement.handle_position]}
          </Text>
        </View>
      </View>

      {/* Notatki (jeśli są) */}
      {measurement.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>📝 Notatka:</Text>
          <Text style={styles.notesText} numberOfLines={2}>
            {measurement.notes}
          </Text>
        </View>
      )}

      {/* Strzałka */}
      <View style={styles.arrow}>
        <Text style={styles.arrowIcon}>›</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.card.borderRadius,
    padding: SIZES.card.padding,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  name: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },

  // Wskaźnik typu okna
  typeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 20,
  },

  // Wymiary
  dimensions: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  dimensionBox: {
    flex: 1,
    alignItems: 'center',
  },
  dimensionLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  dimensionValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.xs / 2,
  },
  unit: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
  },
  dimensionMm: {
    ...TYPOGRAPHY.small,
    color: COLORS.text.light,
  },
  dimensionDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },

  // Parametry
  parameters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  parameterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parameterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  parameterText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },

  // Notatki
  notesContainer: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 8,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  notesLabel: {
    ...TYPOGRAPHY.captionBold,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  notesText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary,
    lineHeight: 18,
  },

  // Strzałka
  arrow: {
    position: 'absolute',
    right: SPACING.md,
    top: '50%',
    marginTop: -12,
  },
  arrowIcon: {
    fontSize: 24,
    color: COLORS.text.light,
    fontWeight: '300',
  },
});
