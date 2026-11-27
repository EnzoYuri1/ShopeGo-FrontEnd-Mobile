import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  Badge,
  Button,
  EmptyState,
  ErrorState,
  Icon,
  RouteLine,
  ScreenTopBar,
  Skeleton,
  type IconName,
} from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
import { useOrder } from '@/features/orders/hooks/useOrders';
import {
  formatDate,
  getCurrentStep,
  getPaymentLabel,
  getStatusLabel,
  getStatusTone,
  TRACKING_STEPS,
} from '@/features/orders/utils/orderStatus';
import { fillTemplate } from '@/utils/fillTemplate';
import { formatPrice } from '@/utils/formatPrice';

interface TrackingScreenProps {
  orderId: string;
}

const STOPS = TRACKING_STEPS.map((step) => ({
  key: step.title,
  label: step.title,
  description: step.subtitle,
}));

function InfoRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Icon name={icon} size={20} color="brand" />
      </View>
      <View style={styles.infoText}>
        <AppText variant="caption" color="textSecondary">
          {label}
        </AppText>
        <AppText variant="bodyStrong">{value}</AppText>
      </View>
    </View>
  );
}

// acompanhar pedido: status real em linha do tempo, itens, endereço, pagamento e total
export function TrackingScreen({ orderId }: TrackingScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/orders');
  }

  if (isLoading) {
    return (
      <View style={styles.root}>
        <ScreenTopBar onBack={handleBack} title={strings.tracking.title} />
        <View style={styles.loading}>
          <Skeleton height={96} />
          <Skeleton height={220} />
        </View>
      </View>
    );
  }

  if (isError && !order) {
    return (
      <View style={styles.root}>
        <ScreenTopBar onBack={handleBack} title={strings.tracking.title} />
        <ErrorState message={strings.tracking.loadError} onRetry={() => void refetch()} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.root}>
        <ScreenTopBar onBack={handleBack} title={strings.tracking.title} />
        <EmptyState
          icon="package"
          title={strings.tracking.notFound}
          actionLabel={strings.tracking.backToOrders}
          onAction={() => router.replace('/orders')}
        />
      </View>
    );
  }

  const current = getCurrentStep(order.status);
  const cancelled = current < 0;

  return (
    <View style={styles.root}>
      <ScreenTopBar onBack={handleBack} title={strings.tracking.title} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <AppText variant="label" color="onBrand">
              {fillTemplate(strings.orders.number, { id: order.id.slice(0, 8).toUpperCase() })}
            </AppText>
            <Badge label={getStatusLabel(order.status)} tone={getStatusTone(order.status)} />
          </View>
          {!cancelled ? (
            <>
              <AppText variant="caption" color="onBrand">
                {strings.tracking.estimate}
              </AppText>
              <AppText variant="title" color="onBrand">
                {formatDate(order.createdAt, 5)}
              </AppText>
            </>
          ) : (
            <AppText variant="subheading" color="onBrand">
              {strings.tracking.cancelled}
            </AppText>
          )}
        </View>

        {!cancelled ? (
          <View style={styles.section}>
            <AppText variant="heading">{strings.tracking.statusTitle}</AppText>
            <RouteLine stops={STOPS} activeIndex={current} orientation="vertical" />
          </View>
        ) : null}

        <View style={styles.section}>
          <AppText variant="heading">{strings.tracking.summaryTitle}</AppText>
          <View style={styles.items}>
            {order.items.map((item) => (
              <View key={item.productId} style={styles.itemRow}>
                <AppText variant="body" numberOfLines={2} style={styles.itemName}>
                  {item.name}
                </AppText>
                <AppText variant="caption" color="textSecondary">
                  {fillTemplate(strings.tracking.units, { n: item.quantity })}
                </AppText>
                <AppText variant="bodyStrong">
                  {formatPrice(item.unitPrice * item.quantity)}
                </AppText>
              </View>
            ))}
          </View>
          <InfoRow
            icon="mapPin"
            label={strings.tracking.addressTitle}
            value={order.shippingAddress}
          />
          <InfoRow
            icon="creditCard"
            label={strings.tracking.paymentTitle}
            value={getPaymentLabel(order.paymentMethod)}
          />
          <View style={styles.totalRow}>
            <AppText variant="subheading">{strings.tracking.totalTitle}</AppText>
            <AppText variant="priceLarge">{formatPrice(order.total)}</AppText>
          </View>
        </View>

        <Button title={strings.tracking.backToOrders} variant="outline" onPress={handleBack} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loading: { padding: spacing.md, gap: spacing.md },
  scroll: { padding: spacing.md, gap: spacing.xl },
  hero: {
    gap: spacing.xs,
    padding: spacing.ml,
    borderRadius: radius.lg,
    backgroundColor: colors.brand,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  section: { gap: spacing.md },
  items: { gap: spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  itemName: { flex: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.ms },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceBrand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { flex: 1, gap: 2 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: spacing.ms,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
