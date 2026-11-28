// configurações do app lidas de process.env.EXPO_PUBLIC_*
export type ProductsSource = 'firestore' | 'api';

const productsSource = process.env.EXPO_PUBLIC_PRODUCTS_SOURCE;

export const config = {
  // quando true, pedidos e perfil utilizam src/mocks como fallback local
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true') === 'true',
  // url base da api rest de produtos (dummyjson por padrão)
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://dummyjson.com',
  // cotação fixa usd->brl: a api devolve preços em dólar e o app exibe em reais
  usdToBrl: Number(process.env.EXPO_PUBLIC_USD_TO_BRL) || 5.5,
  // origem dos produtos: firestore (padrão) ou api rest
  productsSource: (productsSource === 'api' ? 'api' : 'firestore') as ProductsSource,
} as const;
