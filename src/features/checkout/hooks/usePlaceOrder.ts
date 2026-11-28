import { strings } from '@/constants';
import { getEffectivePrice, useCart } from '@/features/cart/hooks/useCart';
import { useCartTotals } from '@/features/cart/hooks/useCartTotals';
import { useCreateOrder } from '@/features/orders/hooks/useOrders';
import { useProfile } from '@/features/profile/hooks/useProfile';

// monta o pedido a partir do carrinho e o cria; `paymentmethod` ex.: "card:visa" ou "other"
export function usePlaceOrder() {
  const { items } = useCart();
  const { total } = useCartTotals();
  const { data: profile } = useProfile();
  const createOrder = useCreateOrder();

  function placeOrder(paymentMethod: string, onSuccess: () => void, onError: () => void) {
    createOrder.mutate(
      {
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          unitPrice: getEffectivePrice(item.product),
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
        })),
        total,
        shippingAddress: profile?.address?.trim() || strings.checkout.pendingAddress,
        paymentMethod,
      },
      { onSuccess, onError },
    );
  }

  return { placeOrder, isPlacing: createOrder.isPending, total, hasItems: items.length > 0 };
}
