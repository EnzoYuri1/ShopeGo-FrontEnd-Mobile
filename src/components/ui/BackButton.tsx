import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/constants';

interface BackButtonProps {
  onPress: () => void;
  /** `close` desenha um X (usado na tela de verificação). */
  variant?: 'back' | 'close';
  style?: StyleProp<ViewStyle>;
}

export function BackButton({ onPress, variant = 'back', style }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={variant === 'close' ? 'Fechar' : 'Voltar'}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null, style]}
    >
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        {variant === 'close' ? (
          <Path
            d="M5 5l14 14M19 5L5 19"
            stroke={colors.black}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        ) : (
          <Path
            d="M15 4l-8 8 8 8"
            stroke={colors.black}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
