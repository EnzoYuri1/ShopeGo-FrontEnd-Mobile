import { Image, type ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button, ScreenTopBar } from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
import { DEALS_CATEGORY, isDeal } from '@/features/categories/categoryName';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useIsLandscape } from '@/hooks/useScreenWidth';

const images = {
  gift: require('../../../../assets/images/offers/gift.webp'),
  freeTag: require('../../../../assets/images/offers/free-tag.webp'),
};

/** Quantas ofertas mostrar aqui; o restante fica em "Ver todas". */
const TOP_DEALS = 12;

interface CouponProps {
  title: string;
  text: string;
  image: ImageSource;
  tone: 'brand' | 'tint';
  onAccept: () => void;
}

function Coupon({ title, text, image, tone, onAccept }: CouponProps) {
  const isBrand = tone === 'brand';
  return (
    <View style={[styles.coupon, isBrand ? styles.couponBrand : styles.couponTint]}>
      <View style={styles.couponText}>
        <AppText variant="heading" color={isBrand ? 'onBrand' : 'text'}>
          {title}
        </AppText>
        <AppText variant="caption" color={isBrand ? 'onBrand' : 'textSecondary'}>
          {text}
        </AppText>
        <Button
          title={strings.offers.accept}
          size="md"
          fullWidth={false}
          variant={isBrand ? 'primary' : 'secondary'}
          onPress={onAccept}
          style={styles.couponCta}
        />
      </View>
      <Image source={image} contentFit="contain" style={styles.couponImage} accessible={false} />
    </View>
  );
}

/** Ofertas: os cupons existentes e os maiores descontos reais do catálogo. */
export function OffersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const landscape = useIsLandscape();
  const { data: products = [], isLoading, isError, refetch } = useProducts();

  const topDeals = useMemo(
    () =>
      products
        .filter(isDeal)
        .sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
        .slice(0, TOP_DEALS),
    [products],
  );

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)');
  }

  // Comportamento mantido: aceitar o cupom leva de volta às compras.
  function handleAccept() {
    router.replace('/(drawer)/(tabs)');
  }

  const header = (
    <View style={styles.header}>
      <View style={styles.titleBlock}>
        <AppText variant="title" accessibilityRole="header">
          {strings.offers.screenTitle}
        </AppText>
        <AppText variant="body" color="textSecondary">
          {strings.offers.intro}
        </AppText>
      </View>

      <View style={[styles.coupons, landscape ? styles.couponsRow : null]}>
        <Coupon
          title={strings.offers.couponFreeDelivery}
          text={strings.offers.couponFreeDeliveryText}
          image={images.gift}
          tone="brand"
          onAccept={handleAccept}
        />
        <Coupon
          title={strings.offers.couponFirstFree}
          text={strings.offers.couponFirstFreeText}
          image={images.freeTag}
          tone="tint"
          onAccept={handleAccept}
        />
      </View>

      <View style={styles.sectionHead}>
        <AppText variant="heading">{strings.offers.topDeals}</AppText>
        <Pressable
          onPress={() =>
            router.push({ pathname: '/category/[slug]', params: { slug: DEALS_CATEGORY } })
          }
          hitSlop={8}
          accessibilityRole="link"
        >
          <AppText variant="bodyStrong" color="primaryText">
            {strings.offers.seeAllDeals}
          </AppText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <ScreenTopBar onBack={handleBack} />
      <ProductGrid
        products={topDeals}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        errorMessage={strings.home.loadError}
        header={header}
        bottomInset={insets.bottom}
        empty={{ title: strings.home.emptyProducts }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { gap: spacing.lg, paddingBottom: spacing.xs },
  titleBlock: { gap: spacing.xs },
  coupons: { gap: spacing.ms },
  couponsRow: { flexDirection: 'row' },
  coupon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.ml,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  couponBrand: { backgroundColor: colors.brand },
  couponTint: { backgroundColor: colors.primaryLight },
  couponText: { flex: 1, gap: spacing.xs },
  couponCta: { alignSelf: 'flex-start', marginTop: spacing.sm },
  couponImage: { width: 96, height: 96 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
