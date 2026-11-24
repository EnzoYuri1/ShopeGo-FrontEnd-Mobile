import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/constants';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { hasSeenOnboarding } from '@/features/onboarding/storage';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);

  useEffect(() => {
    hasSeenOnboarding().then(setOnboardingSeen);
  }, []);

  if (isLoading || onboardingSeen === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isAuthenticated) return <Redirect href="/(drawer)" />;

  return <Redirect href={onboardingSeen ? '/(auth)/login' : '/onboarding'} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
