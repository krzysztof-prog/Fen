/**
 * MEASUREMENT FORM COMPONENT
 * Formularz do wprowadzania danych pomiaru okna
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, LABELS } from '../constants/theme';
import { validateName, validateHeight, validateWidth, validateNotes } from '../utils/validation';

export interface MeasurementFormData {
  name: string;
  width: string;
  height: string;
  handlePosition: 'left' | 'right';
  openingType: 'tilt' | 'swing' | 'fixed';
  notes: string;
}

interface MeasurementFormProps {
  data: MeasurementFormData;
  onChange: (data: MeasurementFormData) => void;
  errors?: { [key: string]: string };
}

/**
 * MeasurementForm - formularz danych pomiaru
 * 
 * @param data - Dane formularza
 * @param onChange - Callback zmiany danych
 * @param errors - Błędy walidacji
 */
export const MeasurementForm: React.FC<MeasurementFormProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  /**
   * Aktualizuje pole formularza
   */
  const updateField = (field: keyof MeasurementFormData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  /**
   * Renderuje pole tekstowe
   */
  const renderTextInput = (
    field: keyof MeasurementFormData,
    label: string,
    placeholder: string,
    options?: {
      keyboardType?: 'default' | 'numeric';
      multiline?: boolean;
      maxLength?: number;
      suffix?: string;
    }
  ) => {
    const hasError = !!errors[field];
    const isFocused = focusedField === field;

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.inputWrapper,
            hasError && styles.inputWrapperError,
            isFocused && styles.inputWrapperFocused,
          ]}
        >
          <TextInput
            style={[
              styles.input,
              options?.multiline && styles.inputMultiline,
            ]}
            value={data[field]}
            onChangeText={(value) => updateField(field, value)}
            placeholder={placeholder}
            placeholderTextColor={COLORS.text.light}
            keyboardType={options?.keyboardType || 'default'}
            multiline={options?.multiline}
            maxLength={options?.maxLength}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField(null)}
          />
          {options?.suffix && (
            <Text style={styles.inputSuffix}>{options.suffix}</Text>
          )}
        </View>
        {hasError && <Text style={styles.errorText}>{errors[field]}</Text>}
      </View>
    );
  };

  /**
   * Renderuje przyciski pozycji klamki
   */
  const renderHandlePosition = () => {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pozycja klamki</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              data.handlePosition === 'left' && [
                styles.optionButtonActive,
                { backgroundColor: COLORS.handle.left },
              ],
            ]}
            onPress={() => updateField('handlePosition', 'left')}
          >
            <Text
              style={[
                styles.optionButtonText,
                data.handlePosition === 'left' && styles.optionButtonTextActive,
              ]}
            >
              👈 {LABELS.handlePosition.left}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              data.handlePosition === 'right' && [
                styles.optionButtonActive,
                { backgroundColor: COLORS.handle.right },
              ],
            ]}
            onPress={() => updateField('handlePosition', 'right')}
          >
            <Text
              style={[
                styles.optionButtonText,
                data.handlePosition === 'right' && styles.optionButtonTextActive,
              ]}
            >
              {LABELS.handlePosition.right} 👉
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * Renderuje przyciski typu otwierania
   */
  const renderOpeningType = () => {
    const options: Array<{
      value: 'tilt' | 'swing' | 'fixed';
      label: string;
      icon: string;
      color: string;
    }> = [
      {
        value: 'tilt',
        label: LABELS.openingType.tilt,
        icon: '↕️',
        color: COLORS.window.tilt,
      },
      {
        value: 'swing',
        label: LABELS.openingType.swing,
        icon: '↔️',
        color: COLORS.window.swing,
      },
      {
        value: 'fixed',
        label: LABELS.openingType.fixed,
        icon: '⬜',
        color: COLORS.window.fixed,
      },
    ];

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sposób otwierania</Text>
        <View style={styles.buttonGroup}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                styles.optionButtonSmall,
                data.openingType === option.value && [
                  styles.optionButtonActive,
                  { backgroundColor: option.color },
                ],
              ]}
              onPress={() => updateField('openingType', option.value)}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text
                style={[
                  styles.optionButtonText,
                  styles.optionButtonTextSmall,
                  data.openingType === option.value && styles.optionButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Nazwa pomiaru */}
      {renderTextInput('name', 'Nazwa pomiaru *', 'np. Salon - okno lewe', {
        maxLength: 100,
      })}

      {/* Wymiary */}
      <View style={styles.dimensionsRow}>
        <View style={styles.dimensionColumn}>
          {renderTextInput('height', 'Wysokość *', '0', {
            keyboardType: 'numeric',
            suffix: 'mm',
          })}
        </View>
        <View style={styles.dimensionColumn}>
          {renderTextInput('width', 'Szerokość *', '0', {
            keyboardType: 'numeric',
            suffix: 'mm',
          })}
        </View>
      </View>

      {/* Pozycja klamki */}
      {renderHandlePosition()}

      {/* Typ otwierania */}
      {renderOpeningType()}

      {/* Notatki */}
      {renderTextInput('notes', 'Notatki (opcjonalnie)', 'Dodatkowe uwagi...', {
        multiline: true,
        maxLength: 500,
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },

  // Grupa input
  inputGroup: {
    gap: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.label,
  },

  // Input wrapper
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SIZES.input.height,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.input.borderRadius,
    borderWidth: SIZES.input.borderWidth,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  inputWrapperError: {
    borderColor: COLORS.danger,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.sm,
  },
  inputSuffix: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
  },

  // Wymiary w rzędzie
  dimensionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  dimensionColumn: {
    flex: 1,
  },

  // Grupa przycisków
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.md,
  },

  // Przycisk opcji
  optionButton: {
    flex: 1,
    height: SIZES.button.height,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.button.borderRadius,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  optionButtonSmall: {
    flexDirection: 'column',
    paddingVertical: SPACING.sm,
  },
  optionButtonActive: {
    borderColor: 'transparent',
  },
  optionIcon: {
    fontSize: 24,
  },
  optionButtonText: {
    ...TYPOGRAPHY.button,
    fontSize: 15,
    color: COLORS.text.primary,
  },
  optionButtonTextSmall: {
    fontSize: 13,
  },
  optionButtonTextActive: {
    color: COLORS.text.inverse,
  },

  // Błędy
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.danger,
  },
});
