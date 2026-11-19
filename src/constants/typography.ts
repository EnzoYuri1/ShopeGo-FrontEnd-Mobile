/**
 * Tipografia do ShopGo.
 * PROVISÓRIO: usa a fonte do sistema até a fonte do Figma ser definida.
 * Quando houver fonte própria, carregue com expo-font em app/_layout.tsx
 * e altere apenas `fontFamily` aqui.
 */
export const fontFamily = {
  regular: undefined,
  medium: undefined,
  bold: undefined,
} as const;

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
