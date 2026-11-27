import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, ScreenTopBar } from '@/components/ui';
import { colors, spacing, strings } from '@/constants';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useFavoritesStore } from '@/store';
import { fillTemplate } from '@/utils/fillTemplate';

/** Favoritos em grade, com o mesmo card da Home. Tocar no coração remove o produto. */
export function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: products = [], isLoading, isError, refetch } = useProducts();
  const ids = useFavoritesStore((state) => state.ids);

  const favorites = products.filter((product) => ids.includes(product.id));

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)');
  }

  const count =
    favorites.length === 1
      ? strings.favorites.countOne
      : fillTemplate(strings.favorites.count, { n: favorites.length });

  return (
    <View style={styles.root}>
      <ScreenTopBar onBack={handleBack} />
      <ProductGrid
        products={favorites}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        errorMessage={strings.home.loadError}
        bottomInset={insets.bottom}
        header={
          <View style={styles.header}>
            <AppText variant="title" accessibilityRole="header">
              {strings.favorites.title}
            </AppText>
            {favorites.length > 0 ? (
              <AppText variant="body" color="textSecondary">
                {count}
              </AppText>
            ) : null}
          </View>
        }
        empty={{
          title: strings.favorites.emptyTitle,
          message: strings.favorites.emptyMessage,
          actionLabel: strings.favorites.explore,
          onAction: () => router.push('/categories'),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { gap: spacing.xs, paddingBottom: spacing.sm },
});
