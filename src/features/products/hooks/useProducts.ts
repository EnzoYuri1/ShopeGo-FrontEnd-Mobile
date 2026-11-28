import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

import {
  getProductById,
  getProducts,
  getProductsPage,
} from '@/features/products/services/productService';

export const productKeys = {
  all: ['products'] as const,
  paginated: (pageSize: number) => ['products', 'paginated', pageSize] as const,
  detail: (id: string) => ['products', id] as const,
};

export function useProducts(enabled = true) {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: getProducts,
    enabled,
  });
}

export function useInfiniteProducts(pageSize = 20) {
  return useInfiniteQuery({
    queryKey: productKeys.paginated(pageSize),
    queryFn: ({ pageParam }: { pageParam: QueryDocumentSnapshot | undefined }) =>
      getProductsPage(pageSize, pageParam),
    initialPageParam: undefined as QueryDocumentSnapshot | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.lastDoc : undefined),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
}
