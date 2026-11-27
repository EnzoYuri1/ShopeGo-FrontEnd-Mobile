import { z } from 'zod';

import { config } from '@/constants';
import { productSchema, type Product } from '@/features/products/types/product';
import { ApiError, apiGet } from '@/services/api/client';

// `limit=0` faz a api devolver o catálogo inteiro (194 itens), para a busca cobrir tudo
const PRODUCTS_LIMIT = 0;

// cores pastel dos cards, repetidas em rotação (a api não fornece cor)
const CARD_COLORS = ['#CFF5D3', '#E3DEFF', '#F5F6C2', '#FFD4D2', '#D6EBFF', '#FFE6C7'];

const apiProductSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  discountPercentage: z.number().optional(),
  category: z.string().optional(),
  stock: z.number().optional(),
  rating: z.number().optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
});

const apiListSchema = z.object({ products: z.array(apiProductSchema) });

type ApiProduct = z.infer<typeof apiProductSchema>;

function toProduct(item: ApiProduct): Product {
  const discount = Math.min(100, Math.max(0, Math.round(item.discountPercentage ?? 0)));
  const images = item.images ?? [];

  return productSchema.parse({
    id: String(item.id),
    name: item.title,
    description: item.description,
    price: Math.round(item.price * config.usdToBrl * 100) / 100,
    imageUrl: item.thumbnail ?? images[0] ?? '',
    images,
    cardColor: CARD_COLORS[item.id % CARD_COLORS.length],
    discountPercent: discount > 0 ? discount : undefined,
    category: item.category,
    stock: item.stock === undefined ? undefined : Math.max(0, Math.round(item.stock)),
    rating: item.rating === undefined ? undefined : Math.min(5, Math.max(0, item.rating)),
  });
}

function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError('Resposta inesperada da API', 'parse');
  }
  return result.data;
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await apiGet(`/products?limit=${PRODUCTS_LIMIT}`);
  return parseOrThrow(apiListSchema, data).products.map(toProduct);
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const data = await apiGet(`/products/${encodeURIComponent(id)}`);
    return toProduct(parseOrThrow(apiProductSchema, data));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}
