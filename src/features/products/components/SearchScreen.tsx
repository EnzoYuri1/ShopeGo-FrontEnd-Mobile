import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { BackButton, BrandLogo } from '@/components/ui';
import { colors, fontFamily, spacing, strings } from '@/constants';
import { useCart } from '@/features/cart/hooks/useCart';
import { useFavoritesStore } from '@/store';
import { ProductCard } from '@/features/products/components/ProductCard';
import { useGridColumns } from '@/hooks/useScreenWidth';
import { useProducts } from '@/features/products/hooks/useProducts';

export function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const columns = useGridColumns();
  const { data: products = [], isLoading } = useProducts();
  const { addItem } = useCart();
  const [query, setQuery] = useState('');
  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggle);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((item) => item.name.toLowerCase().includes(term));
  }, [products, query]);

  function handleClose() {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)');
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <BackButton variant="close" onPress={handleClose} />
        <BrandLogo />
      </View>

      <View style={styles.searchBar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={strings.search.placeholder}
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.input}
          autoFocus
          returnKeyType="search"
          autoCapitalize="none"
        />
        {query ? (
          <Pressable
            onPress={() => setQuery('')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={strings.search.clear}
            style={styles.clear}
          >
            <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 5l14 14M19 5L5 19"
                stroke={colors.black}
                strokeWidth={3.5}
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        key={columns}
        numColumns={columns}
        columnWrapperStyle={styles.column}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.lg }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.empty} />
          ) : (
            <Text style={styles.emptyText}>{strings.search.empty}</Text>
          )
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isFavorite={favoriteIds.includes(item.id)}
            onToggleFavorite={toggleFavorite}
            onAddToCart={(product) => addItem(product, 1)}
            onPress={(product) =>
              router.push({ pathname: '/product/[id]', params: { id: product.id } })
            }
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
  topBar: {
    height: 64,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  searchBar: {
    marginHorizontal: 17,
    marginBottom: 16,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.white,
    outlineStyle: 'none',
  } as object,
  clear: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 17,
    gap: 12,
  },
  column: {
    gap: 12,
  },
  empty: {
    marginTop: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.xl,
    textAlign: 'center',
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
