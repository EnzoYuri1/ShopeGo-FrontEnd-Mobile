import { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius } from '@/constants';

interface SkeletonProps {
  width?: DimensionValue;
  /** Opcional quando o `style` define o tamanho (ex.: aspectRatio). */
  height?: DimensionValue;
  rounded?: keyof typeof radius;
  style?: StyleProp<ViewStyle>;
}

/** Bloco de carregamento no formato do conteúdo. Pulsa devagar; fica parado se o sistema pedir menos movimento. */
export function Skeleton({ width = '100%', height, rounded = 'md', style }: SkeletonProps) {
  // useState (e não useRef) para o valor animado: estável e permitido durante a renderização.
  const [opacity] = useState(() => new Animated.Value(1));
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduceMotion(value);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.55, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, reduceMotion]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height,
          borderRadius: radius[rounded],
          backgroundColor: colors.surfaceBrand,
          opacity,
        },
        style,
      ]}
    />
  );
}
