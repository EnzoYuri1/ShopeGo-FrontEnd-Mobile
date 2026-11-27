import { Redirect, Stack } from 'expo-router';

import { CenteredColumn } from '@/components/layout/CenteredColumn';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Redirect href="/(drawer)/(tabs)" />;
  }

  return (
    <CenteredColumn>
      <Stack screenOptions={{ headerShown: false }} />
    </CenteredColumn>
  );
}
