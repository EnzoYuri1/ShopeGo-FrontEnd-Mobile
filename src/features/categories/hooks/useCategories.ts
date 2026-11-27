import { useMemo } from 'react';

import { OTHER_CATEGORY, getCategoryName } from '@/features/categories/categoryName';
import { useProducts } from '@/features/products/hooks/useProducts';
import type { Product } from '@/features/products/types/product';

export interface Category {
  slug: string;
  name: string;
  count: number;
  /** Maior desconto da categoria (0 quando não há). */
  maxDiscount: number;
  /** Produto usado como capa (o de melhor nota). */
  cover: Product;
}

/** Agrupa um produto pela categoria (ou "outros"). */
export function categoryOf(product: Product): string {
  return product.category || OTHER_CATEGORY;
}

/**
 * Categorias derivadas dos produtos já carregados (sem requisição extra).
 * Ordenadas da maior para a menor.
 */
export function useCategories() {
  const query = useProducts();
  const products = query.data;

  const categories = useMemo<Category[]>(() => {
    if (!products) return [];
    const groups = new Map<string, Product[]>();
    for (const product of products) {
      const slug = categoryOf(product);
      const list = groups.get(slug);
      if (list) list.push(product);
      else groups.set(slug, [product]);
    }
    return [...groups.entries()]
      .map(([slug, items]) => ({
        slug,
        name: getCategoryName(slug),
        count: items.length,
        maxDiscount: Math.max(0, ...items.map((item) => item.discountPercent ?? 0)),
        cover: items.reduce((best, item) =>
          (item.rating ?? 0) > (best.rating ?? 0) ? item : best,
        ),
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR'));
  }, [products]);

  return { ...query, categories };
}
