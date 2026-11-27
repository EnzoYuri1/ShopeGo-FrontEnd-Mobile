import { useRouter } from 'expo-router';
import { useState } from 'react';

import { AppText, Button, OtpInput } from '@/components/ui';
import { strings } from '@/constants';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

const OTP_LENGTH = 6;

export function VerificationScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleConfirm() {
    if (code.length < OTP_LENGTH) {
      setError(strings.auth.otpInvalid);
      return;
    }
    setError(undefined);
    router.push('/(auth)/new-password');
  }

  return (
    <AuthLayout
      title={strings.auth.verificationTitle}
      subtitle={strings.auth.verificationSubtitle}
      onBack={() => router.back()}
    >
      <OtpInput value={code} onChange={setCode} length={OTP_LENGTH} error={Boolean(error)} />
      {error ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}
      <Button title={strings.common.confirm} onPress={handleConfirm} />
    </AuthLayout>
  );
}
