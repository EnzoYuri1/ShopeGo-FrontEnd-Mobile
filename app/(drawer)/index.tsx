import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { colors, fontSize, fontWeight, spacing, strings } from '@/constants';
import { useAuth, useSignOut } from '@/features/auth/hooks/useAuth';
import { useAppUpdate } from '@/hooks/useAppUpdate';

export default function AuthenticatedHomePlaceholder() {
  const { user } = useAuth();
  const signOutMutation = useSignOut();
  const { isChecking, checkForUpdates } = useAppUpdate();

  function handleSignOut() {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace('/(auth)/login');
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.app.name}</Text>
      <Text style={styles.subtitle}>{strings.auth.welcomeAuthenticated}</Text>
      <Text style={styles.email}>{user?.displayName || user?.email}</Text>

      <View style={styles.actions}>
        <Button
          title={isChecking ? strings.updates.checking : strings.updates.checkButton}
          onPress={() => void checkForUpdates()}
          loading={isChecking}
        />

        <Button
          title={strings.auth.logout}
          onPress={handleSignOut}
          loading={signOutMutation.isPending}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  email: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  actions: {
    width: '100%',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
});
