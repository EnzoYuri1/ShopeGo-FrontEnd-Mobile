import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, BrandLogo, Button } from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
import { markOnboardingSeen } from '@/features/onboarding/storage';

const illustration = require('../../../../assets/images/onboarding/discover-illustration.svg');

/** Fim da apresentação: escolher entre entrar e criar conta. */
export function DiscoverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  async function go(href: '/(auth)/login' | '/(auth)/register') {
    await markOnboardingSeen();
    router.replace(href);
  }

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + spacing.md, paddingBottom: Math.max(insets.bottom, spacing.md) },
      ]}
    >
      <BrandLogo floating={false} size={30} />

      <View style={styles.media}>
        <Image source={illustration} contentFit="contain" style={styles.image} accessible={false} />
      </View>

      <View style={styles.copy}>
        <AppText variant="display" accessibilityRole="header">
          {strings.discover.title}
        </AppText>
        <AppText variant="body" color="textSecondary">
          {strings.discover.description}
        </AppText>
      </View>

      <View style={styles.actions}>
        <Button title={strings.discover.login} onPress={() => void go('/(auth)/login')} />
        <Button
          title={strings.discover.register}
          variant="outline"
          onPress={() => void go('/(auth)/register')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  media: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceBrand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '78%', height: '78%' },
  copy: { gap: spacing.sm },
  actions: { gap: spacing.ms },
});
