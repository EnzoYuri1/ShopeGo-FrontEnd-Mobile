import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { Button } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';

export function PaymentSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.root, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      <View style={styles.center}>
        <Svg width={140} height={140} viewBox="0 0 140 140" fill="none">
          <Circle cx={70} cy={70} r={68} fill="#2FB87A" />
          {/* Sombra diagonal do ícone (metade inferior mais escura). */}
          <Path d="M70 138A68 68 0 0 0 138 70L96 28 28 96z" fill="#0F9B63" opacity={0.55} />
          <Path
            d="M38 72l22 22 44-48"
            stroke={colors.white}
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>

        <Text style={styles.title}>{strings.checkout.successTitle}</Text>
        <Text style={styles.text}>{strings.checkout.successText}</Text>
      </View>

      <Button
        title={strings.checkout.backHome}
        onPress={() => router.replace('/(drawer)/(tabs)')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  title: {
    marginTop: 14,
    textAlign: 'center',
    fontFamily: fontFamily.interSemibold,
    fontSize: 19,
    color: '#6B6B6B',
  },
  text: {
    maxWidth: 260,
    textAlign: 'center',
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 17,
    color: '#6B6B6B',
  },
  button: {
    backgroundColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
});
