import { useRouter } from 'expo-router';
import { useState, type ReactElement } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { AppText, EmptyState, ErrorBanner, ErrorState, Skeleton } from '@/components/ui';
import { colors, spacing, strings } from '@/constants';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { ProductCard } from '@/features/products/components/ProductCard';
import type { Product } from '@/features/products/types/product';
import { useGridColumns } from '@/hooks/useScreenWidth';
import { useFavoritesStore } from '@/store';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  errorMessage: string;
  header?: ReactElement;
  empty: { title: string; message?: string; actionLabel?: string; onAction?: () => void };
  refreshing?: boolean;
  onRefresh?: () => void;
  bottomInset?: number;
}

const SKELETON_COUNT = 6;
const PAGE_SIZE = 12;

// completa a última linha com espaços vazios, para o último card não esticar
function fillLastRow(products: Product[], columns: number): (Product | null)[] {
  const remainder = products.length % columns;
  if (remainder === 0) return products;
  return [...products, ...Array<null>(columns - remainder).fill(null)];
}

function GridSkeleton({ columns }: { columns: number }) {
  return (
    <View style={styles.skeletonGrid}>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <View key={index} style={[styles.skeletonCell, { width: `${100 / columns}%` }]}>
          <Skeleton style={styles.skeletonMedia} />
          <Skeleton height={12} width="85%" rounded="xs" />
          <Skeleton height={18} width="50%" rounded="xs" />
        </View>
      ))}
    </View>
  );
}

/** Grade de produtos com carregamento, erro e vazio. Colunas: 2 em retrato, 4 em paisagem. */
export function ProductGrid({
  products,
  isLoading,
  isError,
  onRetry,
  errorMessage,
  header,
  empty,
  refreshing = false,
  onRefresh,
  bottomInset = 0,
}: ProductGridProps) {
  const router = useRouter();
  const columns = useGridColumns();
  const addToCart = useAddToCart();
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const [prevProducts, setPrevProducts] = useState(products);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (products !== prevProducts) {
    setPrevProducts(products);
    setVisibleCount(PAGE_SIZE);
  }

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  function handleLoadMore() {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, products.length));
    }
  }

  // Erro em tela cheia só sem dados; com cache visível, mostra aviso no topo.
  const showError = isError && products.length === 0;
  const showRefreshError = isError && products.length > 0;

  let emptyComponent: ReactElement;
  if (isLoading) emptyComponent = <GridSkeleton columns={columns} />;
  else if (showError) emptyComponent = <ErrorState message={errorMessage} onRetry={onRetry} />;
  else emptyComponent = <EmptyState icon="search" {...empty} />;

  return (
    <FlatList
      key={columns}
      data={isLoading || showError ? [] : fillLastRow(visibleProducts, columns)}
      keyExtractor={(item, index) => item?.id ?? `spacer-${index}`}
      numColumns={columns}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, { paddingBottom: bottomInset + spacing.xl }]}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.4}
      ListHeaderComponent={
        header || showRefreshError ? (
          <View style={styles.headerWrap}>
            {header}
            {showRefreshError ? (
              <ErrorBanner message={strings.errors.refreshFailed} onRetry={onRetry} />
            ) : null}
          </View>
        ) : undefined
      }
      ListEmptyComponent={emptyComponent}
      ListFooterComponent={
        !isLoading && !showError && hasMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.primary} />
            <AppText variant="caption" color="textSecondary">
              {strings.home.loadingMore}
            </AppText>
          </View>
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
      removeClippedSubviews
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
      renderItem={({ item }) =>
        item === null ? (
          <View style={styles.cell} />
        ) : (
          <View style={styles.cell}>
            <ProductCard
              product={item}
              isFavorite={favoriteIds.includes(item.id)}
              onToggleFavorite={toggleFavorite}
              onAddToCart={addToCart}
              onPress={(product) =>
                router.push({ pathname: '/product/[id]', params: { id: product.id } })
              }
            />
          </View>
        )
      }
    />
  );
}

const GAP = spacing.ms;

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, gap: spacing.ml },
  headerWrap: { gap: spacing.md },
  row: { gap: GAP },
  cell: { flex: 1 },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -GAP / 2,
    rowGap: spacing.ml,
  },
  skeletonCell: { paddingHorizontal: GAP / 2, gap: spacing.sm },
  skeletonMedia: { aspectRatio: 1 },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
});
