import { useLocalSearchParams } from 'expo-router';

import { ProductDetailScreen } from '@/features/products/components/ProductDetailScreen';

export default function ProductRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductDetailScreen productId={id ?? ''} />;
}
