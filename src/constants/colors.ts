/**
 * Paleta do ShopGo.
 * PROVISÓRIO: valores estimados a partir dos prints do protótipo.
 * Validar/ajustar com os tokens reais do Figma na Etapa 02.
 */
export const colors = {
  primary: '#FF6A00',
  primaryLight: '#FFF1E8',
  black: '#000000',
  white: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#F7F7FA',
  text: '#111111',
  textSecondary: '#6B6B6B',
  border: '#E5E5E5',
  danger: '#E53935',
  success: '#2DB67C',
} as const;

export type ColorName = keyof typeof colors;
