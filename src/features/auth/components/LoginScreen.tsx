import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Input } from '@/components/ui';
import { spacing, strings } from '@/constants';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { SocialAuthButtons } from '@/features/auth/components/SocialAuthButtons';
import { useSignIn } from '@/features/auth/hooks/useAuth';
import { loginSchema } from '@/features/auth/types/auth';
import { getAuthErrorMessage } from '@/features/auth/utils/authError';

interface FieldErrors {
  email?: string;
  password?: string;
  form?: string;
}

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const signInMutation = useSignIn();

  function handleSubmit() {
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === 'email' && !nextErrors.email) nextErrors.email = issue.message;
        if (field === 'password' && !nextErrors.password) nextErrors.password = issue.message;
      }
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    signInMutation.mutate(parsed.data, {
      onError: (error) => {
        setErrors({ form: getAuthErrorMessage(error) });
      },
    });
  }

  return (
    <AuthLayout title={strings.auth.loginTitle} subtitle={strings.auth.loginSubtitle}>
      <Input
        label={strings.auth.emailLabel}
        placeholder={strings.auth.emailExample}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        error={errors.email}
      />
      <Input
        label={strings.auth.passwordLabel}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        error={errors.password}
      />
      <Pressable
        style={styles.forgot}
        onPress={() => router.push('/(auth)/forgot-password')}
        hitSlop={8}
        accessibilityRole="link"
      >
        <AppText variant="bodyStrong" color="primaryText">
          {strings.auth.forgotPassword}
        </AppText>
      </Pressable>

      {errors.form ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          {errors.form}
        </AppText>
      ) : null}

      <Button
        title={strings.auth.loginButton}
        onPress={handleSubmit}
        loading={signInMutation.isPending}
      />

      <View style={styles.switch}>
        <AppText variant="body" color="textSecondary">
          {strings.auth.noAccount}
        </AppText>
        <Pressable
          onPress={() => router.push('/(auth)/register')}
          hitSlop={8}
          accessibilityRole="link"
        >
          <AppText variant="bodyStrong" color="primaryText">
            {strings.auth.signUpLink}
          </AppText>
        </Pressable>
      </View>

      <SocialAuthButtons />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: 'flex-end' },
  switch: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
});
