import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AuthHeader, Button, Input } from '@/components/ui';
import { colors, fontSize, fontWeight, spacing, strings } from '@/constants';
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
      onSuccess: () => {
        router.replace('/(drawer)');
      },
      onError: (error) => {
        setErrors({ form: getAuthErrorMessage(error) });
      },
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
        <AuthHeader title={strings.auth.registerTitle} />

        <View style={styles.content}>
          <Text style={styles.subtitle}>{strings.auth.registerSubtitle}</Text>

          <View style={styles.form}>
            <Input
              placeholder={strings.auth.namePlaceholder}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              error={errors.name}
            />

            <Input
              placeholder={strings.auth.emailPlaceholder}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              error={errors.email}
            />

            <Input
              placeholder={strings.auth.passwordPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              error={errors.password}
            />

            <Input
              placeholder={strings.auth.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
              error={errors.confirmPassword}
            />

            {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

            <Button
              title={strings.auth.registerButton}
              onPress={handleSubmit}
              loading={signUpMutation.isPending}
              style={styles.submitButton}
            />

            <Link href="/(auth)/login" asChild>
              <Pressable style={styles.secondaryLink}>
                <Text style={styles.secondaryText}>{strings.auth.alreadyHaveAccount}</Text>
              </Pressable>
            </Link>
          </View>

          <SocialAuthButtons />
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
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  subtitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  formError: {
    fontSize: fontSize.sm,
    color: colors.danger,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  secondaryLink: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
  },
  secondaryText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
});
