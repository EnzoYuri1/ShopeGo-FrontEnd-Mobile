import { create } from 'zustand';

export interface Feedback {
  /** Muda a cada aviso, para reiniciar o tempo de exibição. */
  id: number;
  message: string;
  actionLabel?: string;
  /** Rota aberta pela ação (ex.: '/cart'). */
  actionHref?: '/cart';
  /** Distância acima da área segura inferior (padrão: acima da barra de abas). */
  lift?: number;
}

interface FeedbackState {
  current: Feedback | null;
  show: (feedback: Omit<Feedback, 'id'>) => void;
  hide: () => void;
}

/** Aviso curto global ("Adicionado ao carrinho"). Exibido por `FeedbackHost` no layout raiz. */
export const useFeedbackStore = create<FeedbackState>()((set) => ({
  current: null,
  show: (feedback) => set({ current: { ...feedback, id: Date.now() } }),
  hide: () => set({ current: null }),
}));
