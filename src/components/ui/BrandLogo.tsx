import { Image } from 'expo-image';
import { StyleSheet, type StyleProp, type ImageStyle } from 'react-native';

interface BrandLogoProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

const logo = require('../../../assets/images/logo-shopgo.png');

/** Logo ShopGo (sacola + nome) usado no canto superior direito das telas. */
export function BrandLogo({ size = 85, style }: BrandLogoProps) {
  return (
    <Image
      source={logo}
      contentFit="contain"
      accessibilityLabel="ShopGo"
      style={[styles.logo, { width: size, height: size }, style]}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    position: 'absolute',
    top: -2,
    right: 5,
  },
});
