import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing, type ColorName } from '@/constants';

type BadgeTone = 'signal' | 'brand' | 'success' | 'danger' | 'warning' | 'neutral';

const TONES: Record<BadgeTone, { bg: string; fg: ColorName }> = {
  signal: { bg: colors.primary, fg: 'onPrimary' },
  brand: { bg: colors.brand, fg: 'onBrand' },
  success: { bg: colors.successLight, fg: 'successText' },
  danger: { bg: colors.dangerLight, fg: 'danger' },
  warning: { bg: colors.warningLight, fg: 'warning' },
  neutral: { bg: colors.surfaceBrand, fg: 'text' },
};

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

// selo curto: desconto (signal), status de pedido (success/warning/danger), contagem
export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const look = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: look.bg }]}>
      <AppText variant="label" color={look.fg}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.xs,
  },
});
