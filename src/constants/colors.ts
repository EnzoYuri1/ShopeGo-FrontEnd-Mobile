// cores do shopgo — identidade "rota"
export const palette = {
  signal: '#FF5A1F',
  signalPressed: '#E64A12',
  signalDeep: '#C2410C',
  signalTint: '#FFE9E0',
  night: '#12264B',
  nightSoft: '#2A3F66',
  sky: '#E8EEF7',
  skyStrong: '#D3DDEC',
  mist: '#F6F8FB',
  white: '#FFFFFF',
  slate: '#5E6B82',
  slateLight: '#8A95A8',
  line: '#DDE3EC',
  delivered: '#1F9D6B',
  deliveredDeep: '#17805A',
  deliveredTint: '#E3F4EC',
  alert: '#C8372A',
  alertTint: '#FCE8E6',
  caution: '#9A6700',
  cautionTint: '#FDF3E1',
} as const;

export const colors = {
  // marca e ação
  primary: palette.signal,
  primaryPressed: palette.signalPressed,
  primaryText: palette.signalDeep,
  primaryLight: palette.signalTint,
  onPrimary: palette.night,
  brand: palette.night,
  brandSoft: palette.nightSoft,
  onBrand: palette.white,

  // superfícies
  background: palette.white,
  surface: palette.mist,
  surfaceBrand: palette.sky,
  surfaceBrandStrong: palette.skyStrong,

  // texto
  text: palette.night,
  textSecondary: palette.slate,
  textMuted: palette.slate,
  textDisabled: palette.slateLight,

  // linhas
  border: palette.line,
  borderStrong: palette.skyStrong,

  // estados
  success: palette.delivered,
  successText: palette.deliveredDeep,
  successLight: palette.deliveredTint,
  danger: palette.alert,
  dangerLight: palette.alertTint,
  warning: palette.caution,
  warningLight: palette.cautionTint,

  // neutros absolutos
  white: palette.white,

  scrim: 'rgba(18, 38, 75, 0.45)',

  shadow: palette.night,
} as const;

export type ColorName = keyof typeof colors;
