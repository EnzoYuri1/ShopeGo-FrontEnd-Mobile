/**
 * Configurações do app. Variáveis EXPO_PUBLIC_* são lidas do arquivo .env
 * (veja .env.example). Nunca coloque segredos aqui: tudo é visível no app.
 */
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  requestTimeoutMs: 15000,
  /** Enquanto o backend não existe, os services devolvem dados de src/mocks. */
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true') === 'true',
} as const;
