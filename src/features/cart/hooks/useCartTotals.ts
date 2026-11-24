import { useCart } from '@/features/cart/hooks/useCart';

/** Imposto aplicado sobre o subtotal (10%, conforme o Figma). */
export const TAX_RATE = 0.1;

export function useCartTotals() {
  const { subtotal } = useCart();
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));
  return { subtotal, tax, total };
}
