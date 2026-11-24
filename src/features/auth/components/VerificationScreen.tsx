import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackButton, Button, OtpInput } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import { useScreenWidth } from '@/hooks/useScreenWidth';

const OTP_LENGTH = 6;

const images = {
  verified: require('../../../../assets/images/onboarding/verified.svg'),
};

export function VerificationScreen() {
  const router = useRouter();
  const width = useScreenWidth();
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
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Elipse laranja decorativa na base da tela. */}
      <View
        pointerEvents="none"
        style={[styles.ellipse, { left: (width - 647) / 2 + 12, top: undefined, bottom: -346 }]}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackButton variant="close" onPress={() => router.back()} style={styles.close} />

        <Image source={images.verified} contentFit="contain" style={styles.illustration} />
        <Text style={styles.title}>{strings.auth.verificationTitle}</Text>
        <Text style={styles.subtitle}>{strings.auth.verificationSubtitle}</Text>

        <View style={styles.form}>
          <OtpInput value={code} onChange={setCode} length={OTP_LENGTH} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title={strings.common.confirm} onPress={handleConfirm} style={styles.button} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  ellipse: {
    position: 'absolute',
    width: 647,
    height: 572,
    borderRadius: 572,
    backgroundColor: colors.primary,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 30,
    alignItems: 'center',
  },
  close: {
    alignSelf: 'flex-start',
  },
  illustration: {
    width: 143,
    height: 144,
    marginTop: 0,
  },
  title: {
    marginTop: 12,
    fontFamily: fontFamily.medium,
    fontSize: 20,
    color: colors.black,
  },
  subtitle: {
    marginTop: 14,
    width: 236,
    textAlign: 'center',
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: '#494949',
  },
  form: {
    width: '100%',
    marginTop: 48,
    gap: 36,
  },
  error: {
    marginTop: -20,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.danger,
  },
  button: {
    width: '100%',
  },
});
