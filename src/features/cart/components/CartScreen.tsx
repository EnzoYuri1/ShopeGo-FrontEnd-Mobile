import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  Button,
  EmptyState,
  ErrorBanner,
  Icon,
  IconButton,
  QuantityStepper,
} from '@/components/ui';
import { colors, elevation, radius, spacing, strings } from '@/constants';
import { getEffectivePrice, useCart } from '@/features/cart/hooks/useCart';
import { useCartTotals } from '@/features/cart/hooks/useCartTotals';
import type { CartItem } from '@/features/cart/types/cart';
import { CheckoutSteps } from '@/features/checkout/components/CheckoutSteps';
import { PaymentMethodSheet } from '@/features/checkout/components/PaymentMethodSheet';
import { usePlaceOrder } from '@/features/checkout/hooks/usePlaceOrder';
import type { PaymentMethod } from '@/features/checkout/types/payment';
import { getCardImageSource } from '@/features/products/productImages';
import { fillTemplate } from '@/utils/fillTemplate';
import { formatPrice } from '@/utils/formatPrice';

/** Aba Carrinho: itens, resumo (subtotal, imposto de 10%, total) e escolha do pagamento. */
export function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, itemCount, updateQuantity, removeItem } = useCart();
  const { subtotal, tax, total } = useCartTotals();
  const { placeOrder, isPlacing } = usePlaceOrder();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [orderError, setOrderError] = useState(false);

  function handleProceed(method: PaymentMethod) {
    setSheetOpen(false);
    if (method === 'card') {
      router.push('/checkout/payment');
      return;
    }
    // "Outro": conclui o pedido direto, sem formulário de cartão.
    setOrderError(false);
    placeOrder(
      'other',
      () => router.replace('/checkout/success'),
      () => setOrderError(true),
    );
  }

  const countLabel =
    itemCount === 1
      ? strings.cart.itemsCountOne
      : fillTemplate(strings.cart.itemsCount, { n: itemCount });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleBlock}>
              <AppText variant="title" accessibilityRole="header">
                {strings.cart.screenTitle}
              </AppText>
              {items.length > 0 ? (
                <AppText variant="body" color="textSecondary">
                  {countLabel}
                </AppText>
              ) : null}
            </View>
            {items.length > 0 ? <CheckoutSteps step={0} /> : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="bag"
            title={strings.cart.emptyTitle}
            message={strings.cart.emptyMessage}
            actionLabel={strings.cart.explore}
            onAction={() => router.push('/categories')}
          />
        }
        renderItem={({ item }) => (
          <CartRow
            item={item}
            onOpen={() =>
              router.push({ pathname: '/product/[id]', params: { id: item.product.id } })
            }
            onChange={(quantity) => updateQuantity(item.product.id, quantity)}
            onRemove={() => removeItem(item.product.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {items.length > 0 ? (
        <View style={styles.summary}>
          <SummaryLine label={strings.cart.subtotal} value={formatPrice(subtotal)} />
          <SummaryLine label={strings.cart.taxLabel} value={formatPrice(tax)} />
          <View style={styles.totalRow}>
            <AppText variant="subheading">{strings.cart.totalLabel}</AppText>
            <AppText variant="priceLarge">{formatPrice(total)}</AppText>
          </View>
          {orderError ? (
            <ErrorBanner
              message={strings.checkout.orderFailed}
              onRetry={() => handleProceed('other')}
            />
          ) : null}
          <Button
            title={strings.cart.choosePayment}
            icon="creditCard"
            onPress={() => setSheetOpen(true)}
            loading={isPlacing}
          />
        </View>
      ) : null}

      {sheetOpen ? (
        <PaymentMethodSheet onClose={() => setSheetOpen(false)} onProceed={handleProceed} />
      ) : null}
    </View>
  );
}

interface CartRowProps {
  item: CartItem;
  onOpen: () => void;
  onChange: (quantity: number) => void;
  onRemove: () => void;
}

function CartRow({ item, onOpen, onChange, onRemove }: CartRowProps) {
  const { product, quantity } = item;
  const unitPrice = getEffectivePrice(product);
  const source = getCardImageSource(product);

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={product.name}
        style={styles.thumb}
      >
        {source ? (
          <Image source={source} contentFit="contain" style={styles.thumbImage} />
        ) : (
          <Icon name="bag" size={28} color="textDisabled" />
        )}
      </Pressable>

      <View style={styles.rowInfo}>
        <View style={styles.rowTop}>
          <AppText variant="bodyStrong" numberOfLines={2} style={styles.rowName}>
            {product.name}
          </AppText>
          <IconButton
            icon="trash"
            accessibilityLabel={fillTemplate(strings.cart.remove, { name: product.name })}
            onPress={onRemove}
          />
        </View>
        <AppText variant="caption" color="textSecondary">
          {fillTemplate(strings.cart.unitPrice, { p: formatPrice(unitPrice) })}
        </AppText>
        <View style={styles.rowBottom}>
          <QuantityStepper
            size="sm"
            value={quantity}
            onIncrement={() => onChange(quantity + 1)}
            onDecrement={() => onChange(quantity - 1)}
          />
          <AppText variant="price">{formatPrice(unitPrice * quantity)}</AppText>
        </View>
      </View>
    </View>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryLine}>
      <AppText variant="body" color="textSecondary">
        {label}
      </AppText>
      <AppText variant="bodyStrong">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
  header: { gap: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg },
  titleBlock: { gap: spacing.xs },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: spacing.ms },
  row: { flexDirection: 'row', gap: spacing.ms },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceBrand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: { width: '80%', height: '80%' },
  rowInfo: { flex: 1, gap: spacing.xs },
  rowTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  rowName: { flex: 1, paddingTop: spacing.xs },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  summary: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.background,
    ...elevation.raised,
  },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: spacing.sm,
    marginBottom: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
