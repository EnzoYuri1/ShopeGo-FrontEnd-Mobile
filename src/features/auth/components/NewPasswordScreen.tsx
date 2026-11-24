import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AuthHeader, Button, Input } from '@/components/ui';
import { colors, fontFamily, spacing, strings } from '@/constants';
import { newPasswordSchema } from '@/features/auth/types/auth';

interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

export function NewPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit() {
    const parsed = newPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === 'password' && !nextErrors.password) nextErrors.password = issue.message;
        if (field === 'confirmPassword' && !nextErrors.confirmPassword) {
          nextErrors.confirmPassword = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    // A troca de senha por código depende do backend (o Firebase usa link por e-mail).
    Alert.alert(strings.common.soon, strings.auth.newPasswordUnavailable, [
      { text: strings.common.confirm, onPress: () => router.replace('/(auth)/login') },
    ]);
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
        <AuthHeader title={strings.auth.newPasswordTitle} onBack={() => router.back()} />

        <View style={styles.content}>
          <Text style={styles.subtitle}>{strings.auth.newPasswordSubtitle}</Text>

          <View style={styles.form}>
            <View style={styles.inputs}>
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
            </View>
            <Button title={strings.auth.newPasswordButton} onPress={handleSubmit} />
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
  inputs: {
    gap: 26,
  },
});
