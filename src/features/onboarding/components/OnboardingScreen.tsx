import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button, RouteLine } from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
import { markOnboardingSeen } from '@/features/onboarding/storage';
import { useScreenWidth } from '@/hooks/useScreenWidth';

const SLIDES = [
  {
    key: 'explore',
    step: strings.onboarding.step1,
    title: strings.onboarding.slide1Heading,
    text: strings.onboarding.slide1Text,
    image: require('../../../../assets/images/onboarding/slide1-illustration.webp'),
  },
  {
    key: 'buy',
    step: strings.onboarding.step2,
    title: strings.onboarding.slide2Heading,
    text: strings.onboarding.slide2Caption,
    image: require('../../../../assets/images/onboarding/slide2-illustration.webp'),
  },
  {
    key: 'receive',
    step: strings.onboarding.step3,
    title: strings.onboarding.slide3Heading,
    text: strings.onboarding.slide3Text,
    image: require('../../../../assets/images/onboarding/slide3-illustration.webp'),
  },
];

const STOPS = SLIDES.map((slide) => ({ key: slide.key, label: slide.step }));

// apresentação em 3 passos (explore, compre, receba) com a linha de rota como progresso
export function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const width = useScreenWidth();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const last = index === SLIDES.length - 1;

  async function finish() {
    await markOnboardingSeen();
    router.replace('/discover');
  }

  function goTo(next: number) {
    listRef.current?.scrollToIndex({ index: next, animated: true });
    setIndex(next);
  }

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  }

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + spacing.sm, paddingBottom: Math.max(insets.bottom, spacing.md) },
      ]}
    >
      <View style={styles.top}>
        {!last ? (
          <Pressable onPress={() => void finish()} hitSlop={10} accessibilityRole="button">
            <AppText variant="bodyStrong" color="textSecondary">
              {strings.onboarding.skip}
            </AppText>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.media}>
              <Image
                source={item.image}
                contentFit="contain"
                style={styles.image}
                accessible={false}
              />
            </View>
            <View style={styles.copy}>
              <AppText variant="display" accessibilityRole="header">
                {item.title}
              </AppText>
              <AppText variant="body" color="textSecondary">
                {item.text}
              </AppText>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <RouteLine stops={STOPS} activeIndex={index} onSelect={goTo} progress />
        <Button
          title={last ? strings.onboarding.start : strings.onboarding.nextStep}
          icon={last ? undefined : 'arrowRight'}
          iconPosition="right"
          onPress={() => (last ? void finish() : goTo(index + 1))}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  top: {
    height: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  list: { flexGrow: 1 },
  slide: { flex: 1, paddingHorizontal: spacing.lg, gap: spacing.lg, justifyContent: 'center' },
  media: {
    flexShrink: 1,
    aspectRatio: 1,
    maxHeight: '60%',
    alignSelf: 'center',
    width: '100%',
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceBrand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '80%', height: '80%' },
  copy: { gap: spacing.sm },
  footer: { gap: spacing.lg, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
});
