import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthHeader, Button, Input } from '@/components/ui';
import { colors, fontFamily, spacing, strings } from '@/constants';
import { useResetPassword } from '@/features/auth/hooks/useAuth';
import { forgotPasswordSchema } from '@/features/auth/types/auth';
import { getAuthErrorMessage } from '@/features/auth/utils/authError';

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  const resetMutation = useResetPassword();

  function handleSubmit() {
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }

    setError(undefined);
    resetMutation.mutate(parsed.data, {
      onSuccess: () => {
        router.push({ pathname: '/(auth)/verification', params: { email: parsed.data.email } });
      },
      onError: (err) => setError(getAuthErrorMessage(err)),
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader title={strings.auth.forgotTitle} onBack={() => router.back()} />

        <View style={styles.content}>
          <Text style={styles.subtitle}>{strings.auth.forgotSubtitle}</Text>

          <View style={styles.form}>
            <Input
              placeholder={strings.auth.emailPlaceholder}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              error={error}
            />
            <Button
              title={strings.auth.forgotButton}
              onPress={handleSubmit}
              loading={resetMutation.isPending}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 30,
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: fontFamily.semibold,
    fontSize: 20,
    lineHeight: 30,
    color: colors.textMuted,
    marginBottom: 32,
  },
  form: {
    gap: 53,
  },
});
