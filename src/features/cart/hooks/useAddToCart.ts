import { useCallback } from 'react';

import { strings } from '@/constants';
import { useCart } from '@/features/cart/hooks/useCart';
import type { Product } from '@/features/products/types/product';
import { useFeedbackStore } from '@/store';

// adiciona ao carrinho e mostra o aviso padrão com "ver carrinho"
export function useAddToCart(lift?: number) {
  const { addItem } = useCart();
  const show = useFeedbackStore((state) => state.show);

  return useCallback(
    (product: Product, quantity = 1) => {
      addItem(product, quantity);
      show({
        message: strings.feedback.addedToCart,
        actionLabel: strings.feedback.viewCart,
        actionHref: '/cart',
        lift,
      });
    },
    [addItem, show, lift],
  );
}
