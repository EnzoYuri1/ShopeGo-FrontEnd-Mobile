import type { Order } from '@/features/orders/types/order';

/** Pedidos FICTÍCIOS para desenvolvimento (modo EXPO_PUBLIC_USE_MOCKS=true). */
export const mockOrders: Order[] = [
  {
    id: 'mock-1',
    userId: 'mock',
    items: [
      {
        productId: '3',
        name: 'Fone Bluetooth Air Pro',
        unitPrice: 99.9,
        quantity: 1,
        imageUrl: '',
      },
    ],
    total: 109.89,
    status: 'shipped',
    shippingAddress: 'Endereço a definir',
    paymentMethod: 'card:visa',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-2',
    userId: 'mock',
    items: [
      {
        productId: '2',
        name: 'Smartwatch Ultrassônico',
        unitPrice: 90.93,
        quantity: 2,
        imageUrl: '',
      },
    ],
    total: 200,
    status: 'delivered',
    shippingAddress: 'Endereço a definir',
    paymentMethod: 'other',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
