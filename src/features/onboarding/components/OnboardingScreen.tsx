import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ImageStyle,
} from 'react-native';

import { Button, PagerDots } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { markOnboardingSeen } from '@/features/onboarding/storage';

/** Largura do frame de referência no Figma (iPhone 16). Posições são escaladas a partir dela. */
const DESIGN_WIDTH = 393;
const SLIDE_COUNT = 3;

const images = {
  slide1Ellipse: require('../../../../assets/images/onboarding/slide1-ellipse.svg'),
  slide1Illustration: require('../../../../assets/images/onboarding/slide1-illustration.png'),
  slide2Ellipse: require('../../../../assets/images/onboarding/slide2-ellipse.svg'),
  slide2Illustration: require('../../../../assets/images/onboarding/slide2-illustration.png'),
  slide3Ellipse: require('../../../../assets/images/onboarding/slide3-ellipse.svg'),
  slide3Illustration: require('../../../../assets/images/onboarding/slide3-illustration.png'),
  cartWhite: require('../../../../assets/images/onboarding/cart-white.svg'),
  cartOrange: require('../../../../assets/images/onboarding/cart-orange.svg'),
};

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

type Scale = (box: Box) => StyleProp<ImageStyle>;

export function OnboardingScreen() {
  const router = useRouter();
  const width = useScreenWidth();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const s = width / DESIGN_WIDTH;
  const place: Scale = (box) => ({
    position: 'absolute',
    left: box.left * s,
    top: box.top * s,
    width: box.width * s,
    height: box.height * s,
  });

  const slides = [
    <SlideOne key="1" place={place} s={s} />,
    <SlideTwo key="2" place={place} s={s} />,
    <SlideThree key="3" place={place} s={s} />,
  ];

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  }

  async function handleNext() {
    if (index < SLIDE_COUNT - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex(index + 1);
      return;
    }
    await markOnboardingSeen();
    router.replace('/discover');
  }

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <View style={{ width }}>{item}</View>}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
      />

      <View style={styles.footer}>
        <Button
          title={strings.onboarding.next}
          display
          onPress={handleNext}
          style={styles.nextButton}
        />
        <PagerDots count={SLIDE_COUNT} activeIndex={index} />
      </View>
    </View>
  );
}

interface SlideProps {
  place: Scale;
  s: number;
}

function SlideOne({ place, s }: SlideProps) {
  return (
    <View style={styles.slide}>
      <Image
        source={images.slide1Ellipse}
        contentFit="fill"
        style={place({ left: -92, top: -112, width: 681, height: 551.6 })}
      />
      <Image
        source={images.cartWhite}
        contentFit="contain"
        style={place({ left: 30, top: 46, width: 95.6, height: 73 })}
      />
      <Text style={[styles.onColorTitle, { left: 30 * s, top: 145 * s, fontSize: 32 * s }]}>
        {strings.onboarding.slide1Title}
      </Text>
      <View style={[styles.divider, { left: 30 * s, top: 201 * s, width: 313 * s }]} />
      <Text
        style={[
          styles.onColorText,
          { left: 32 * s, top: 232 * s, width: 241 * s, fontSize: 24 * s, lineHeight: 28 * s },
        ]}
      >
        {strings.onboarding.slide1Text}
      </Text>
      <Image
        source={images.slide1Illustration}
        contentFit="contain"
        style={place({ left: -45, top: 367, width: 463, height: 234 })}
      />
      <Text style={[styles.heading, { top: 619 * s, fontSize: 32 * s }]}>
        {strings.onboarding.slide1Heading}
      </Text>
      <Text style={[styles.caption, { top: 669 * s, fontSize: 16 * s }]}>
        {strings.onboarding.slide1Caption}
      </Text>
    </View>
  );
}

function SlideTwo({ place, s }: SlideProps) {
  return (
    <View style={styles.slide}>
      <Image
        source={images.slide2Ellipse}
        contentFit="fill"
        style={place({ left: -118.7, top: -397, width: 805.7, height: 695.7 })}
      />
      <Image
        source={images.cartOrange}
        contentFit="contain"
        style={place({ left: 13, top: 137, width: 95.6, height: 73 })}
      />
      <Image
        source={images.slide2Illustration}
        contentFit="contain"
        style={place({ left: 12, top: 362, width: 365, height: 243 })}
      />
      <Text style={[styles.heading, { top: 624 * s, fontSize: 24 * s }]}>
        {strings.onboarding.slide2Heading}
      </Text>
      <Text style={[styles.caption, { top: 668 * s, fontSize: 16 * s }]}>
        {strings.onboarding.slide2Caption}
      </Text>
    </View>
  );
}

function SlideThree({ place, s }: SlideProps) {
  return (
    <View style={styles.slide}>
      <Image
        source={images.slide3Ellipse}
        contentFit="fill"
        style={place({ left: -124.3, top: -149, width: 594.3, height: 520 })}
      />
      <Image
        source={images.cartWhite}
        contentFit="contain"
        style={place({ left: 30, top: 88, width: 95.6, height: 73 })}
      />
      <View style={[styles.divider, { left: 41 * s, top: 191 * s, width: 326 * s }]} />
      <Text
        style={[
          styles.onColorText,
          { left: 41 * s, top: 202 * s, width: 287 * s, fontSize: 24 * s, lineHeight: 30 * s },
        ]}
      >
        {strings.onboarding.slide3Text}
      </Text>
      <Image
        source={images.slide3Illustration}
        contentFit="contain"
        style={place({ left: 10, top: 336, width: 371, height: 291 })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  slide: {
    flex: 1,
    overflow: 'hidden',
  },
  onColorTitle: {
    position: 'absolute',
    fontFamily: fontFamily.interBold,
    color: colors.white,
  },
  onColorText: {
    position: 'absolute',
    fontFamily: fontFamily.interRegular,
    color: colors.white,
  },
  divider: {
    position: 'absolute',
    height: 1,
    backgroundColor: colors.white,
  },
  heading: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fontFamily.interSemibold,
    color: colors.black,
  },
  caption: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fontFamily.interSemibold,
    color: colors.black,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 33,
    alignItems: 'center',
    gap: 20,
  },
  nextButton: {
    width: 204,
    height: 63,
    paddingVertical: 10,
  },
});
