import type { Product } from '@/features/products/types/product';

// dados fictícios para desenvolvimento. não usar dados reais
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Camiseta de Pesca Masculina',
    price: 59.9,
    imageUrl: '',
    cardColor: '#CFF5D3',
    discountPercent: 10,
  },
  {
    id: '2',
    name: 'Smartwatch Ultrassônico',
    price: 129.9,
    imageUrl: '',
    cardColor: '#E3DEFF',
    discountPercent: 30,
  },
  {
    id: '3',
    name: 'Fone Bluetooth Air Pro',
    price: 99.9,
    imageUrl: '',
    cardColor: '#E3DEFF',
  },
  {
    id: '4',
    name: 'Tênis Esportivo Vermelho',
    price: 189.9,
    imageUrl: '',
    cardColor: '#FFD4D2',
    discountPercent: 15,
  },
  {
    id: '5',
    name: 'Perfume Floral Feminino',
    price: 79.9,
    imageUrl: '',
    cardColor: '#F5F6C2',
  },
  {
    id: '6',
    name: 'Blazer Social Premium',
    price: 219.9,
    imageUrl: '',
    cardColor: '#CFF5D3',
    discountPercent: 20,
  },
];
