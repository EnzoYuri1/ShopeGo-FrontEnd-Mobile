import { strings } from '@/constants';
import type { Product } from '@/features/products/types/product';

// slug usado para produtos sem categoria (ex.: dados de mock)
export const OTHER_CATEGORY = 'outros';
// slug especial: ofertas, do maior desconto para o menor
export const DEALS_CATEGORY = 'ofertas';

// desconto mínimo para um produto contar como oferta
export const DEAL_MIN_DISCOUNT = 15;

export function isDeal(product: Product): boolean {
  return (product.discountPercent ?? 0) >= DEAL_MIN_DISCOUNT;
}

// nome em português da categoria da api; se não houver tradução, formata o slug
export function getCategoryName(slug: string): string {
  if (slug === OTHER_CATEGORY) return strings.categories.other;
  if (slug === DEALS_CATEGORY) return strings.categories.deals;
  const translated = strings.categories.names[slug];
  if (translated) return translated;
  const words = slug.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
