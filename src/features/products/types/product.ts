import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  imageUrl: z.string(),
  /** Cor pastel de fundo do card (cada produto tem a sua no protótipo). */
  cardColor: z.string().min(1),
  /** Percentual de desconto, quando houver. */
  discountPercent: z.number().min(0).max(100).optional(),
  category: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
});

export type Product = z.infer<typeof productSchema>;
