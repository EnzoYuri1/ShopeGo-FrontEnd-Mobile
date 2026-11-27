/**
 * Tipografia do ShopGo — identidade "Rota".
 *
 * Fonte única da marca: Archivo (contraste por peso, não por família).
 * - Use `textVariants` (via componente `AppText`) em vez de fontFamily/fontSize soltos.
 * - Preços usam `price`/`priceLarge`, com números de largura fixa (tabular).
 * Fontes carregadas com expo-font em app/_layout.tsx (veja `appFonts`).
 */
import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
} from '@expo-google-fonts/archivo';
import type { TextStyle } from 'react-native';

export const fontFamily = {
  brandRegular: 'Archivo_400Regular',
  brandMedium: 'Archivo_500Medium',
  brandSemibold: 'Archivo_600SemiBold',
  brandBold: 'Archivo_700Bold',
  brandHeavy: 'Archivo_800ExtraBold',
} as const;

/** Mapa passado para `useFonts` no layout raiz. */
export const appFonts = {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
};

/**
 * Escala tipográfica da marca. Cada variante define família, tamanho, entrelinha
 * e espaçamento. Tamanhos: 12, 13, 15, 16, 17, 20, 24, 28, 32.
 */
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
