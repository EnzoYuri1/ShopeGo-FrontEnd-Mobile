import { config } from '@/constants';

const DEFAULT_TIMEOUT_MS = 10000;

export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'parse';

/** Erro padronizado das chamadas à API (rede, tempo esgotado, HTTP ou resposta inválida). */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly kind: ApiErrorKind,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** GET em `config.apiUrl + path`, com tempo limite. Devolve o JSON sem validar. */
export async function apiGet(path: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${config.apiUrl}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new ApiError(`Erro HTTP ${response.status}`, 'http', response.status);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Tempo de resposta esgotado', 'timeout');
    }
    if (error instanceof SyntaxError) {
      throw new ApiError('Resposta inválida da API', 'parse');
    }
    throw new ApiError('Falha de conexão com a API', 'network');
  } finally {
    clearTimeout(timer);
  }
}
