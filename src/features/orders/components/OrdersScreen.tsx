import { useRouter } from 'expo-router';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  Badge,
  EmptyState,
  ErrorBanner,
  ErrorState,
  Icon,
  ScreenTopBar,
  Skeleton,
} from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
import { useOrders } from '@/features/orders/hooks/useOrders';
import type { Order } from '@/features/orders/types/order';
import { formatDate, getStatusLabel, getStatusTone } from '@/features/orders/utils/orderStatus';
import { fillTemplate } from '@/utils/fillTemplate';
import { formatPrice } from '@/utils/formatPrice';

// meus pedidos: status, data, itens e total; toque abre o rastreio
export function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: orders = [], isLoading, isError, refetch, isRefetching } = useOrders();

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)');
  }

  let empty;
  if (isLoading) {
    empty = (
      <View style={styles.skeletons}>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} height={112} />
        ))}
      </View>
    );
  } else if (isError && orders.length === 0) {
    empty = <ErrorState message={strings.orders.loadError} onRetry={() => void refetch()} />;
  } else {
    empty = (
      <EmptyState
        icon="package"
        title={strings.orders.emptyTitle}
        message={strings.orders.emptyMessage}
        actionLabel={strings.orders.startShopping}
        onAction={() => router.replace('/(drawer)/(tabs)')}
      />
    );
  }

  return (
    <View style={styles.root}>
      <ScreenTopBar onBack={handleBack} />
      <FlatList
        data={isLoading || (isError && orders.length === 0) ? [] : orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="title" accessibilityRole="header">
              {strings.orders.title}
            </AppText>
            {orders.length > 0 ? (
              <AppText variant="body" color="textSecondary">
                {orders.length === 1
                  ? strings.orders.countOne
                  : fillTemplate(strings.orders.count, { n: orders.length })}
              </AppText>
            ) : null}
            {isError && orders.length > 0 ? (
              <ErrorBanner message={strings.errors.refreshFailed} onRetry={() => void refetch()} />
            ) : null}
          </View>
        }
        ListEmptyComponent={empty}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => router.push({ pathname: '/tracking/[id]', params: { id: item.id } })}
          />
        )}
      />
    </View>
  );
}

function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const first = order.items[0];
  const extra = order.items.length - 1;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
    >
      <View style={styles.cardTop}>
        <AppText variant="label" color="textSecondary">
          {fillTemplate(strings.orders.number, { id: order.id.slice(0, 8).toUpperCase() })}
        </AppText>
        <Badge label={getStatusLabel(order.status)} tone={getStatusTone(order.status)} />
      </View>
      <AppText variant="bodyStrong" numberOfLines={1}>
        {first?.name}
      </AppText>
      {extra > 0 ? (
        <AppText variant="caption" color="textSecondary">
          {extra === 1
            ? strings.orders.moreItemsOne
            : fillTemplate(strings.orders.moreItems, { n: extra })}
        </AppText>
      ) : null}
      <View style={styles.cardBottom}>
        <AppText variant="caption" color="textSecondary">
          {formatDate(order.createdAt)}
        </AppText>
        <View style={styles.total}>
          <AppText variant="price">{formatPrice(order.total)}</AppText>
          <Icon name="chevronRight" size={18} color="textSecondary" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.md, gap: spacing.ms },
  header: { gap: spacing.xs, paddingBottom: spacing.sm },
  skeletons: { gap: spacing.ms },
  card: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  cardPressed: { backgroundColor: colors.surface },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  total: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
