import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Icon } from '@/components/ui';
import { colors, radius, spacing, strings, textVariants } from '@/constants';
import { getCategoryName } from '@/features/categories/categoryName';
import { categoryOf } from '@/features/categories/hooks/useCategories';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { useProducts } from '@/features/products/hooks/useProducts';
import { fillTemplate } from '@/utils/fillTemplate';

// minúsculas e sem acentos, para "perfume" achar "perfumes" e "relogio" achar "relógios"
function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// aba buscar: procura no nome do produto e no nome da categoria em português
export function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: products = [], isLoading, isError, refetch } = useProducts();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const term = normalize(query.trim());

  const results = useMemo(() => {
    if (!term) return products;
    return products.filter(
      (item) =>
        normalize(item.name).includes(term) ||
        normalize(getCategoryName(categoryOf(item))).includes(term),
    );
  }, [products, term]);

  let countLabel = fillTemplate(strings.search.allProducts, { n: results.length });
  if (term) {
    countLabel =
      results.length === 1
        ? strings.search.resultsOne
        : fillTemplate(strings.search.results, { n: results.length });
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.top}>
        <View style={[styles.field, focused ? styles.fieldFocused : null]}>
          <Icon name="search" size={20} color={focused ? 'text' : 'textSecondary'} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={strings.search.placeholder}
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel={strings.search.placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={styles.input}
            autoFocus
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query ? (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={strings.search.clear}
              style={styles.clear}
            >
              <Icon name="close" size={16} color="text" strokeWidth={2.5} />
            </Pressable>
          ) : null}
        </View>
        {!isLoading && !isError ? (
          <AppText variant="caption" color="textSecondary" accessibilityLiveRegion="polite">
            {countLabel}
          </AppText>
        ) : null}
      </View>

      <ProductGrid
        products={results}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        errorMessage={strings.home.loadError}
        empty={{
          title: fillTemplate(strings.search.emptyTitle, { q: query.trim() }),
          message: strings.search.emptyMessage,
          actionLabel: strings.search.exploreCategories,
          onAction: () => router.push('/categories'),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.md },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: colors.surfaceBrand,
  },
  fieldFocused: { borderColor: colors.brand, backgroundColor: colors.background },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontFamily: textVariants.body.fontFamily,
    fontSize: textVariants.body.fontSize,
  },
  clear: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceBrandStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
