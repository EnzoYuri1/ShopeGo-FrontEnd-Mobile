import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, fontFamily, strings } from '@/constants';

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  /** `lg` = tela de produto; `sm` = linha do carrinho. */
  size?: 'lg' | 'sm';
}

const SIZES = {
  lg: { box: 34, icon: 15, font: 32, gap: 6, textWidth: 34 },
  sm: { box: 19, icon: 9, font: 16, gap: 8, textWidth: 18 },
} as const;

/** Controle "+ N −" do Figma (botões pretos arredondados). */
export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  size = 'lg',
}: QuantityStepperProps) {
  const s = SIZES[size];

  return (
    <View style={[styles.row, { gap: s.gap }]}>
      <StepButton
        s={s}
        label={strings.cart.increase}
        onPress={onIncrement}
        path="M12 5v14M5 12h14"
      />
      <Text style={[styles.value, { fontSize: s.font, minWidth: s.textWidth }]}>{value}</Text>
      <StepButton s={s} label={strings.cart.decrease} onPress={onDecrement} path="M5 12h14" />
    </View>
  );
}

interface StepButtonProps {
  s: (typeof SIZES)[keyof typeof SIZES];
  label: string;
  onPress: () => void;
  path: string;
}

function StepButton({ s, label, onPress, path }: StepButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        { width: s.box, height: s.box },
        pressed ? styles.pressed : null,
      ]}
    >
      <Svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none">
        <Path d={path} stroke={colors.white} strokeWidth={3} strokeLinecap="round" />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.black,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  value: {
    fontFamily: fontFamily.heading,
    color: colors.black,
    textAlign: 'center',
  },
});
