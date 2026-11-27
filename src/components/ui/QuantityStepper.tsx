import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, strings } from '@/constants';

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  /** `lg` = tela de produto; `sm` = linha do carrinho. */
  size?: 'lg' | 'sm';
  /** Menor valor permitido (o botão "−" fica desativado nele). */
  min?: number;
}

const SIZES = {
  lg: { box: 44, icon: 20, textWidth: 40 },
  sm: { box: 32, icon: 16, textWidth: 28 },
} as const;

/** Controle de quantidade "− N +" da marca: botões com contorno, valor no centro. */
export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  size = 'lg',
  min = 1,
}: QuantityStepperProps) {
  const s = SIZES[size];
  const canDecrement = value > min;

  return (
    <View style={styles.row} accessibilityRole="adjustable" accessibilityValue={{ now: value }}>
      <StepButton
        box={s.box}
        icon="minus"
        iconSize={s.icon}
        label={strings.cart.decrease}
        onPress={onDecrement}
        disabled={!canDecrement}
      />
      <AppText
        variant={size === 'lg' ? 'subheading' : 'bodyStrong'}
        align="center"
        style={{ minWidth: s.textWidth }}
      >
        {value}
      </AppText>
      <StepButton
        box={s.box}
        icon="plus"
        iconSize={s.icon}
        label={strings.cart.increase}
        onPress={onIncrement}
      />
    </View>
  );
}

interface StepButtonProps {
  box: number;
  icon: 'plus' | 'minus';
  iconSize: number;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

function StepButton({ box, icon, iconSize, label, onPress, disabled = false }: StepButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        { width: box, height: box },
        pressed ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Icon name={icon} size={iconSize} color="brand" strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  button: {
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: colors.surfaceBrand },
  disabled: { opacity: 0.4 },
});
