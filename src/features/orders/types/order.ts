import { z } from 'zod';

export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  imageUrl: z.string(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
  total: z.number().nonnegative(),
  status: orderStatusSchema,
  shippingAddress: z.string().min(1),
  paymentMethod: z.string().min(1),
  createdAt: z.string().optional(),
});

export type Order = z.infer<typeof orderSchema>;

export const createOrderSchema = orderSchema.pick({
  items: true,
  total: true,
  shippingAddress: true,
  paymentMethod: true,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
