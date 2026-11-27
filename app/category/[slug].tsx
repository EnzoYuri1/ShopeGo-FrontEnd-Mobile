import { useLocalSearchParams } from 'expo-router';

import { CategoryProductsScreen } from '@/features/categories/components/CategoryProductsScreen';

export default function CategoryRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <CategoryProductsScreen slug={slug ?? ''} />;
}
