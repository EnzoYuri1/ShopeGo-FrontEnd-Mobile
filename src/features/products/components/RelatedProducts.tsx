import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText, ErrorBanner } from '@/components/ui';
import { spacing, strings } from '@/constants';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { getCategoryName } from '@/features/categories/categoryName';
import { categoryOf } from '@/features/categories/hooks/useCategories';
import { ProductCard } from '@/features/products/components/ProductCard';
import { useProducts } from '@/features/products/hooks/useProducts';
import type { Product } from '@/features/products/types/product';
import { useFavoritesStore } from '@/store';
import { fillTemplate } from '@/utils/fillTemplate';

const MAX_RELATED = 8;
const CARD_WIDTH = 156;

interface RelatedProductsProps {
  product: Product;
  feedbackLift?: number;
}

// "mais em {categoria}": outros produtos da mesma categoria, os de melhor nota primeiro
export function RelatedProducts({ product, feedbackLift }: RelatedProductsProps) {
  const router = useRouter();
  const { data: products = [], isError, refetch } = useProducts();
  const addToCart = useAddToCart(feedbackLift);
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const category = categoryOf(product);

  const related = useMemo(
    () =>
      products
        .filter((item) => item.id !== product.id && categoryOf(item) === category)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, MAX_RELATED),
    [products, product.id, category],
  );

  if (isError && products.length === 0) {
    return (
      <View style={styles.section}>
        <View style={styles.errorWrap}>
          <ErrorBanner message={strings.errors.relatedLoadFailed} onRetry={() => void refetch()} />
        </View>
      </View>
    );
  }

  if (related.length === 0) return null;

  return (
    <View style={styles.section}>
      <AppText variant="heading" style={styles.title}>
        {fillTemplate(strings.product.related, { c: getCategoryName(category).toLowerCase() })}
      </AppText>
      <FlatList
        horizontal
        data={related}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <ProductCard
              product={item}
              isFavorite={favoriteIds.includes(item.id)}
              onToggleFavorite={toggleFavorite}
              onAddToCart={addToCart}
              onPress={(next) =>
                router.push({ pathname: '/product/[id]', params: { id: next.id } })
              }
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.ms },
  title: { paddingHorizontal: spacing.md },
  list: { gap: spacing.ms, paddingHorizontal: spacing.md },
  cell: { width: CARD_WIDTH },
  errorWrap: { paddingHorizontal: spacing.md },
});
