import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

interface FavoritesState {
  /** IDs dos produtos favoritados. */
  ids: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const storage = createJSONStorage(() =>
  Platform.OS === 'web' && typeof window === 'undefined' ? noopStorage : AsyncStorage,
);

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (productId) =>
        set((state) => ({
          ids: state.ids.includes(productId)
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId],
        })),
      remove: (productId) => set((state) => ({ ids: state.ids.filter((id) => id !== productId) })),
    }),
    { name: 'shopgo-favorites', storage },
  ),
);
