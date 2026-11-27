import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Badge, ErrorState, Icon, Skeleton } from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
import { useCategories, type Category } from '@/features/categories/hooks/useCategories';
import { getCardImageSource } from '@/features/products/productImages';
import { useIsLandscape } from '@/hooks/useScreenWidth';
import { fillTemplate } from '@/utils/fillTemplate';

function countLabel(count: number): string {
  return count === 1
    ? strings.categories.productCountOne
    : fillTemplate(strings.categories.productCount, { n: count });
}

function CategoryTile({ category, onPress }: { category: Category; onPress: () => void }) {
  const cover = getCardImageSource(category.cover);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${countLabel(category.count)}`}
      style={({ pressed }) => [styles.tile, pressed ? styles.tilePressed : null]}
    >
      <View style={styles.tileMedia}>
        {cover ? (
          <Image
            source={cover}
            style={styles.tileImage}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={150}
          />
        ) : (
          <Icon name="grid" size={32} color="textDisabled" />
        )}
        {category.maxDiscount > 0 ? (
          <View style={styles.tileBadge}>
            <Badge
              label={fillTemplate(strings.categories.upTo, { p: category.maxDiscount })}
              tone="signal"
            />
          </View>
        ) : null}
      </View>
      <View style={styles.tileText}>
        <AppText variant="bodyStrong" numberOfLines={2}>
          {category.name}
        </AppText>
        <AppText variant="caption" color="textSecondary">
          {countLabel(category.count)}
        </AppText>
      </View>
    </Pressable>
  );
}

/** Aba Categorias: todas as categorias da API, em português, com capa e contagem. */
export function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const columns = useIsLandscape() ? 4 : 2;
  const { data: products = [], categories, isLoading, isError, refetch } = useCategories();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <FlatList
        key={columns}
        data={isLoading || (isError && categories.length === 0) ? [] : categories}
        keyExtractor={(item) => item.slug}
        numColumns={columns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="title" accessibilityRole="header">
              {strings.categories.title}
            </AppText>
            {categories.length > 0 ? (
              <AppText variant="body" color="textSecondary">
                {fillTemplate(strings.categories.subtitle, {
                  c: categories.length,
                  p: products.length,
                })}
              </AppText>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.skeletons}>
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} height={150} style={styles.skeleton} />
              ))}
            </View>
          ) : isError && categories.length === 0 ? (
            <ErrorState message={strings.home.loadError} onRetry={() => void refetch()} />
          ) : undefined
        }
        renderItem={({ item }) => (
          <View style={[styles.cell, { maxWidth: `${100 / columns}%` }]}>
            <CategoryTile
              category={item}
              onPress={() =>
                router.push({ pathname: '/category/[slug]', params: { slug: item.slug } })
              }
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, gap: spacing.ms },
  header: { gap: spacing.xs, paddingTop: spacing.md, paddingBottom: spacing.sm },
  row: { gap: spacing.ms },
  cell: { flex: 1 },
  tile: { flex: 1, gap: spacing.sm },
  tilePressed: { opacity: 0.85 },
  tileMedia: {
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceBrand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tileImage: { width: '70%', height: '80%' },
  tileBadge: { position: 'absolute', top: spacing.sm, left: spacing.sm },
  tileText: { gap: 2 },
  skeletons: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.ms },
  skeleton: { width: '47%' },
});
