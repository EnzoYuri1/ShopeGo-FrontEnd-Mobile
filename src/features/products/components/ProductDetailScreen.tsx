import { Image, type ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton, BrandLogo, ErrorState, QuantityStepper } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import { getEffectivePrice, useCart } from '@/features/cart/hooks/useCart';
import { getCardImageSource, getProductImages } from '@/features/products/productImages';
import { useProduct } from '@/features/products/hooks/useProducts';
import { formatPrice } from '@/utils/formatPrice';

interface ProductDetailScreenProps {
  productId: string;
}

export function ProductDetailScreen({ productId }: ProductDetailScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: product, isLoading, isError, refetch } = useProduct(productId);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [variantIndex, setVariantIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  function handleClose() {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)');
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <BackButton variant="close" onPress={handleClose} style={styles.floatingClose} />
        <ErrorState message={strings.product.loadError} onRetry={() => void refetch()} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <BackButton variant="close" onPress={handleClose} style={styles.floatingClose} />
        <Text style={styles.notFound}>{strings.product.notFound}</Text>
      </View>
    );
  }

  const accent = product.accentColor ?? colors.primary;
  const images = getProductImages(product);
  // Sem set local (produto da API), a galeria vem de `product.images`.
  const remoteImages: ImageSource[] = (product.images ?? []).map((uri) => ({ uri }));
  const variants: ImageSource[] = images?.variants ?? remoteImages;
  const bannerSource = images
    ? variantIndex === 0
      ? images.banner
      : variants[variantIndex]
    : (variants[variantIndex] ?? getCardImageSource(product));

  function handleAdd() {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (!product) return;
    addItem(product, quantity);
    router.push('/cart');
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <BackButton variant="close" onPress={handleClose} />
        <BrandLogo />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.banner, { backgroundColor: product.cardColor }]}>
          {product.discountPercent ? (
            <View style={styles.discount}>
              <View style={styles.discountCircle}>
                <Text style={styles.discountValue}>{product.discountPercent}%</Text>
              </View>
              <Text style={styles.discountOff}>{strings.product.off}</Text>
            </View>
          ) : null}
          {bannerSource ? (
            <Image source={bannerSource} contentFit="contain" style={styles.bannerImage} />
          ) : null}
        </View>

        {variants.length > 1 ? (
          <View style={styles.dots}>
            {variants.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === variantIndex ? styles.dotOn : null]}
              />
            ))}
          </View>
        ) : (
          <View style={styles.dotsSpacer} />
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          {product.colorLabel ? <Text style={styles.colorLabel}>{product.colorLabel}</Text> : null}

          <View style={[styles.priceChip, { backgroundColor: accent }]}>
            <Text style={styles.price}>{formatPrice(getEffectivePrice(product))}</Text>
          </View>

          {variants.length > 0 ? (
            <>
              <Text style={styles.optionsLabel}>{strings.product.availableOptions}</Text>
              <View style={styles.variants}>
                {variants.map((source, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setVariantIndex(index)}
                    style={[styles.variant, index === variantIndex ? styles.variantOn : null]}
                  >
                    <Image source={source} contentFit="contain" style={styles.variantImage} />
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}

          <View style={styles.stepper}>
            <QuantityStepper
              value={quantity}
              onIncrement={() => setQuantity((q) => q + 1)}
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {added ? <Text style={styles.feedback}>{strings.product.addedFeedback}</Text> : null}
        <View style={styles.actions}>
          <Pressable
            onPress={handleBuyNow}
            style={({ pressed }) => [
              styles.buyButton,
              { backgroundColor: accent },
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.buyText}>{strings.product.buyNow}</Text>
          </Pressable>
          <Pressable
            onPress={handleAdd}
            style={({ pressed }) => [
              styles.addButton,
              { borderColor: accent },
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={[styles.addText, { color: accent }]} numberOfLines={1}>
              {strings.product.addToCart}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  floatingClose: {
    position: 'absolute',
    top: 40,
    left: 10,
  },
  notFound: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.textSecondary,
  },
  topBar: {
    height: 74,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 17,
    paddingBottom: 24,
  },
  banner: {
    height: 172,
    borderRadius: 8,
    overflow: 'hidden',
  },
  discount: {
    position: 'absolute',
    left: 24,
    top: 9,
    alignItems: 'flex-start',
  },
  discountCircle: {
    width: 67,
    height: 67,
    borderRadius: 34,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountValue: {
    fontFamily: fontFamily.badge,
    fontSize: 24,
    color: colors.white,
  },
  discountOff: {
    marginTop: 12,
    marginLeft: 13,
    fontFamily: fontFamily.heading,
    fontSize: 20,
    color: colors.black,
  },
  bannerImage: {
    position: 'absolute',
    right: 14,
    top: 8,
    width: 160,
    height: 160,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 17,
    height: 5,
  },
  dotsSpacer: {
    height: 22,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D9D9D9',
  },
  dotOn: {
    backgroundColor: '#6CB8FF',
  },
  info: {
    marginTop: 30,
    alignItems: 'flex-start',
  },
  name: {
    fontFamily: fontFamily.heading,
    fontSize: 24,
    lineHeight: 29,
    color: colors.black,
  },
  colorLabel: {
    marginTop: 14,
    fontFamily: fontFamily.heading,
    fontSize: 20,
    color: colors.black,
  },
  priceChip: {
    marginTop: 24,
    padding: 10,
    borderRadius: 10,
  },
  price: {
    fontFamily: fontFamily.price,
    fontSize: 20,
    color: colors.white,
  },
  optionsLabel: {
    marginTop: 10,
    fontFamily: fontFamily.heading,
    fontSize: 14,
    color: 'rgba(0,0,0,0.56)',
  },
  variants: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 26,
  },
  variant: {
    width: 108,
    height: 113,
    borderRadius: 10,
    backgroundColor: '#F2F5FF',
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantOn: {
    borderColor: '#2533C8',
  },
  variantImage: {
    width: 100,
    height: 100,
  },
  stepper: {
    marginTop: 28,
    marginLeft: 5,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 8,
    backgroundColor: colors.background,
  },
  feedback: {
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.success,
  },
  actions: {
    flexDirection: 'row',
    gap: 14,
  },
  buyButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyText: {
    fontFamily: fontFamily.interBold,
    fontSize: 20,
    color: colors.white,
  },
  addButton: {
    flex: 1.35,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontFamily: fontFamily.interBold,
    fontSize: 20,
  },
  pressed: {
    opacity: 0.85,
  },
});
