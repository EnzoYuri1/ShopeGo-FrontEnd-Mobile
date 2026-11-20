import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
import { useSignIn } from '@/features/auth/hooks/useAuth';
import { loginSchema } from '@/features/auth/types/auth';
import { getAuthErrorMessage } from '@/features/auth/utils/authError';

interface FieldErrors {
  email?: string;
  password?: string;
  form?: string;
}

export function LoginScreen() {
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
        <AuthHeader title={strings.auth.loginTitle} />

        <View style={styles.content}>
          <Text style={styles.subtitle}>{strings.auth.loginSubtitle}</Text>

          <View style={styles.form}>
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
              autoComplete="password"
              error={errors.password}
            />

            <Pressable
              style={styles.forgotLink}
              onPress={() =>
                Alert.alert(strings.common.soon, strings.auth.forgotPasswordUnavailable)
              }
            >
              <Text style={styles.forgotText}>{strings.auth.forgotPassword}</Text>
            </Pressable>

            {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

            <Button
              title={strings.auth.loginButton}
              onPress={handleSubmit}
              loading={signInMutation.isPending}
              style={styles.submitButton}
            />

            <Link href="/(auth)/register" asChild>
              <Pressable style={styles.secondaryLink}>
                <Text style={styles.secondaryText}>{strings.auth.createNewAccount}</Text>
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
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  forgotLink: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.text,
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
