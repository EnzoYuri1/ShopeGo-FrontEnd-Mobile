import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  imageUrl: z.string(),
  images: z.array(z.string()).optional(),
  cardColor: z.string().min(1),
  discountPercent: z.number().min(0).max(100).optional(),
  accentColor: z.string().optional(),
  colorLabel: z.string().optional(),
  category: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  rating: z.number().min(0).max(5).optional(),
});

export type Product = z.infer<typeof productSchema>;
