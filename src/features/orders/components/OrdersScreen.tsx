import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import { useOrders } from '@/features/orders/hooks/useOrders';
import type { Order } from '@/features/orders/types/order';
import { formatDate, getStatusLabel } from '@/features/orders/utils/orderStatus';
import { formatPrice } from '@/utils/formatPrice';

export function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: orders = [], isLoading, isError } = useOrders();

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)');
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title={strings.orders.title} onBack={handleBack} />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.empty} />
          ) : (
            <Text style={styles.emptyText}>
              {isError ? strings.orders.loadError : strings.orders.empty}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <OrderRow
            order={item}
            onPress={() => router.push({ pathname: '/tracking/[id]', params: { id: item.id } })}
          />
        )}
      />
    </View>
  );
}

function OrderRow({ order, onPress }: { order: Order; onPress: () => void }) {
  const first = order.items[0];
  const extra = order.items.length - 1;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.rowTop}>
        <Text style={styles.name} numberOfLines={1}>
          {first?.name}
          {extra > 0 ? ` +${extra}` : ''}
        </Text>
        <Text style={styles.status}>{getStatusLabel(order.status)}</Text>
      </View>
      <View style={styles.rowBottom}>
        <Text style={styles.meta}>{formatDate(order.createdAt)}</Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: 19,
    paddingTop: 28,
    gap: 14,
  },
  empty: {
    marginTop: 60,
  },
  emptyText: {
    marginTop: 60,
    textAlign: 'center',
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.textSecondary,
  },
  row: {
    borderRadius: 12,
    backgroundColor: '#EBE8FE',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.35)',
    padding: 16,
    gap: 10,
  },
  pressed: {
    opacity: 0.85,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontFamily: fontFamily.heading,
    fontSize: 15,
    color: colors.black,
  },
  status: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.primary,
  },
  meta: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  total: {
    fontFamily: fontFamily.inriaBold,
    fontSize: 16,
    color: 'rgba(0,0,0,0.75)',
  },
});
