// configurações do app
export type ProductsSource = 'api' | 'firestore' | 'mock';

const productsSource = process.env.EXPO_PUBLIC_PRODUCTS_SOURCE;

export const config = {
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true') === 'true',
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://dummyjson.com',
  usdToBrl: Number(process.env.EXPO_PUBLIC_USD_TO_BRL) || 5.5,
  productsSource: (productsSource === 'firestore' || productsSource === 'mock'
    ? productsSource
    : 'api') as ProductsSource,
} as const;
