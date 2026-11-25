import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton, BrandLogo } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';

const images = {
  gift: require('../../../../assets/images/offers/gift.webp'),
  freeTag: require('../../../../assets/images/offers/free-tag.webp'),
};

export function OffersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)');
  }

  function handleAccept() {
    router.replace('/(drawer)');
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <BackButton variant="close" onPress={handleBack} />
        <BrandLogo />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{strings.offers.title}</Text>
        <Text style={styles.subtitle}>{strings.offers.subtitle}</Text>

        <View style={[styles.banner, { backgroundColor: '#FF8B4C' }]}>
          <Image source={images.gift} contentFit="contain" style={styles.giftImage} />
          <Text style={[styles.bannerText, { color: colors.white }]}>
            {strings.offers.freeDelivery}
          </Text>
          <AcceptButton onPress={handleAccept} />
        </View>

        <View style={[styles.banner, { backgroundColor: '#D5E2C8' }]}>
          <Image source={images.freeTag} contentFit="contain" style={styles.tagImage} />
          <Text style={[styles.bannerText, styles.bannerTextBottom, { color: '#141414' }]}>
            {strings.offers.firstFree}
          </Text>
          <AcceptButton onPress={handleAccept} />
        </View>
      </ScrollView>
    </View>
  );
}

function AcceptButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.accept, pressed ? styles.pressed : null]}
    >
      <Text style={styles.acceptText}>{strings.offers.accept}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    height: 64,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 17,
    gap: 18,
  },
  title: {
    marginTop: 4,
    marginLeft: 2,
    fontFamily: fontFamily.inriaBold,
    fontSize: 24,
    color: colors.black,
  },
  subtitle: {
    marginLeft: 2,
    marginTop: -8,
    fontFamily: fontFamily.inriaBold,
    fontSize: 15,
    lineHeight: 20,
    color: 'rgba(0,0,0,0.58)',
  },
  banner: {
    height: 185,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 24,
  },
  giftImage: {
    position: 'absolute',
    right: -20,
    top: -66,
    width: 357,
    height: 238,
  },
  tagImage: {
    position: 'absolute',
    right: 8,
    top: 0,
    width: 222,
    height: 133,
  },
  bannerText: {
    fontFamily: fontFamily.inriaBold,
    fontSize: 24,
    lineHeight: 30,
    width: 188,
  },
  bannerTextBottom: {
    position: 'absolute',
    left: 17,
    bottom: 20,
  },
  accept: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#03003E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: {
    fontFamily: fontFamily.inriaBold,
    fontSize: 15,
    color: colors.white,
  },
  pressed: {
    opacity: 0.8,
  },
});
