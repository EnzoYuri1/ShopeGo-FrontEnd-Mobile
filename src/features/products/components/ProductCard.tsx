import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Badge, Icon } from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
import { getEffectivePrice } from '@/features/cart/hooks/useCart';
import { getCardImageSource } from '@/features/products/productImages';
import type { Product } from '@/features/products/types/product';
import { fillTemplate } from '@/utils/fillTemplate';
import { formatPrice } from '@/utils/formatPrice';

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  /** Toque no card (abre o detalhe do produto). */
  onPress?: (product: Product) => void;
}

function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',');
}

/**
 * Card de produto da marca: foto sobre painel Céu, selo de desconto, nome em 2 linhas,
 * nota, preço final (com o antigo riscado) e botão de adicionar.
 */
export function ProductCard({
  product,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  onPress,
}: ProductCardProps) {
  const finalPrice = getEffectivePrice(product);
  const imageSource = getCardImageSource(product);
  const hasDiscount = Boolean(product.discountPercent);

  return (
    <Pressable
      onPress={() => onPress?.(product)}
      accessibilityRole="button"
      accessibilityLabel={product.name}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <View style={styles.media}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.image}
            contentFit="contain"
            transition={150}
            cachePolicy="memory-disk"
            recyclingKey={product.id}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <Icon name="bag" size={40} color="textDisabled" />
        )}

        {hasDiscount ? (
          <View style={styles.badge}>
            <Badge label={`-${product.discountPercent}%`} tone="signal" />
          </View>
        ) : null}

        {onToggleFavorite ? (
          <Pressable
            onPress={() => onToggleFavorite(product.id)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? strings.productCard.unfavorite : strings.productCard.favorite
            }
            accessibilityState={{ selected: isFavorite }}
            style={styles.favorite}
          >
            <Icon
              name="heart"
              size={18}
              color={isFavorite ? 'primary' : 'text'}
              filled={isFavorite}
            />
          </Pressable>
        ) : null}
      </View>

      <AppText variant="caption" numberOfLines={2} style={styles.name}>
        {product.name}
      </AppText>

      {product.rating !== undefined ? (
        <View
          style={styles.rating}
          accessible
          accessibilityLabel={fillTemplate(strings.productCard.rating, {
            r: formatRating(product.rating),
          })}
        >
          <Icon name="star" size={12} color="primary" filled />
          <AppText variant="label" color="textSecondary">
            {formatRating(product.rating)}
          </AppText>
        </View>
      ) : null}

      <View style={styles.footer}>
        <View
          style={styles.prices}
          accessible
          accessibilityLabel={
            hasDiscount
              ? fillTemplate(strings.productCard.priceFrom, {
                  old: formatPrice(product.price),
                  now: formatPrice(finalPrice),
                })
              : formatPrice(finalPrice)
          }
        >
          <AppText variant="price" numberOfLines={1}>
            {formatPrice(finalPrice)}
          </AppText>
          {hasDiscount ? (
            <AppText
              variant="label"
              color="textSecondary"
              style={styles.oldPrice}
              numberOfLines={1}
            >
              {formatPrice(product.price)}
            </AppText>
          ) : null}
        </View>

        <Pressable
          onPress={() => onAddToCart(product)}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={fillTemplate(strings.productCard.addToCart, { name: product.name })}
          style={({ pressed }) => [styles.add, pressed ? styles.addPressed : null]}
        >
          <Icon name="plus" size={20} color="onPrimary" strokeWidth={2.5} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: spacing.xs + 2 },
  pressed: { opacity: 0.85 },
  media: {
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceBrand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '82%', height: '82%' },
  badge: { position: 'absolute', top: spacing.sm, left: spacing.sm },
  favorite: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { minHeight: 36, marginTop: spacing.xxs },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  prices: { flexShrink: 1 },
  oldPrice: { textDecorationLine: 'line-through' },
  add: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPressed: { backgroundColor: colors.primaryPressed },
});
