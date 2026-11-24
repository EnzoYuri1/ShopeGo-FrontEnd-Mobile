import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { ScreenHeader } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import { getEffectivePrice } from '@/features/cart/hooks/useCart';
import { useProducts } from '@/features/products/hooks/useProducts';
import { getCardImageSource } from '@/features/products/productImages';
import type { Product } from '@/features/products/types/product';
import { useFavoritesStore } from '@/store';
import { formatPrice } from '@/utils/formatPrice';

export function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: products = [] } = useProducts();
  const ids = useFavoritesStore((state) => state.ids);
  const remove = useFavoritesStore((state) => state.remove);

  const favorites = products.filter((product) => ids.includes(product.id));

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)');
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title={strings.favorites.title} onBack={handleBack} />

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>{strings.favorites.empty}</Text>}
        renderItem={({ item }) => (
          <FavoriteRow
            product={item}
            onOpen={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
            onRemove={() => remove(item.id)}
          />
        )}
      />
    </View>
  );
}

interface FavoriteRowProps {
  product: Product;
  onOpen: () => void;
  onRemove: () => void;
}

function FavoriteRow({ product, onOpen, onRemove }: FavoriteRowProps) {
  const source = getCardImageSource(product);

  return (
    <Pressable onPress={onOpen} style={[styles.row, { backgroundColor: product.cardColor }]}>
      <View style={styles.thumb}>
        {source ? <Image source={source} contentFit="contain" style={styles.thumbImage} /> : null}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(getEffectivePrice(product))}</Text>
      </View>

      <Pressable
        onPress={onRemove}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={strings.favorites.remove}
        style={styles.heart}
      >
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={colors.danger}
          />
        </Svg>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: 19,
    paddingTop: 28,
    gap: 16,
  },
  empty: {
    marginTop: 60,
    textAlign: 'center',
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.textSecondary,
  },
  row: {
    minHeight: 112,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.35)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(6,6,6,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    width: 70,
    height: 70,
  },
  info: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingRight: 18,
  },
  name: {
    fontFamily: fontFamily.heading,
    fontSize: 15,
    lineHeight: 19,
    color: colors.black,
  },
  price: {
    marginTop: 10,
    alignSelf: 'flex-end',
    fontFamily: fontFamily.inriaBold,
    fontSize: 14,
    color: 'rgba(0,0,0,0.67)',
  },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
