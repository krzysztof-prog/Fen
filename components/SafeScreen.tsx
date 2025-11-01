/**
 * SAFE SCREEN COMPONENT
 * Wrapper dla ekranów z automatyczną obsługą Safe Area (notch, status bar, itp.)
 */

import React from 'react';
import { View, StyleSheet, StatusBar, Platform, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

interface SafeScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
}

/**
 * SafeScreen - komponent zapewniający bezpieczne obszary na iOS i Android
 * 
 * @param children - Zawartość ekranu
 * @param backgroundColor - Kolor tła (domyślnie biały)
 * @param statusBarStyle - Styl status bara (domyślnie dark-content)
 * @param edges - Które krawędzie mają być chronione (domyślnie wszystkie)
 * @param style - Dodatkowe style
 */
export const SafeScreen: React.FC<SafeScreenProps> = ({ 
  children, 
  backgroundColor = COLORS.card,
  statusBarStyle = 'dark-content',
  edges = ['top', 'bottom', 'left', 'right'],
  style,
}) => {
  const insets = useSafeAreaInsets();

  // Oblicz padding na podstawie wybranych krawędzi
  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingBottom = edges.includes('bottom') ? insets.bottom : 0;
  const paddingLeft = edges.includes('left') ? insets.left : 0;
  const paddingRight = edges.includes('right') ? insets.right : 0;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar 
        barStyle={statusBarStyle}
        backgroundColor={Platform.OS === 'android' ? backgroundColor : undefined}
        translucent={Platform.OS === 'android'}
      />
      <View 
        style={[
          styles.content, 
          { 
            paddingTop,
            paddingBottom,
            paddingLeft,
            paddingRight,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
