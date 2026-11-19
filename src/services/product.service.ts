import { config } from '@/constants';
import { mockProducts } from '@/mocks/products';
import type { Product } from '@/types';

import { api } from './api/client';

const fakeLatency = () => new Promise((resolve) => setTimeout(resolve, 300));

/**
 * Exemplo do padrão dos services: a tela chama a função e não sabe se o dado
 * vem do mock ou da API. Para integrar o backend, basta ajustar o endpoint.
 */
export async function getProducts(): Promise<Product[]> {
  if (config.useMocks) {
    await fakeLatency();
    return mockProducts;
  }
  return api.get<Product[]>('/products');
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (config.useMocks) {
    await fakeLatency();
    return mockProducts.find((product) => product.id === id);
  }
  return api.get<Product>(`/products/${id}`);
}
