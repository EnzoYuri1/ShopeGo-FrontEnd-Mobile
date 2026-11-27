import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Button, Input } from '@/components/ui';
import { strings } from '@/constants';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
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
    <AuthLayout
      title={strings.auth.newPasswordTitle}
      subtitle={strings.auth.newPasswordSubtitle}
      onBack={() => router.back()}
    >
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
      <Button title={strings.auth.newPasswordButton} onPress={handleSubmit} />
    </AuthLayout>
  );
}
