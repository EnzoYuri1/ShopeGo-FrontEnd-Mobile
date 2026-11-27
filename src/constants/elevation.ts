import type { ViewStyle } from 'react-native';

import { colors } from './colors';

/**
 * Sombras por função. A marca usa poucas sombras: separação vem de cor e linha.
 * - raised: elementos que flutuam sobre o conteúdo (barra inferior, aviso, folha).
 * - overlay: modais.
 */
export const elevation = {
  none: {},
  raised: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  overlay: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
} as const satisfies Record<string, ViewStyle>;
