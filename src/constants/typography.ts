// tipografia do shopgo — identidade "rota"
import {
  Archivo_400Regular,
  Archivo_600SemiBold,
  Archivo_700Bold,
} from '@expo-google-fonts/archivo';
import type { TextStyle } from 'react-native';

export const fontFamily = {
  brandRegular: 'Archivo_400Regular',
  brandMedium: 'Archivo_600SemiBold',
  brandSemibold: 'Archivo_600SemiBold',
  brandBold: 'Archivo_700Bold',
  brandHeavy: 'Archivo_700Bold',
} as const;

// mapa passado para `usefonts` no layout raiz
export const appFonts = {
  Archivo_400Regular,
  Archivo_600SemiBold,
  Archivo_700Bold,
};

// escala tipográfica da marca
export const textVariants = {
  display: { fontFamily: fontFamily.brandHeavy, fontSize: 32, lineHeight: 36, letterSpacing: -0.8 },
  title: { fontFamily: fontFamily.brandHeavy, fontSize: 24, lineHeight: 28, letterSpacing: -0.5 },
  heading: { fontFamily: fontFamily.brandBold, fontSize: 20, lineHeight: 26, letterSpacing: -0.3 },
  subheading: {
    fontFamily: fontFamily.brandSemibold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  body: { fontFamily: fontFamily.brandRegular, fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  bodyStrong: {
    fontFamily: fontFamily.brandSemibold,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  },
  caption: { fontFamily: fontFamily.brandMedium, fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  label: { fontFamily: fontFamily.brandSemibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
  button: { fontFamily: fontFamily.brandBold, fontSize: 16, lineHeight: 20, letterSpacing: 0 },
  price: {
    fontFamily: fontFamily.brandHeavy,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
    fontVariant: ['tabular-nums'],
  },
  priceLarge: {
    fontFamily: fontFamily.brandHeavy,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.6,
    fontVariant: ['tabular-nums'],
  },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
