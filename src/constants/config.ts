/**
 * Configurações do app. Variáveis EXPO_PUBLIC_* são lidas do arquivo .env
 * (veja .env.example). Nunca coloque segredos aqui: tudo é visível no app.
 */
export const config = {
  /** Quando true, os services utilizam src/mocks como fallback local. */
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true') === 'true',
} as const;
