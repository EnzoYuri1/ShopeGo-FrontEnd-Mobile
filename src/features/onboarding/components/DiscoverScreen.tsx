import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import { markOnboardingSeen } from '@/features/onboarding/storage';

const DESIGN_WIDTH = 393;

const images = {
  ellipse: require('../../../../assets/images/onboarding/ellipse-header.svg'),
  illustration: require('../../../../assets/images/onboarding/discover-illustration.svg'),
};

export function DiscoverScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const s = width / DESIGN_WIDTH;

  async function go(href: '/(auth)/login' | '/(auth)/register') {
    await markOnboardingSeen();
    router.replace(href);
  }

  return (
    <View style={styles.root}>
      <Image
        source={images.ellipse}
        contentFit="fill"
        style={{
          position: 'absolute',
          left: -254 * s,
          top: -184 * s,
          width: 647 * s,
          height: 572 * s,
        }}
      />
      <Image
        source={images.illustration}
        contentFit="contain"
        style={{
          position: 'absolute',
          left: (width - 320 * s) / 2,
          top: 195 * s,
          width: 320 * s,
          height: 302 * s,
        }}
      />

      <View style={[styles.texts, { top: 524 * s }]}>
        <Text style={[styles.title, { fontSize: 35 * s, lineHeight: 52 * s }]}>
          {strings.discover.title}
        </Text>
        <Text style={styles.description}>{strings.discover.description}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title={strings.discover.login}
          display
          onPress={() => go('/(auth)/login')}
          style={styles.loginButton}
        />
        <Button
          title={strings.discover.register}
          display
          variant="outline"
          onPress={() => go('/(auth)/register')}
          style={styles.registerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#F8F9FF',
  },
  texts: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 35,
    gap: 24,
  },
  title: {
    textAlign: 'center',
    fontFamily: fontFamily.semibold,
    color: '#050505',
  },
  description: {
    textAlign: 'center',
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.black,
  },
  actions: {
    position: 'absolute',
    left: 20,
    right: 15,
    bottom: 50,
    flexDirection: 'row',
    gap: 17,
  },
  loginButton: {
    flex: 144,
    width: undefined,
    height: 63,
    paddingVertical: 10,
  },
  registerButton: {
    flex: 180,
    width: undefined,
    height: 63,
    paddingVertical: 10,
  },
});
