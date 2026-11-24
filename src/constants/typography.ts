/**
 * Tipografia do ShopGo (tokens do Figma).
 * Fontes carregadas com expo-font em app/_layout.tsx (veja `appFonts`).
 * - Poppins: textos e títulos das telas
 * - Inter: textos do onboarding
 * - Sansita (extra-bold itálico): botões de destaque (Next, Conecte-se...)
 * Telas antigas ainda usam fontWeight com a fonte do sistema; ao migrar uma tela,
 * troque `fontWeight` por `fontFamily` (não combine os dois com fontes customizadas).
 */
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Sansita_800ExtraBold_Italic } from '@expo-google-fonts/sansita';

export const fontFamily = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  interRegular: 'Inter_400Regular',
  interSemibold: 'Inter_600SemiBold',
  interBold: 'Inter_700Bold',
  display: 'Sansita_800ExtraBold_Italic',
} as const;

/** Mapa passado para `useFonts` no layout raiz. */
export const appFonts = {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Sansita_800ExtraBold_Italic,
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
