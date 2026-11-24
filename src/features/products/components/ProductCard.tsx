import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, fontSize, fontFamily, radius, spacing } from '@/constants';
import { getEffectivePrice } from '@/features/cart/hooks/useCart';
import { getCardImageSource } from '@/features/products/productImages';
import type { Product } from '@/features/products/types/product';
import { formatPrice } from '@/utils/formatPrice';

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  /** Toque no card (abre o detalhe do produto). */
  onPress?: (product: Product) => void;
}

export function ProductCard({
  product,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  onPress,
}: ProductCardProps) {
  const effectivePrice = getEffectivePrice(product);
  const imageSource = getCardImageSource(product);

  return (
    <Pressable
      onPress={() => onPress?.(product)}
      accessibilityRole="button"
      accessibilityLabel={product.name}
      style={[styles.card, { backgroundColor: product.cardColor }]}
    >
      <View style={styles.topRow}>
        <Pressable
          onPress={() => onToggleFavorite?.(product.id)}
          hitSlop={8}
          accessibilityLabel="Favoritar produto"
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={isFavorite ? colors.black : 'none'}
              stroke={colors.black}
              strokeWidth={1.8}
            />
          </Svg>
        </Pressable>

        {product.discountPercent ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>-{product.discountPercent}%</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} contentFit="contain" />
        ) : (
          <Svg width={56} height={56} viewBox="0 0 24 24" fill="none">
            <Path
              d="M6 7V6a6 6 0 1112 0v1h2a1 1 0 011 1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h2zm2 0h8V6a4 4 0 10-8 0v1z"
              fill="rgba(17, 17, 17, 0.14)"
            />
          </Svg>
        )}
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.price}>{formatPrice(effectivePrice)}</Text>

        <Pressable
          onPress={() => onAddToCart(product)}
          hitSlop={8}
          style={({ pressed }) => [styles.cartButton, pressed ? styles.pressed : null]}
          accessibilityLabel={`Adicionar ${product.name} ao carrinho`}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14.26l.03-.12L8.1 12h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020 3H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 14.37 5.48 16 7 16h12v-2H7.42c-.14 0-.25-.11-.26-.24z"
              fill={colors.black}
            />
          </Svg>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.md + 2,
    padding: spacing.sm + 4,
    minHeight: 205,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: colors.black,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fontFamily.bold,
  },
  imageContainer: {
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bold,
    color: colors.text,
    lineHeight: 16,
    minHeight: 32,
  },
  bottomRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
    color: colors.text,
  },
  cartButton: {
    padding: 4,
  },
  pressed: {
    opacity: 0.6,
  },
});
