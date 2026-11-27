import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Input } from '@/components/ui';
import { spacing, strings } from '@/constants';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { SocialAuthButtons } from '@/features/auth/components/SocialAuthButtons';
import { useSignUp } from '@/features/auth/hooks/useAuth';
import { registerSchema } from '@/features/auth/types/auth';
import { getAuthErrorMessage } from '@/features/auth/utils/authError';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const signUpMutation = useSignUp();

  function handleSubmit() {
    const parsed = registerSchema.safeParse({ name, email, password });
    const nextErrors: FieldErrors = {};

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === 'name' && !nextErrors.name) nextErrors.name = issue.message;
        if (field === 'email' && !nextErrors.email) nextErrors.email = issue.message;
        if (field === 'password' && !nextErrors.password) nextErrors.password = issue.message;
      }
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = strings.auth.passwordsDoNotMatch;
    }

    if (Object.keys(nextErrors).length > 0 || !parsed.success) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    signUpMutation.mutate(parsed.data, {
      onError: (error) => {
        setErrors({ form: getAuthErrorMessage(error) });
      },
    });
  }

  function goToLogin() {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/login');
  }

  return (
    <AuthLayout title={strings.auth.registerTitle} subtitle={strings.auth.registerSubtitle}>
      <Input
        label={strings.auth.nameLabel}
        value={name}
        onChangeText={setName}
        autoComplete="name"
        autoCapitalize="words"
        error={errors.name}
      />
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
        autoComplete="new-password"
        error={errors.password}
      />
      <Input
        label={strings.auth.confirmPasswordLabel}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      {errors.form ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          {errors.form}
        </AppText>
      ) : null}

      <Button
        title={strings.auth.registerButton}
        onPress={handleSubmit}
        loading={signUpMutation.isPending}
      />

      <View style={styles.switch}>
        <AppText variant="body" color="textSecondary">
          {strings.auth.haveAccount}
        </AppText>
        <Pressable onPress={goToLogin} hitSlop={8} accessibilityRole="link">
          <AppText variant="bodyStrong" color="primaryText">
            {strings.auth.signInLink}
          </AppText>
        </Pressable>
      </View>

      <SocialAuthButtons />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  switch: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
});
