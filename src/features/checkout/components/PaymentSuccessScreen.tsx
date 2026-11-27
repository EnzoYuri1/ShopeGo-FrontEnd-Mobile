import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button, Icon } from '@/components/ui';
import { colors, spacing, strings } from '@/constants';
import { CheckoutSteps } from '@/features/checkout/components/CheckoutSteps';

/** Pedido concluído: confirmação, caminho para acompanhar o pedido e para voltar às compras. */
export function PaymentSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + spacing.md, paddingBottom: Math.max(insets.bottom, spacing.md) },
      ]}
    >
      <CheckoutSteps step={2} />

      <View style={styles.center}>
        <View style={styles.badge}>
          <Icon name="check" size={48} color="onBrand" strokeWidth={3} />
        </View>
        <AppText variant="display" align="center" accessibilityRole="header">
          {strings.checkout.successHeading}
        </AppText>
        <AppText variant="subheading" align="center">
          {strings.checkout.successTitle}
        </AppText>
        <AppText variant="body" color="textSecondary" align="center" style={styles.text}>
          {strings.checkout.successText}
        </AppText>
      </View>

      <View style={styles.actions}>
        <Button
          title={strings.checkout.viewOrders}
          icon="package"
          onPress={() => router.replace('/orders')}
        />
        <Button
          title={strings.checkout.keepShopping}
          variant="ghost"
          onPress={() => router.replace('/(drawer)/(tabs)')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.ms },
  badge: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.successText,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  text: { maxWidth: 320 },
  actions: { gap: spacing.xs },
});
