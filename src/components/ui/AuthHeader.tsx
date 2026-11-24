import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BackButton } from '@/components/ui/BackButton';
import { colors, fontFamily, fontSize } from '@/constants';

interface AuthHeaderProps {
  title: string;
  /** Quando informado, mostra o botão de voltar no canto superior esquerdo. */
  onBack?: () => void;
}

const HEADER_HEIGHT = 174;
const ELLIPSE_WIDTH = 647;
const ELLIPSE_HEIGHT = 572;

/** Cabeçalho laranja com curva elíptica (frames de auth do Figma). */
export function AuthHeader({ title, onBack }: AuthHeaderProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.ellipse,
          { left: (width - ELLIPSE_WIDTH) / 2, top: HEADER_HEIGHT - ELLIPSE_HEIGHT },
        ]}
      />
      {onBack ? <BackButton onPress={onBack} style={styles.back} /> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  ellipse: {
    position: 'absolute',
    width: ELLIPSE_WIDTH,
    height: ELLIPSE_HEIGHT,
    borderRadius: ELLIPSE_HEIGHT,
    backgroundColor: colors.primary,
  },
  back: {
    position: 'absolute',
    left: 14,
    top: 30,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl + 6,
    color: colors.black,
    textAlign: 'center',
  },
});
