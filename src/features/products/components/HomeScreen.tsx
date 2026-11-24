import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { colors, fontSize, fontFamily, radius, spacing, strings } from '@/constants';
import { getEffectivePrice, useCart } from '@/features/cart/hooks/useCart';
import { ProductCard } from '@/features/products/components/ProductCard';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useFavoritesStore } from '@/store';
import type { Product } from '@/features/products/types/product';

type SortMode = 'default' | 'asc' | 'desc';

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  const { data: products = [], isLoading, isError, refetch, isRefetching } = useProducts();
  const { itemCount, addItem } = useCart();

  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggle);

  const visibleProducts = useMemo(() => {
    let list = products;

    if (onlyDiscount) {
      list = list.filter((item) => Boolean(item.discountPercent));
    }

    if (sortMode === 'asc') {
      list = [...list].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (sortMode === 'desc') {
      list = [...list].sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    }

    return list;
  }, [products, onlyDiscount, sortMode]);

  function cycleSortMode() {
    setSortMode((prev) => (prev === 'default' ? 'asc' : prev === 'asc' ? 'desc' : 'default'));
  }

  function handleAddToCart(product: Product) {
    addItem(product, 1);
    Alert.alert(strings.app.name, `${product.name} ${strings.home.addedToCart}`);
  }

  function handleOpenCart() {
    router.push('/cart');
  }

  function handleOpenSearch() {
    router.push('/search');
  }

  function handleOpenProduct(product: Product) {
    router.push({ pathname: '/product/[id]', params: { id: product.id } });
  }

  const sortLabel =
    sortMode === 'asc'
      ? strings.home.sortAsc
      : sortMode === 'desc'
        ? strings.home.sortDesc
        : `${strings.home.sortBy} ▾`;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          hitSlop={10}
          accessibilityLabel="Abrir menu"
        >
          <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 6h18M3 12h18M3 18h18"
              stroke={colors.text}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>

        <View style={styles.brand}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M6 7V6a6 6 0 1112 0v1h2a1 1 0 011 1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h2zm2 0h8V6a4 4 0 10-8 0v1z"
              fill={colors.primary}
            />
            <Path
              d="M9.5 14l2 2 4-4"
              stroke={colors.white}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.brandText}>{strings.app.name}</Text>
        </View>
      </View>

      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshing={isRefetching}
        onRefresh={() => void refetch()}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + spacing.lg }]}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.heroBanner}>
              <View style={styles.heroAccentCircle} />
              <Text style={styles.heroTag}>{strings.home.newRelease}</Text>
              <Text style={styles.heroTitle}>{strings.home.heroTitle}</Text>
            </View>

            <View style={styles.actionBar}>
              <View style={styles.actionLeft}>
                <Pressable style={styles.pillButton} onPress={cycleSortMode}>
                  <Text style={styles.pillText}>{sortLabel}</Text>
                </Pressable>

                <Pressable
                  style={[styles.pillButton, onlyDiscount ? styles.pillActive : null]}
                  onPress={() => setOnlyDiscount((prev) => !prev)}
                >
                  <Text style={styles.pillText}>
                    {onlyDiscount ? strings.home.filterDiscount : strings.home.filter}
                  </Text>
                </Pressable>

                <Pressable style={styles.cartPill} onPress={handleOpenCart}>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14.26l.03-.12L8.1 12h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020 3H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 14.37 5.48 16 7 16h12v-2H7.42c-.14 0-.25-.11-.26-.24z"
                      fill={colors.white}
                    />
                  </Svg>
                  {itemCount > 0 ? (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{itemCount}</Text>
                    </View>
                  ) : null}
                </Pressable>
              </View>

              <Pressable
                style={styles.searchButton}
                onPress={handleOpenSearch}
                accessibilityLabel="Buscar"
              >
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35"
                    stroke={colors.white}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </Svg>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.emptyState} />
          ) : (
            <Text style={styles.emptyText}>
              {isError ? strings.home.loadError : strings.home.emptyProducts}
            </Text>
          )
        }
        ListFooterComponent={
          visibleProducts.length > 0 ? (
            <View style={styles.promoBanner}>
              <Text style={styles.promoTitle}>{strings.home.promoTitle}</Text>
              <Pressable style={styles.promoCta} onPress={() => setOnlyDiscount(true)}>
                <Text style={styles.promoCtaText}>{strings.home.promoCta}</Text>
              </Pressable>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isFavorite={favoriteIds.includes(item.id)}
            onToggleFavorite={toggleFavorite}
            onAddToCart={handleAddToCart}
            onPress={handleOpenProduct}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandText: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm + 4,
  },
  columnWrapper: {
    gap: spacing.sm + 4,
  },
  listHeader: {
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  heroBanner: {
    backgroundColor: colors.black,
    borderRadius: radius.lg,
    padding: spacing.lg,
    minHeight: 132,
    justifyContent: 'center',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  heroAccentCircle: {
    position: 'absolute',
    left: -24,
    bottom: -32,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 106, 0, 0.25)',
  },
  heroTag: {
    color: colors.primaryLight,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
  },
  heroTitle: {
    marginTop: 4,
    color: colors.white,
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    flex: 1,
  },
  pillButton: {
    backgroundColor: '#3A3A3C',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 4,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.medium,
  },
  cartPill: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cartBadge: {
    backgroundColor: colors.black,
    borderRadius: radius.pill,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fontFamily.bold,
  },
  searchButton: {
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    marginTop: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.xl,
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  promoBanner: {
    marginTop: spacing.sm,
    backgroundColor: '#FF8A4C',
    borderRadius: radius.lg,
    padding: spacing.lg,
    minHeight: 112,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  promoTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: colors.white,
    maxWidth: '75%',
  },
  promoCta: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E1B4B',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 4,
  },
  promoCtaText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bold,
  },
});
