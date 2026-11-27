import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { FeedbackHost } from '@/components/layout/FeedbackHost';
import { UpdateModal } from '@/components/ui';
import { appFonts, colors } from '@/constants';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { MAX_APP_WIDTH, useIsLandscape } from '@/hooks/useScreenWidth';

// Mantém a splash visível até as fontes carregarem (evita troca de fonte na tela).
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(appFonts);
  const isLandscape = useIsLandscape();
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
    <View style={styles.page}>
      <View style={[styles.frame, isLandscape && styles.frameLandscape]}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false }} />
              <FeedbackHost />
              <UpdateModal />
            </AuthProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </View>
    </View>
  );
}

// No web o app fica numa moldura mobile centralizada (o layout segue o frame de 393 px do Figma).
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? colors.surfaceBrandStrong : 'transparent',
  },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? MAX_APP_WIDTH : undefined,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  // Em paisagem a moldura mobile é liberada para ocupar toda a largura.
  frameLandscape: {
    maxWidth: undefined,
  },
});
