/**
 * Configurações do app. Variáveis EXPO_PUBLIC_* são lidas do arquivo .env
 * (veja .env.example). Nunca coloque segredos aqui: tudo é visível no app.
 */
export type ProductsSource = 'api' | 'firestore' | 'mock';

const productsSource = process.env.EXPO_PUBLIC_PRODUCTS_SOURCE;

export const config = {
  /** Quando true, pedidos e perfil utilizam src/mocks como fallback local. */
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true') === 'true',
  /** URL base da API REST de produtos (DummyJSON por padrão). */
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://dummyjson.com',
  /** Cotação fixa USD→BRL: a API devolve preços em dólar e o app exibe em reais. */
  usdToBrl: Number(process.env.EXPO_PUBLIC_USD_TO_BRL) || 5.5,
  /** De onde os produtos vêm: API REST (padrão), Firestore ou mocks locais. */
  productsSource: (productsSource === 'firestore' || productsSource === 'mock'
    ? productsSource
    : 'api') as ProductsSource,
} as const;
