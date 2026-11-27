import { Text, type TextProps } from 'react-native';

import { colors, textVariants, type ColorName, type TextVariant } from '@/constants';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: ColorName;
  align?: 'left' | 'center' | 'right';
}

/** Texto da marca: aplica a escala tipográfica (`textVariants`) e as cores por função. */
export function AppText({
  variant = 'body',
  color = 'text',
  align,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[
        textVariants[variant],
        { color: colors[color] },
        align ? { textAlign: align } : null,
        style,
      ]}
      {...props}
    />
  );
}
