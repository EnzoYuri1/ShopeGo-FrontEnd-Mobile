import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Chip, ScreenTopBar } from '@/components/ui';
import { colors, spacing, strings } from '@/constants';
import { getEffectivePrice } from '@/features/cart/hooks/useCart';
import {
  DEALS_CATEGORY,
  DEAL_MIN_DISCOUNT,
  getCategoryName,
  isDeal,
} from '@/features/categories/categoryName';
import { categoryOf, useCategories } from '@/features/categories/hooks/useCategories';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { fillTemplate } from '@/utils/fillTemplate';

type SortMode = 'relevance' | 'asc' | 'desc';

interface CategoryProductsScreenProps {
  slug: string;
}

/**
 * Produtos de uma categoria. O slug especial "ofertas" lista os produtos com desconto,
 * do maior para o menor (destino da campanha da Home).
 */
export function CategoryProductsScreen({ slug }: CategoryProductsScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: products = [], isLoading, isError, refetch } = useCategories();
  const [sortMode, setSortMode] = useState<SortMode>('relevance');
  const isDeals = slug === DEALS_CATEGORY;

  const list = useMemo(() => {
    let result = isDeals
      ? products.filter(isDeal).sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
      : products.filter((product) => categoryOf(product) === slug);
    if (sortMode === 'asc')
      result = [...result].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    if (sortMode === 'desc')
      result = [...result].sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    return result;
  }, [products, slug, isDeals, sortMode]);

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/categories');
  }

  const subtitle = isDeals
    ? fillTemplate(strings.categories.dealsSubtitle, { min: DEAL_MIN_DISCOUNT })
    : fillTemplate(
        list.length === 1 ? strings.categories.productCountOne : strings.categories.productCount,
        {
          n: list.length,
        },
      );

  const header = (
    <View style={styles.header}>
      <View style={styles.titleBlock}>
        <AppText variant="title" accessibilityRole="header">
          {getCategoryName(slug)}
        </AppText>
        {!isLoading ? (
          <AppText variant="body" color="textSecondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        <Chip
          label={strings.home.sortRelevance}
          selected={sortMode === 'relevance'}
          onPress={() => setSortMode('relevance')}
        />
        <Chip
          label={strings.home.sortAsc}
          selected={sortMode === 'asc'}
          onPress={() => setSortMode('asc')}
        />
        <Chip
          label={strings.home.sortDesc}
          selected={sortMode === 'desc'}
          onPress={() => setSortMode('desc')}
        />
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.root}>
      <ScreenTopBar onBack={handleBack} />
      <ProductGrid
        products={list}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        errorMessage={strings.home.loadError}
        header={header}
        bottomInset={insets.bottom}
        empty={{ title: strings.categories.notFound }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { gap: spacing.md, paddingBottom: spacing.xs },
  titleBlock: { gap: spacing.xs },
  chips: { gap: spacing.sm, paddingRight: spacing.md },
});
