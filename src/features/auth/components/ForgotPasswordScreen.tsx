import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Button, Input } from '@/components/ui';
import { strings } from '@/constants';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
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
    <AuthLayout
      title={strings.auth.forgotTitle}
      subtitle={strings.auth.forgotSubtitle.replace('\n', '. ')}
      onBack={() => router.back()}
    >
      <Input
        label={strings.auth.emailLabel}
        placeholder={strings.auth.emailExample}
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
    </AuthLayout>
  );
}
