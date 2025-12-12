import { StyleSheet, Platform } from 'react-native';

export const COLORS = {
  background: '#09090b', // True OLED Black
  surface: '#18181b',    // Zinc 900
  primary: '#D4FF00',    // Neon Lime
  secondary: '#C4A9FF',  // Soft Lilac
  accent: '#FF2E7E',     // Deep Pink
  white: '#FFFFFF',
  black: '#000000',
  gray: '#A1A1AA',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 15,
    marginTop: 25,
  },
  card: {
    borderRadius: 32,
    padding: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  }
});