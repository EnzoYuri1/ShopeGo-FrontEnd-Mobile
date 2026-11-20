import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { CustomDrawerContent } from '@/components/layout/CustomDrawerContent';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function DrawerLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    />
  );
}
