import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton, BrandLogo, Button, QuantityStepper } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import { getEffectivePrice, useCart } from '@/features/cart/hooks/useCart';
import { useCartTotals } from '@/features/cart/hooks/useCartTotals';
import type { CartItem } from '@/features/cart/types/cart';
import { PaymentMethodSheet } from '@/features/checkout/components/PaymentMethodSheet';
import type { PaymentMethod } from '@/features/checkout/types/payment';
import { usePlaceOrder } from '@/features/checkout/hooks/usePlaceOrder';
import { getCardImageSource } from '@/features/products/productImages';
import { formatPrice } from '@/utils/formatPrice';

export function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, updateQuantity } = useCart();
  const { tax, total } = useCartTotals();
  const { placeOrder, isPlacing } = usePlaceOrder();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [orderError, setOrderError] = useState(false);

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)');
  }

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

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.ellipse} />
        <View style={[styles.headerContent, { paddingTop: insets.top }]}>
          <BackButton onPress={handleBack} style={styles.back} />
          <Text style={styles.title}>{strings.cart.title}</Text>
        </View>
        <BrandLogo tone="onPrimary" style={{ top: insets.top - 2 }} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>{strings.cart.empty}</Text>}
        renderItem={({ item }) => (
          <CartRow item={item} onChange={(qty) => updateQuantity(item.product.id, qty)} />
        )}
        ListFooterComponent={
          items.length > 0 ? (
            <View style={styles.summary}>
              <Text style={styles.paymentTitle}>{strings.cart.payment}</Text>
              <SummaryLine label={strings.cart.tax} value={formatPrice(tax)} muted />
              <SummaryLine label={strings.cart.total} value={formatPrice(total)} />
            </View>
          ) : undefined
        }
      />

      {orderError ? <Text style={styles.orderError}>{strings.checkout.orderFailed}</Text> : null}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          title={strings.cart.confirm}
          onPress={() => setSheetOpen(true)}
          loading={isPlacing}
          disabled={items.length === 0}
          style={styles.confirm}
        />
      </View>
      {sheetOpen ? (
        <PaymentMethodSheet onClose={() => setSheetOpen(false)} onProceed={handleProceed} />
      ) : null}
    </View>
  );
}

interface CartRowProps {
  item: CartItem;
  onChange: (quantity: number) => void;
}

function CartRow({ item, onChange }: CartRowProps) {
  const { product, quantity } = item;
  const unitPrice = getEffectivePrice(product);
  const source = getCardImageSource(product);

  return (
    <View style={styles.row}>
      <View style={styles.thumb}>
        {source ? <Image source={source} contentFit="contain" style={styles.thumbImage} /> : null}
      </View>

      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.unitPrice}>{formatPrice(unitPrice)}</Text>
        <View style={styles.rowDivider} />
        <View style={styles.rowBottom}>
          <QuantityStepper
            size="sm"
            value={quantity}
            onIncrement={() => onChange(quantity + 1)}
            onDecrement={() => onChange(quantity - 1)}
          />
          <Text style={styles.lineTotal}>{formatPrice(unitPrice * quantity)}</Text>
        </View>
      </View>
    </View>
  );
}

interface SummaryLineProps {
  label: string;
  value: string;
  muted?: boolean;
}

function SummaryLine({ label, value, muted }: SummaryLineProps) {
  return (
    <View style={styles.summaryLine}>
      <Text style={[styles.summaryLabel, muted ? null : styles.summaryLabelStrong]}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const HEADER_HEIGHT = 113;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    overflow: 'hidden',
  },
  ellipse: {
    position: 'absolute',
    left: '50%',
    marginLeft: -232,
    top: HEADER_HEIGHT - 465,
    width: 465,
    height: 465,
    borderRadius: 233,
    backgroundColor: colors.primary,
  },
  headerContent: {
    minHeight: HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  back: {
    position: 'absolute',
    left: 10,
    top: 36,
  },
  title: {
    marginTop: 8,
    fontFamily: fontFamily.interSemibold,
    fontSize: 28,
    color: colors.black,
  },
  list: {
    paddingHorizontal: 19,
    paddingTop: 36,
    paddingBottom: 24,
    gap: 13,
  },
  empty: {
    marginTop: 60,
    textAlign: 'center',
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: 24,
    padding: 16,
    backgroundColor: '#EBE8FE',
    borderWidth: 0.3,
    borderColor: colors.black,
    borderRadius: 9,
  },
  thumb: {
    width: 91,
    height: 91,
    borderWidth: 1,
    borderColor: 'rgba(6,6,6,0.12)',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    width: 80,
    height: 80,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontFamily: fontFamily.heading,
    fontSize: 16,
    lineHeight: 20,
    color: colors.black,
  },
  unitPrice: {
    marginTop: 6,
    alignSelf: 'flex-end',
    fontFamily: fontFamily.inriaBold,
    fontSize: 12,
    color: 'rgba(0,0,0,0.67)',
  },
  rowDivider: {
    height: 1,
    marginVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineTotal: {
    fontFamily: fontFamily.inriaBold,
    fontSize: 16,
    color: 'rgba(0,0,0,0.67)',
  },
  summary: {
    marginTop: 28,
    gap: 18,
  },
  paymentTitle: {
    marginLeft: 3,
    fontFamily: fontFamily.interSemibold,
    fontSize: 24,
    color: 'rgba(0,0,0,0.63)',
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  summaryLabel: {
    fontFamily: fontFamily.interSemibold,
    fontSize: 20,
    color: 'rgba(0,0,0,0.68)',
  },
  summaryLabelStrong: {
    color: 'rgba(0,0,0,0.68)',
  },
  summaryValue: {
    fontFamily: fontFamily.interSemibold,
    fontSize: 20,
    color: colors.black,
  },
  orderError: {
    textAlign: 'center',
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.danger,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  confirm: {
    backgroundColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
});
