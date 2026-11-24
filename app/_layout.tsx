import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { UpdateModal } from '@/components/ui';
import { appFonts } from '@/constants';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';

// Mantém a splash visível até as fontes carregarem (evita troca de fonte na tela).
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(appFonts);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  );

  const fontsReady = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
          <UpdateModal />
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
