import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppText, BrandLogo, Button, Chip, Icon, IconButton, RouteLine } from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
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

/** Quantas categorias aparecem como paradas na rota da Home (além de "Tudo"). */
const ROUTE_CATEGORIES = 4;

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  const {
    data: products = [],
    categories,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useCategories();

  const [stopIndex, setStopIndex] = useState(0);
  const [sortMode, setSortMode] = useState<SortMode>('relevance');
  const [onlyDiscount, setOnlyDiscount] = useState(false);

  const routeCategories = categories.slice(0, ROUTE_CATEGORIES);
  const stops = [
    { key: 'all', label: strings.home.all },
    ...routeCategories.map((category) => ({ key: category.slug, label: category.name })),
  ];
  const selectedSlug = stopIndex > 0 ? routeCategories[stopIndex - 1]?.slug : undefined;

  const deals = useMemo(() => products.filter(isDeal), [products]);
  const topDeal = useMemo(
    () =>
      deals.reduce<(typeof deals)[number] | undefined>(
        (best, item) => ((item.discountPercent ?? 0) > (best?.discountPercent ?? 0) ? item : best),
        undefined,
      ),
    [deals],
  );

  const visibleProducts = useMemo(() => {
    let list = products;
    if (selectedSlug) list = list.filter((product) => categoryOf(product) === selectedSlug);
    if (onlyDiscount) list = list.filter(isDeal);
    if (sortMode === 'asc')
      list = [...list].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    if (sortMode === 'desc')
      list = [...list].sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    return list;
  }, [products, selectedSlug, onlyDiscount, sortMode]);

  function clearFilters() {
    setStopIndex(0);
    setSortMode('relevance');
    setOnlyDiscount(false);
  }

  const header = (
    <View style={styles.header}>
      <Pressable
        onPress={() => router.push('/search')}
        accessibilityRole="search"
        accessibilityLabel={fillTemplate(strings.home.searchIn, { n: products.length })}
        style={({ pressed }) => [styles.search, pressed ? styles.searchPressed : null]}
      >
        <Icon name="search" size={20} color="textSecondary" />
        <AppText variant="body" color="textSecondary">
          {products.length > 0
            ? fillTemplate(strings.home.searchIn, { n: products.length })
            : strings.search.placeholder}
        </AppText>
      </Pressable>

      {routeCategories.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <AppText variant="subheading">{strings.home.exploreTitle}</AppText>
            <Pressable
              onPress={() => router.push('/categories')}
              hitSlop={8}
              accessibilityRole="link"
            >
              <AppText variant="bodyStrong" color="primaryText">
                {strings.home.seeAll}
              </AppText>
            </Pressable>
          </View>
          <RouteLine stops={stops} activeIndex={stopIndex} onSelect={setStopIndex} />
        </View>
      ) : null}

      {topDeal ? (
        <View style={styles.campaign}>
          <Svg
            width={120}
            height={96}
            viewBox="0 0 120 96"
            style={styles.campaignRoute}
            accessible={false}
          >
            <Path
              d="M4 92 C 40 92, 50 30, 112 22"
              fill="none"
              stroke={colors.primary}
              strokeWidth={3}
              strokeDasharray="2 8"
              strokeLinecap="round"
            />
            <Circle cx={112} cy={22} r={6} fill={colors.primary} />
          </Svg>
          <AppText variant="title" color="onBrand" style={styles.campaignTitle}>
            {fillTemplate(strings.home.dealsCount, { n: deals.length, min: DEAL_MIN_DISCOUNT })}
          </AppText>
          <AppText variant="body" color="onBrand" style={styles.campaignText}>
            {fillTemplate(strings.home.dealsUpTo, {
              p: topDeal.discountPercent ?? 0,
              c: getCategoryName(categoryOf(topDeal)).toLowerCase(),
            })}
          </AppText>
          <Button
            title={strings.home.dealsCta}
            size="md"
            fullWidth={false}
            icon="arrowRight"
            iconPosition="right"
            onPress={() =>
              router.push({ pathname: '/category/[slug]', params: { slug: DEALS_CATEGORY } })
            }
            style={styles.campaignCta}
          />
        </View>
      ) : null}

      <View style={styles.section}>
        <AppText variant="heading">
          {selectedSlug
            ? fillTemplate(strings.home.showcaseIn, { c: getCategoryName(selectedSlug) })
            : strings.home.showcaseAll}
        </AppText>
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
          <Chip
            label={strings.home.filterDiscount}
            icon="percent"
            selected={onlyDiscount}
            onPress={() => setOnlyDiscount((value) => !value)}
          />
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <IconButton
          icon="menu"
          accessibilityLabel={strings.home.openMenu}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
        <BrandLogo floating={false} size={26} style={styles.logo} />
        <IconButton
          icon="heart"
          accessibilityLabel={strings.home.openFavorites}
          onPress={() => router.push('/favorites')}
        />
      </View>

      <ProductGrid
        products={visibleProducts}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        errorMessage={strings.home.loadError}
        header={header}
        refreshing={isRefetching}
        onRefresh={() => void refetch()}
        empty={{
          title: strings.home.emptyTitle,
          message: strings.home.emptyMessage,
          actionLabel: strings.home.clearFilters,
          onAction: clearFilters,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  logo: { flex: 1, marginLeft: spacing.xs },
  header: { gap: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xs },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceBrand,
  },
  searchPressed: { backgroundColor: colors.surfaceBrandStrong },
  section: { gap: spacing.ms },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  campaign: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    padding: spacing.ml,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  campaignRoute: { position: 'absolute', right: -8, bottom: -4 },
  campaignTitle: { maxWidth: '80%' },
  campaignText: { maxWidth: '75%', opacity: 0.9 },
  campaignCta: { alignSelf: 'flex-start', marginTop: spacing.xs },
  chips: { gap: spacing.sm, paddingRight: spacing.md },
});
