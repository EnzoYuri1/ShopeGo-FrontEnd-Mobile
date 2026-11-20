import type { Product } from '@/features/products/types/product';
import { useCartStore } from '@/store';

export function getEffectivePrice(product: Product): number {
  if (!product.discountPercent) {
    return product.price;
  }
  return Number((product.price * (1 - product.discountPercent / 100)).toFixed(2));
}

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(
    items
      .reduce((sum, item) => sum + getEffectivePrice(item.product) * item.quantity, 0)
      .toFixed(2),
  );

  return {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
