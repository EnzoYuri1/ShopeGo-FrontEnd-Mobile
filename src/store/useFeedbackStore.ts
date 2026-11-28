import { create } from 'zustand';

export interface Feedback {
  id: number;
  message: string;
  actionLabel?: string;
  actionHref?: '/cart';
  lift?: number;
}

interface FeedbackState {
  current: Feedback | null;
  show: (feedback: Omit<Feedback, 'id'>) => void;
  hide: () => void;
}

// aviso curto global ("adicionado ao carrinho"). exibido por `feedbackhost` no layout raiz
export const useFeedbackStore = create<FeedbackState>()((set) => ({
  current: null,
  show: (feedback) => set({ current: { ...feedback, id: Date.now() } }),
  hide: () => set({ current: null }),
}));
