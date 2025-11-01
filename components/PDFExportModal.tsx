/**
 * PDF EXPORT MODAL
 * Modal z podglądem PDF i opcjami eksportu
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { MeasurementWithPhotos } from '../database/models';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, SIZES } from '../constants/theme';
import {
  generatePDFHTML,
  exportMeasurementToPDF,
  shareOrSavePDF,
  sendPDFByEmail,
  generatePDFFilename,
} from '../utils/pdfExport';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PDFExportModalProps {
  visible: boolean;
  measurement: MeasurementWithPhotos | null;
  onClose: () => void;
}

export const PDFExportModal: React.FC<PDFExportModalProps> = ({
  visible,
  measurement,
  onClose,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!measurement) return null;

  // Generuj HTML dla podglądu
  const previewHTML = generatePDFHTML([measurement], `Pomiar: ${measurement.name}`);

  /**
   * Zapisuje i udostępnia PDF
   */
  const handleSaveAndShare = async () => {
    try {
      setIsGenerating(true);

      // Generuj PDF
      const pdfUri = await exportMeasurementToPDF(measurement);
      const filename = generatePDFFilename(measurement);

      // Udostępnij przez Share Sheet
      await shareOrSavePDF(pdfUri, filename);

      onClose();
    } catch (error) {
      console.error('❌ Błąd podczas zapisywania PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Wysyła PDF mailem
   */
  const handleSendByEmail = async () => {
    try {
      setIsSending(true);

      // Generuj PDF
      const pdfUri = await exportMeasurementToPDF(measurement);
      const filename = generatePDFFilename(measurement);

      // Wyślij mailem
      await sendPDFByEmail(pdfUri, filename, measurement.name);

      onClose();
    } catch (error) {
      console.error('❌ Błąd podczas wysyłania emaila:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Podgląd PDF</Text>
            <Text style={styles.headerSubtitle}>{measurement.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={isGenerating || isSending}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Preview */}
        <View style={styles.previewContainer}>
          <ScrollView style={styles.scrollView}>
            <WebView
              originWhitelist={['*']}
              source={{ html: previewHTML }}
              style={styles.webview}
              scalesPageToFit={true}
              scrollEnabled={false}
            />
          </ScrollView>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.actionButtonPrimary,
              (isGenerating || isSending) && styles.actionButtonDisabled,
            ]}
            onPress={handleSaveAndShare}
            disabled={isGenerating || isSending}
          >
            {isGenerating ? (
              <ActivityIndicator color={COLORS.text.inverse} />
            ) : (
              <>
                <Text style={styles.actionButtonIcon}>💾</Text>
                <Text style={styles.actionButtonText}>Zapisz i udostępnij</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.actionButtonSecondary,
              (isGenerating || isSending) && styles.actionButtonDisabled,
            ]}
            onPress={handleSendByEmail}
            disabled={isGenerating || isSending}
          >
            {isSending ? (
              <ActivityIndicator color={COLORS.text.inverse} />
            ) : (
              <>
                <Text style={styles.actionButtonIcon}>✉️</Text>
                <Text style={styles.actionButtonText}>Wyślij mailem</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonCancel]}
            onPress={onClose}
            disabled={isGenerating || isSending}
          >
            <Text style={styles.actionButtonTextCancel}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.small,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs / 2,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.text.secondary,
    fontWeight: 'bold',
  },

  // Preview
  previewContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    padding: SPACING.md,
  },
  scrollView: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
    minHeight: SCREEN_HEIGHT - 300,
  },

  // Actions
  actions: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  actionButton: {
    height: SIZES.button.height,
    borderRadius: SIZES.button.borderRadius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  actionButtonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonIcon: {
    fontSize: 20,
  },
  actionButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.inverse,
  },
  actionButtonTextCancel: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.primary,
  },
});
