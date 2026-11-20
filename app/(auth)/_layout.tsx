import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/features/auth/hooks/useAuth';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Redirect href="/(drawer)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
