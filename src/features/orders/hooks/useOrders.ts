import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  createOrder,
  getOrderById,
  getOrdersByUser,
} from '@/features/orders/services/orderService';
import type { CreateOrderInput } from '@/features/orders/types/order';
import { useCartStore } from '@/store';

export const orderKeys = {
  all: (userId: string) => ['orders', userId] as const,
  detail: (orderId: string) => ['orders', 'detail', orderId] as const,
};

export function useOrders() {
  const { user } = useAuth();
  const userId = user?.uid ?? '';

  return useQuery({
    queryKey: orderKeys.all(userId),
    queryFn: () => getOrdersByUser(userId),
    enabled: Boolean(userId),
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: Boolean(orderId),
  });
}

export function useCreateOrder() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: (input: CreateOrderInput) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      return createOrder(user.uid, input);
    },
    onSuccess: () => {
      clearCart();
      if (user) {
        queryClient.invalidateQueries({ queryKey: orderKeys.all(user.uid) });
      }
    },
  });
}
