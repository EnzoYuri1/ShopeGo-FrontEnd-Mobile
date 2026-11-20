import { z } from 'zod';

import { productSchema } from '@/features/products/types/product';

export const cartItemSchema = z.object({
  product: productSchema,
  quantity: z.number().int().positive(),
});

export type CartItem = z.infer<typeof cartItemSchema>;
