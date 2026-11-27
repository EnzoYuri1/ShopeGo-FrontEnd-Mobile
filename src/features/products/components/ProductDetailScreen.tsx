import { Image, type ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  Badge,
  Button,
  EmptyState,
  ErrorState,
  Icon,
  IconButton,
  QuantityStepper,
  ScreenTopBar,
  Skeleton,
} from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { getEffectivePrice, useCart } from '@/features/cart/hooks/useCart';
import { getCategoryName } from '@/features/categories/categoryName';
import { categoryOf } from '@/features/categories/hooks/useCategories';
import { RelatedProducts } from '@/features/products/components/RelatedProducts';
import { useProduct } from '@/features/products/hooks/useProducts';
import { getCardImageSource, getProductImages } from '@/features/products/productImages';
import type { Product } from '@/features/products/types/product';
import { useIsLandscape } from '@/hooks/useScreenWidth';
import { useFavoritesStore } from '@/store';
import { fillTemplate } from '@/utils/fillTemplate';
import { formatPrice } from '@/utils/formatPrice';

/** Altura do rodapé fixo; o aviso "Adicionado ao carrinho" aparece acima dele. */
const FOOTER_LIFT = 88;
/** A partir de quantas unidades o estoque deixa de ser "últimas unidades". */
const LOW_STOCK = 10;

interface ProductDetailScreenProps {
  productId: string;
}

/** Fotos do produto: assets locais (mocks) ou a galeria da API; no mínimo a foto do card. */
function getGallery(product: Product): ImageSource[] {
  const local = getProductImages(product);
  if (local) {
    if (local.variants.length === 0) return [local.banner];
    return local.variants.map((variant, index) => (index === 0 ? local.banner : variant));
  }
  const remote = (product.images ?? []).map((uri) => ({ uri }));
  if (remote.length > 0) return remote;
  const card = getCardImageSource(product);
  return card ? [card] : [];
}

function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',');
}

function StockLine({ stock }: { stock: number | undefined }) {
  if (stock === undefined) return null;
  if (stock <= 0) return <Badge label={strings.product.outOfStock} tone="danger" />;
  if (stock <= LOW_STOCK) {
    return <Badge label={fillTemplate(strings.product.lowStock, { n: stock })} tone="warning" />;
  }
  return <Badge label={strings.product.inStock} tone="success" />;
}

function DetailSkeleton() {
  return (
    <View style={styles.skeleton}>
      <Skeleton style={styles.skeletonMedia} />
      <Skeleton height={14} width="30%" rounded="xs" />
      <Skeleton height={28} width="85%" rounded="xs" />
      <Skeleton height={32} width="45%" rounded="xs" />
    </View>
  );
}

export function ProductDetailScreen({ productId }: ProductDetailScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const landscape = useIsLandscape();
  const { data: product, isLoading, isError, refetch } = useProduct(productId);
  const { itemCount, addItem } = useCart();
  const addToCart = useAddToCart(FOOTER_LIFT);
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggle);

  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)');
  }

  const isFavorite = favoriteIds.includes(productId);
  const topBar = (
    <ScreenTopBar
      onBack={handleBack}
      right={
        product ? (
          <>
            <IconButton
              icon="heart"
              filled={isFavorite}
              accessibilityLabel={
                isFavorite ? strings.productCard.unfavorite : strings.productCard.favorite
              }
              onPress={() => toggleFavorite(productId)}
            />
            <IconButton
              icon="bag"
              accessibilityLabel={strings.product.openCart}
              badgeCount={itemCount}
              onPress={() => router.push('/cart')}
            />
          </>
        ) : null
      }
    />
  );

  if (isLoading) {
    return (
      <View style={styles.root}>
        {topBar}
        <DetailSkeleton />
      </View>
    );
  }

  if (isError && !product) {
    return (
      <View style={styles.root}>
        {topBar}
        <ErrorState message={strings.product.loadError} onRetry={() => void refetch()} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.root}>
        {topBar}
        <EmptyState
          icon="package"
          title={strings.product.notFound}
          message={strings.product.notFoundMessage}
          actionLabel={strings.product.exploreCategories}
          onAction={() => router.replace('/categories')}
        />
      </View>
    );
  }

  const current = product;
  const gallery = getGallery(current);
  const mainImage = gallery[imageIndex] ?? gallery[0];
  const finalPrice = getEffectivePrice(current);
  const hasDiscount = Boolean(current.discountPercent);
  const soldOut = current.stock !== undefined && current.stock <= 0;
  const category = categoryOf(current);

  function handleBuyNow() {
    addItem(current, quantity);
    router.push('/cart');
  }

  const media = (
    <View style={[styles.media, landscape ? styles.mediaLandscape : null]}>
      <View style={styles.mainImage}>
        {mainImage ? (
          <Image
            source={mainImage}
            contentFit="contain"
            transition={150}
            cachePolicy="memory-disk"
            style={styles.image}
            accessibilityLabel={current.name}
          />
        ) : (
          <Icon name="bag" size={56} color="textDisabled" />
        )}
        {hasDiscount ? (
          <View style={styles.discount}>
            <Badge
              label={fillTemplate(strings.product.discountOff, { p: current.discountPercent ?? 0 })}
              tone="signal"
            />
          </View>
        ) : null}
      </View>

      {gallery.length > 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbs}
        >
          {gallery.map((source, index) => (
            <Pressable
              key={index}
              onPress={() => setImageIndex(index)}
              accessibilityRole="button"
              accessibilityState={{ selected: index === imageIndex }}
              accessibilityLabel={fillTemplate(strings.product.image, {
                i: index + 1,
                t: gallery.length,
              })}
              style={[styles.thumb, index === imageIndex ? styles.thumbOn : null]}
            >
              <Image source={source} contentFit="contain" style={styles.thumbImage} />
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );

  const info = (
    <View style={styles.info}>
      <Pressable
        onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: category } })}
        hitSlop={6}
        accessibilityRole="link"
        style={styles.categoryLink}
      >
        <AppText variant="label" color="primaryText">
          {getCategoryName(category)}
        </AppText>
        <Icon name="chevronRight" size={14} color="primaryText" strokeWidth={2.5} />
      </Pressable>

      <AppText variant="title" accessibilityRole="header">
        {current.name}
      </AppText>

      <View style={styles.metaRow}>
        {current.rating !== undefined ? (
          <View style={styles.rating}>
            <Icon name="star" size={16} color="primary" filled />
            <AppText variant="bodyStrong">
              {fillTemplate(strings.product.rating, { r: formatRating(current.rating) })}
            </AppText>
          </View>
        ) : null}
        <StockLine stock={current.stock} />
      </View>

      <View style={styles.priceRow}>
        <AppText variant="priceLarge">{formatPrice(finalPrice)}</AppText>
        {hasDiscount ? (
          <AppText variant="body" color="textSecondary" style={styles.oldPrice}>
            {formatPrice(current.price)}
          </AppText>
        ) : null}
      </View>

      <View style={styles.quantityRow}>
        <AppText variant="bodyStrong">{strings.product.quantity}</AppText>
        <QuantityStepper
          value={quantity}
          onIncrement={() => setQuantity((value) => value + 1)}
          onDecrement={() => setQuantity((value) => Math.max(1, value - 1))}
        />
      </View>

      {current.description ? (
        <View style={styles.description}>
          <AppText variant="subheading">{strings.product.description}</AppText>
          <AppText variant="body" color="textSecondary">
            {current.description}
          </AppText>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.root}>
      {topBar}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.body, landscape ? styles.bodyLandscape : null]}>
          {media}
          {info}
        </View>
        <RelatedProducts product={current} feedbackLift={FOOTER_LIFT} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <Button
          title={strings.product.buyNow}
          variant="secondary"
          fullWidth={false}
          disabled={soldOut}
          onPress={handleBuyNow}
          style={styles.footerButton}
        />
        <Button
          title={strings.product.addToCart}
          fullWidth={false}
          disabled={soldOut}
          onPress={() => addToCart(current, quantity)}
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xl, gap: spacing.xl },
  body: { gap: spacing.lg },
  bodyLandscape: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: spacing.md },

  media: { gap: spacing.ms, paddingHorizontal: spacing.md },
  mediaLandscape: { width: '42%', paddingHorizontal: 0 },
  mainImage: {
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceBrand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '82%', height: '82%' },
  discount: { position: 'absolute', top: spacing.md, left: spacing.md },
  thumbs: { gap: spacing.sm },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.surfaceBrand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbOn: { borderColor: colors.brand },
  thumbImage: { width: '80%', height: '80%' },

  info: { flex: 1, gap: spacing.ms, paddingHorizontal: spacing.md },
  categoryLink: { flexDirection: 'row', alignItems: 'center', gap: 2, alignSelf: 'flex-start' },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.ms },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, flexWrap: 'wrap' },
  oldPrice: { textDecorationLine: 'line-through' },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  description: { gap: spacing.xs },

  footer: {
    flexDirection: 'row',
    gap: spacing.ms,
    paddingTop: spacing.ms,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  footerButton: { flex: 1 },

  skeleton: { padding: spacing.md, gap: spacing.ms },
  skeletonMedia: { aspectRatio: 1, borderRadius: radius.lg },
});
