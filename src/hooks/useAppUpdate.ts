import * as Updates from 'expo-updates';
import { Alert } from 'react-native';
import { create } from 'zustand';

import { strings } from '@/constants';

interface AppUpdateState {
  isChecking: boolean;
  isDownloading: boolean;
  isModalVisible: boolean;
  error: string | null;
  checkForUpdates: (options?: { silent?: boolean }) => Promise<void>;
  applyUpdate: () => Promise<void>;
  dismissModal: () => void;
}

export const useAppUpdate = create<AppUpdateState>((set, get) => ({
  isChecking: false,
  isDownloading: false,
  isModalVisible: false,
  error: null,

  checkForUpdates: async ({ silent = false } = {}) => {
    if (get().isChecking || get().isDownloading) return;

    if (__DEV__ || !Updates.isEnabled) {
      if (!silent) {
        Alert.alert(strings.app.name, strings.updates.unavailableMessage);
      }
      return;
    }

    set({ isChecking: true, error: null });
    try {
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        set({ isModalVisible: true });
      } else if (!silent) {
        Alert.alert(strings.updates.upToDateTitle, strings.updates.upToDateMessage);
      }
    } catch {
      if (!silent) {
        Alert.alert(strings.app.name, strings.updates.errorMessage);
      }
    } finally {
      set({ isChecking: false });
    }
  },

  applyUpdate: async () => {
    if (get().isDownloading) return;

    set({ isDownloading: true, error: null });
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch {
      set({ error: strings.updates.errorMessage, isDownloading: false });
    }
  },

  dismissModal: () => {
    if (!get().isDownloading) {
      set({ isModalVisible: false, error: null });
    }
  },
}));
