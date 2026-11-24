/**
 * Paleta do ShopGo (valores do Figma).
 */
export const colors = {
  primary: '#FD6406',
  primaryLight: '#FFF1EE',
  black: '#000000',
  white: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#F7F7FA',
  text: '#111111',
  textSecondary: '#626262',
  textMuted: '#6B6B6B',
  border: '#E5E5E5',
  otpBorder: '#FFDFDF',
  socialButton: '#ECECEC',
  buttonShadow: '#CBD6FF',
  danger: '#E53935',
  success: '#2DB67C',
} as const;

export type ColorName = keyof typeof colors;
