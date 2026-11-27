import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/ui/AppText';
import { colors, spacing } from '@/constants';

type MarkTone = 'color' | 'onBrand' | 'onPrimary';

interface BrandMarkProps {
  size?: number;
  /** color: fundo claro. onBrand: sobre Azul Noite. onPrimary: sobre Laranja Sinal. */
  tone?: MarkTone;
}

const TONES: Record<MarkTone, { bag: string; handle: string }> = {
  color: { bag: colors.primary, handle: colors.brand },
  onBrand: { bag: colors.primary, handle: colors.white },
  onPrimary: { bag: colors.white, handle: colors.brand },
};

/**
 * Símbolo ShopGo "Rota": sacola cuja alça termina numa seta para a frente
 * (comprar e já seguir).
 */
export function BrandMark({ size = 32, tone = 'color' }: BrandMarkProps) {
  const t = TONES[tone];
  return (
    <Svg width={size} height={size} viewBox="0 0 34 34" accessible={false}>
      <Path d="M6 13h22l-2 16a3 3 0 0 1-3 2.6H11A3 3 0 0 1 8 29z" fill={t.bag} />
      <Path
        d="M11 13c0-5 2.6-8 6-8s6 3 6 7"
        fill="none"
        stroke={t.handle}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M20.4 9.6 23 12.2l2.8-2.4"
        fill="none"
        stroke={t.handle}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface BrandLogoProps {
  /** Altura do símbolo; o nome acompanha a proporção. */
  size?: number;
  /** full: símbolo + nome. mark: só o símbolo. */
  variant?: 'full' | 'mark';
  /** color: fundo claro. onPrimary: sobre Laranja Sinal (sacola branca). onBrand: sobre Azul Noite. */
  tone?: MarkTone;
  /**
   * Legado: posiciona no canto superior direito (telas ainda não migradas).
   * Nas telas novas use `floating={false}` dentro do cabeçalho.
   */
  floating?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Logo ShopGo: símbolo + nome em Archivo ExtraBold, em caixa baixa. */
export function BrandLogo({
  size = 28,
  variant = 'full',
  tone = 'color',
  floating = true,
  style,
}: BrandLogoProps) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="ShopGo"
      style={[styles.row, floating ? styles.floating : null, style]}
    >
      <BrandMark size={size} tone={tone} />
      {variant === 'full' ? (
        <AppText
          variant="title"
          color={tone === 'onBrand' ? 'onBrand' : 'brand'}
          style={{ fontSize: size * 0.82, lineHeight: size, letterSpacing: -size * 0.03 }}
        >
          shopgo
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  floating: { position: 'absolute', top: spacing.ms, right: spacing.md },
});
