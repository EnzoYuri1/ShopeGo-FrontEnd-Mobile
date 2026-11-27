/**
 * Tipografia do ShopGo — identidade "Rota".
 *
 * Fonte da marca: Archivo (uma família, contraste por peso).
 * - Use `textVariants` (via componente `AppText`) em vez de fontFamily/fontSize soltos.
 * - Preços usam `price`/`priceLarge`, com números de largura fixa (tabular).
 *
 * As famílias antigas (Poppins, Inter, Sansita, Hammersmith One, Graduate, Inria Sans,
 * Irish Grover) continuam carregadas só até as telas migrarem; remover na Etapa 7.
 */
import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
} from '@expo-google-fonts/archivo';
import type { TextStyle } from 'react-native';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Graduate_400Regular } from '@expo-google-fonts/graduate';
import { HammersmithOne_400Regular } from '@expo-google-fonts/hammersmith-one';
import { InriaSans_700Bold } from '@expo-google-fonts/inria-sans';
import { IrishGrover_400Regular } from '@expo-google-fonts/irish-grover';
import { Sansita_800ExtraBold_Italic } from '@expo-google-fonts/sansita';

export const fontFamily = {
  // Marca (Archivo)
  brandRegular: 'Archivo_400Regular',
  brandMedium: 'Archivo_500Medium',
  brandSemibold: 'Archivo_600SemiBold',
  brandBold: 'Archivo_700Bold',
  brandHeavy: 'Archivo_800ExtraBold',
  // Legado
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  interRegular: 'Inter_400Regular',
  interSemibold: 'Inter_600SemiBold',
  interBold: 'Inter_700Bold',
  display: 'Sansita_800ExtraBold_Italic',
  /** Títulos de produto/carrinho (Hammersmith One no Figma). */
  heading: 'HammersmithOne_400Regular',
  /** Preços na tela de produto (Graduate no Figma). */
  price: 'Graduate_400Regular',
  /** Valores do carrinho e ofertas (Inria Sans Bold no Figma). */
  inriaBold: 'InriaSans_700Bold',
  /** Percentual do selo de desconto (Irish Grover no Figma). */
  badge: 'IrishGrover_400Regular',
} as const;

/** Mapa passado para `useFonts` no layout raiz. */
export const appFonts = {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Sansita_800ExtraBold_Italic,
  HammersmithOne_400Regular,
  Graduate_400Regular,
  InriaSans_700Bold,
  IrishGrover_400Regular,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  bold: '700',
} as const;

/**
 * Escala tipográfica da marca. Cada variante define família, tamanho, entrelinha
 * e espaçamento. Tamanhos: 12, 13, 15, 17, 20, 24, 32.
 */
export const textVariants = {
  display: { fontFamily: 'Archivo_800ExtraBold', fontSize: 32, lineHeight: 36, letterSpacing: -0.8 },
  title: { fontFamily: 'Archivo_800ExtraBold', fontSize: 24, lineHeight: 28, letterSpacing: -0.5 },
  heading: { fontFamily: 'Archivo_700Bold', fontSize: 20, lineHeight: 26, letterSpacing: -0.3 },
  subheading: { fontFamily: 'Archivo_600SemiBold', fontSize: 17, lineHeight: 22, letterSpacing: -0.1 },
  body: { fontFamily: 'Archivo_400Regular', fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  bodyStrong: { fontFamily: 'Archivo_600SemiBold', fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  caption: { fontFamily: 'Archivo_500Medium', fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  label: { fontFamily: 'Archivo_600SemiBold', fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
  button: { fontFamily: 'Archivo_700Bold', fontSize: 16, lineHeight: 20, letterSpacing: 0 },
  price: { fontFamily: 'Archivo_800ExtraBold', fontSize: 17, lineHeight: 22, letterSpacing: -0.2, fontVariant: ['tabular-nums'] },
  priceLarge: { fontFamily: 'Archivo_800ExtraBold', fontSize: 28, lineHeight: 32, letterSpacing: -0.6, fontVariant: ['tabular-nums'] },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
