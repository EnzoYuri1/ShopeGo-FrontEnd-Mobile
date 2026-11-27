import { Image } from 'expo-image';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button } from '@/components/ui';
import { colors, elevation, radius, spacing, strings } from '@/constants';
import type { PaymentMethod } from '@/features/checkout/types/payment';

const logos = {
  visa: require('../../../../assets/images/payments/visa.webp'),
  mastercard: require('../../../../assets/images/payments/mastercard.webp'),
  other: require('../../../../assets/images/payments/other.webp'),
};

interface PaymentMethodSheetProps {
  onClose: () => void;
  onProceed: (method: PaymentMethod) => void;
}

// folha de escolha da forma de pagamento, sobre o carrinho
export function PaymentMethodSheet({ onClose, onProceed }: PaymentMethodSheetProps) {
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState<PaymentMethod>('card');

  return (
    <View style={styles.overlay}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={strings.common.cancel}
      />
      <View
        style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}
        accessibilityViewIsModal
      >
        <View style={styles.handle} />
        <AppText variant="heading" accessibilityRole="header">
          {strings.checkout.selectMethod}
        </AppText>

        <View accessibilityRole="radiogroup" style={styles.options}>
          <Option
            selected={method === 'card'}
            label={strings.checkout.methodCard}
            hint={strings.checkout.methodCardHint}
            onPress={() => setMethod('card')}
          >
            <Image source={logos.visa} contentFit="contain" style={styles.visa} />
            <Image source={logos.mastercard} contentFit="contain" style={styles.mastercard} />
          </Option>
          <Option
            selected={method === 'other'}
            label={strings.checkout.methodOther}
            hint={strings.checkout.methodOtherHint}
            onPress={() => setMethod('other')}
          >
            <Image source={logos.other} contentFit="contain" style={styles.other} />
          </Option>
        </View>

        <Button title={strings.checkout.proceed} onPress={() => onProceed(method)} />
      </View>
    </View>
  );
}

interface OptionProps {
  selected: boolean;
  label: string;
  hint: string;
  onPress: () => void;
  children: ReactNode;
}

function Option({ selected, label, hint, onPress, children }: OptionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${label}. ${hint}`}
      style={({ pressed }) => [
        styles.option,
        selected ? styles.optionOn : null,
        pressed && !selected ? styles.optionPressed : null,
      ]}
    >
      <View style={[styles.radio, selected ? styles.radioOn : null]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <View style={styles.optionText}>
        <AppText variant="bodyStrong">{label}</AppText>
        <AppText variant="caption" color="textSecondary">
          {hint}
        </AppText>
      </View>
      <View style={styles.logos}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: colors.scrim },
  sheet: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.background,
    ...elevation.overlay,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },
  options: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.ms,
    minHeight: 64,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.ms,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionOn: { borderColor: colors.brand, backgroundColor: colors.surfaceBrand },
  optionPressed: { backgroundColor: colors.surface },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.brand },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brand },
  optionText: { flex: 1, gap: 2 },
  logos: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  visa: { width: 40, height: 14 },
  mastercard: { width: 30, height: 20 },
  other: { width: 30, height: 24 },
});
