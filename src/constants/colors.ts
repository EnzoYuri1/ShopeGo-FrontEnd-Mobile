/**
 * Cores do ShopGo — identidade "Rota".
 *
 * `palette` guarda os valores brutos da marca; as telas usam `colors` (nomes por função).
 * Regras de contraste (WCAG AA, conferidas):
 * - Botão principal: fundo `primary` com texto `onPrimary` (Azul Noite, 4,8:1).
 *   Texto branco sobre o laranja NÃO passa (3,1:1).
 * - Laranja como texto sobre branco usa `primaryText` (5,2:1), nunca `primary`.
 * - Texto secundário mínimo: `textSecondary` (5,4:1 no branco, 4,6:1 no `surfaceBrand`).
 */
export const palette = {
  /** Laranja Sinal: ação, destaque, desconto. */
  signal: '#FF5A1F',
  signalPressed: '#E64A12',
  signalDeep: '#C2410C',
  signalTint: '#FFE9E0',
  /** Azul Noite: texto, campanhas, marca. */
  night: '#12264B',
  nightSoft: '#2A3F66',
  /** Céu: superfícies de produto e campos. */
  sky: '#E8EEF7',
  skyStrong: '#D3DDEC',
  mist: '#F6F8FB',
  white: '#FFFFFF',
  slate: '#5E6B82',
  slateLight: '#8A95A8',
  line: '#DDE3EC',
  /** Entregue: sucesso e status concluído. */
  delivered: '#1F9D6B',
  deliveredDeep: '#17805A',
  deliveredTint: '#E3F4EC',
  alert: '#C8372A',
  alertTint: '#FCE8E6',
  caution: '#9A6700',
  cautionTint: '#FDF3E1',
} as const;

export const colors = {
  // Marca e ação
  primary: palette.signal,
  primaryPressed: palette.signalPressed,
  primaryText: palette.signalDeep,
  primaryLight: palette.signalTint,
  onPrimary: palette.night,
  brand: palette.night,
  brandSoft: palette.nightSoft,
  onBrand: palette.white,

  // Superfícies
  background: palette.white,
  surface: palette.mist,
  surfaceBrand: palette.sky,
  surfaceBrandStrong: palette.skyStrong,

  // Texto
  text: palette.night,
  textSecondary: palette.slate,
  textMuted: palette.slate,
  /** Só para texto não essencial (desabilitado, decorativo): 3:1. */
  textDisabled: palette.slateLight,

  // Linhas
  border: palette.line,
  borderStrong: palette.skyStrong,

  // Estados
  success: palette.delivered,
  successText: palette.deliveredDeep,
  successLight: palette.deliveredTint,
  danger: palette.alert,
  dangerLight: palette.alertTint,
  warning: palette.caution,
  warningLight: palette.cautionTint,

  // Neutros absolutos
  black: '#000000',
  white: palette.white,

  /** Sombra: sempre tingida de Azul Noite, nunca preto puro. */
  shadow: palette.night,

  // Legado (telas ainda não migradas; remover na Etapa 7)
  otpBorder: '#FFDFDF',
  socialButton: '#ECECEC',
  buttonShadow: '#CBD6FF',
} as const;

export type ColorName = keyof typeof colors;
