import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { colors, fontFamily } from '@/constants';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
}

const HEADER_HEIGHT = 113;

/** Cabeçalho laranja com curva, voltar à esquerda e logo à direita (Carrinho, Favoritos...). */
export function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.header}>
      <View style={styles.ellipse} />
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <BackButton onPress={onBack} style={styles.back} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <BrandLogo style={{ top: insets.top - 2 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    overflow: 'hidden',
  },
  ellipse: {
    position: 'absolute',
    left: '50%',
    marginLeft: -232,
    top: HEADER_HEIGHT - 465,
    width: 465,
    height: 465,
    borderRadius: 233,
    backgroundColor: colors.primary,
  },
  content: {
    minHeight: HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  back: {
    position: 'absolute',
    left: 10,
    top: 36,
  },
  title: {
    marginTop: 8,
    fontFamily: fontFamily.interSemibold,
    fontSize: 28,
    color: colors.black,
  },
});
