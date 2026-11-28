// escala de espaçamento (múltiplos de 4). use sempre estes valores
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  ms: 12,
  md: 16,
  ml: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// raios por função (não por gosto): - xs: selos e etiquetas pequenas - sm: chips, botões compactos - md: botõ...
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

// altura mínima de áreas tocáveis (acessibilidade)
export const touchTarget = 44;
