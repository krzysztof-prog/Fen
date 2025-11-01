/**
 * PDF EXPORT
 * Generowanie PDF z pomiarami okien
 */

import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { Alert, Platform } from 'react-native';
import { MeasurementWithPhotos } from '../database/models';
import { LABELS } from '../constants/theme';

/**
 * Generuje HTML dla pojedynczego pomiaru
 */
const generateMeasurementHTML = (measurement: MeasurementWithPhotos): string => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const mmToCm = (mm: number): string => {
    return (mm / 10).toFixed(1);
  };

  // Konwertuj zdjęcia na base64 (jeśli są)
  const photosHTML = measurement.photos
    .map(
      (photo, index) => `
        <div class="photo">
          <img src="${photo.uri}" alt="Zdjęcie ${index + 1}" />
          <p class="photo-caption">Zdjęcie ${index + 1}</p>
        </div>
      `
    )
    .join('');

  return `
    <div class="measurement">
      <div class="header">
        <h2>${measurement.name}</h2>
        <p class="date">Utworzono: ${formatDate(measurement.created_at)}</p>
      </div>

      <div class="dimensions-section">
        <h3>📐 Wymiary</h3>
        <div class="dimensions">
          <div class="dimension-box">
            <p class="dimension-label">Wysokość</p>
            <p class="dimension-value">${mmToCm(measurement.height)} cm</p>
            <p class="dimension-mm">(${measurement.height} mm)</p>
          </div>
          <div class="dimension-box">
            <p class="dimension-label">Szerokość</p>
            <p class="dimension-value">${mmToCm(measurement.width)} cm</p>
            <p class="dimension-mm">(${measurement.width} mm)</p>
          </div>
        </div>
      </div>

      <div class="parameters-section">
        <h3>⚙️ Parametry</h3>
        <table class="parameters-table">
          <tr>
            <td class="param-label">Sposób otwierania:</td>
            <td class="param-value">${LABELS.openingType[measurement.opening_type]}</td>
          </tr>
          <tr>
            <td class="param-label">Pozycja klamki:</td>
            <td class="param-value">${LABELS.handlePosition[measurement.handle_position]}</td>
          </tr>
        </table>
      </div>

      ${
        measurement.notes
          ? `
        <div class="notes-section">
          <h3>📝 Notatki</h3>
          <p class="notes">${measurement.notes}</p>
        </div>
      `
          : ''
      }

      ${
        measurement.photos.length > 0
          ? `
        <div class="photos-section">
          <h3>📷 Zdjęcia (${measurement.photos.length})</h3>
          <div class="photos-grid">
            ${photosHTML}
          </div>
        </div>
      `
          : ''
      }
    </div>
  `;
};

/**
 * Generuje kompletny dokument HTML dla PDF
 */
const generatePDFHTML = (
  measurements: MeasurementWithPhotos[],
  title: string = 'Pomiary Okien'
): string => {
  const measurementsHTML = measurements.map(generateMeasurementHTML).join('<div class="page-break"></div>');

  return `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0f172a;
          background: white;
          padding: 20px;
        }

        .document-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #3b82f6;
        }

        .document-header h1 {
          font-size: 32px;
          color: #3b82f6;
          margin-bottom: 10px;
        }

        .document-header p {
          font-size: 14px;
          color: #64748b;
        }

        .measurement {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }

        .page-break {
          page-break-after: always;
        }

        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .header h2 {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .date {
          font-size: 14px;
          opacity: 0.9;
        }

        .dimensions-section,
        .parameters-section,
        .notes-section,
        .photos-section {
          margin-bottom: 20px;
        }

        h3 {
          font-size: 18px;
          color: #0f172a;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }

        .dimensions {
          display: flex;
          gap: 20px;
          margin-top: 12px;
        }

        .dimension-box {
          flex: 1;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .dimension-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dimension-value {
          font-size: 36px;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 4px;
        }

        .dimension-mm {
          font-size: 12px;
          color: #94a3b8;
        }

        .parameters-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }

        .parameters-table tr {
          border-bottom: 1px solid #e2e8f0;
        }

        .parameters-table td {
          padding: 12px 0;
        }

        .param-label {
          font-weight: 600;
          color: #64748b;
          width: 40%;
        }

        .param-value {
          color: #0f172a;
          font-weight: 500;
        }

        .notes {
          background: #f8fafc;
          border-left: 4px solid #3b82f6;
          padding: 16px;
          border-radius: 8px;
          margin-top: 12px;
          line-height: 1.6;
        }

        .photos-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 12px;
        }

        .photo {
          text-align: center;
        }

        .photo img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
        }

        .photo-caption {
          margin-top: 8px;
          font-size: 12px;
          color: #64748b;
        }

        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
          color: #94a3b8;
          font-size: 12px;
        }

        @media print {
          body {
            padding: 0;
          }
          
          .page-break {
            page-break-after: always;
          }
        }
      </style>
    </head>
    <body>
      <div class="document-header">
        <h1>📏 ${title}</h1>
        <p>Wygenerowano: ${new Date().toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}</p>
      </div>

      ${measurementsHTML}

      <div class="footer">
        <p>Dokument wygenerowany automatycznie przez aplikację Pomiary Okien</p>
        <p>Liczba pomiarów: ${measurements.length}</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Eksportuje pojedynczy pomiar do PDF
 * @param measurement Pomiar do wyeksportowania
 * @returns URI utworzonego pliku PDF
 */
export const exportMeasurementToPDF = async (
  measurement: MeasurementWithPhotos
): Promise<string> => {
  try {
    console.log('📄 Generuję PDF dla pomiaru:', measurement.name);

    const html = generatePDFHTML([measurement], `Pomiar: ${measurement.name}`);

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    console.log('✅ PDF wygenerowany:', uri);
    return uri;
  } catch (error) {
    console.error('❌ Błąd podczas generowania PDF:', error);
    throw new Error('Nie udało się wygenerować PDF');
  }
};

/**
 * Eksportuje wiele pomiarów do jednego PDF
 * @param measurements Pomiary do wyeksportowania
 * @param title Tytuł dokumentu
 * @returns URI utworzonego pliku PDF
 */
export const exportMeasurementsToPDF = async (
  measurements: MeasurementWithPhotos[],
  title: string = 'Pomiary Okien'
): Promise<string> => {
  try {
    console.log(`📄 Generuję PDF dla ${measurements.length} pomiarów`);

    const html = generatePDFHTML(measurements, title);

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    console.log('✅ PDF wygenerowany:', uri);
    return uri;
  } catch (error) {
    console.error('❌ Błąd podczas generowania PDF:', error);
    throw new Error('Nie udało się wygenerować PDF');
  }
};

/**
 * Udostępnia plik PDF (share sheet)
 * @param pdfUri URI pliku PDF
 * @param filename Nazwa pliku (opcjonalna)
 */
export const sharePDF = async (
  pdfUri: string,
  filename: string = 'pomiary-okien.pdf'
): Promise<void> => {
  try {
    // Skopiuj plik do katalogu dokumentów z odpowiednią nazwą
    const newUri = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.copyAsync({
      from: pdfUri,
      to: newUri,
    });

    // Pokaż użytkownikowi gdzie zapisano plik
    if (Platform.OS === 'android') {
      Alert.alert(
        'PDF zapisany',
        `Plik został zapisany:\n${newUri}\n\nMożesz go znaleźć w menedżerze plików.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'PDF zapisany',
        `Plik został zapisany w katalogu aplikacji.`,
        [{ text: 'OK' }]
      );
    }

    console.log('✅ PDF zapisany:', newUri);
  } catch (error) {
    console.error('❌ Błąd podczas zapisywania PDF:', error);
    throw new Error('Nie udało się zapisać PDF');
  }
};

/**
 * Zapisuje PDF do plików użytkownika
 * @param pdfUri URI pliku PDF
 * @param filename Nazwa pliku
 * @returns Ścieżka do zapisanego pliku
 */
export const savePDFToFiles = async (
  pdfUri: string,
  filename: string
): Promise<string> => {
  try {
    // Ścieżka do katalogu dokumentów
    const documentsDir = `${FileSystem.documentDirectory}pomiary/`;

    // Utwórz katalog jeśli nie istnieje
    const dirInfo = await FileSystem.getInfoAsync(documentsDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(documentsDir, { intermediates: true });
    }

    // Skopiuj plik
    const newUri = `${documentsDir}${filename}`;
    await FileSystem.copyAsync({
      from: pdfUri,
      to: newUri,
    });

    console.log('✅ PDF zapisany:', newUri);
    return newUri;
  } catch (error) {
    console.error('❌ Błąd podczas zapisywania PDF:', error);
    throw new Error('Nie udało się zapisać PDF');
  }
};

/**
 * Generuje nazwę pliku dla PDF na podstawie pomiaru
 * @param measurement Pomiar
 * @returns Nazwa pliku
 */
export const generatePDFFilename = (measurement: MeasurementWithPhotos): string => {
  // Usuń niebezpieczne znaki z nazwy
  const safeName = measurement.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const date = new Date(measurement.created_at).toISOString().split('T')[0];
  return `pomiar-${safeName}-${date}.pdf`;
};

/**
 * Generuje nazwę pliku dla wielu pomiarów
 * @param count Liczba pomiarów
 * @returns Nazwa pliku
 */
export const generateMultiplePDFFilename = (count: number): string => {
  const date = new Date().toISOString().split('T')[0];
  return `pomiary-okien-${count}-${date}.pdf`;
};
