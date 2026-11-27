import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
} from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { colors, radius, spacing, textVariants, type ColorName } from '@/constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  display?: boolean;
}

const VARIANTS: Record<ButtonVariant, { bg: string; fg: ColorName; border?: string }> = {
  primary: { bg: colors.primary, fg: 'onPrimary' },
  secondary: { bg: colors.brand, fg: 'onBrand' },
  outline: { bg: 'transparent', fg: 'brand', border: colors.brand },
  ghost: { bg: 'transparent', fg: 'brand' },
};

const PRESSED_BG: Record<ButtonVariant, string> = {
  primary: colors.primaryPressed,
  secondary: colors.brandSoft,
  outline: colors.surfaceBrand,
  ghost: colors.surfaceBrand,
};

export function Button({
  title,
  loading = false,
  variant = 'primary',
  size = 'lg',
  icon,
  iconPosition = 'left',
  fullWidth = true,
  display = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const look = VARIANTS[variant];
  const iconNode = icon ? <Icon name={icon} size={20} color={look.fg} /> : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={(state) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        fullWidth ? styles.full : null,
        { backgroundColor: look.bg },
        look.border ? { borderWidth: 1.5, borderColor: look.border } : null,
        state.pressed && !isDisabled ? { backgroundColor: PRESSED_BG[variant] } : null,
        isDisabled ? styles.disabled : null,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors[look.fg]} />
      ) : (
        <View style={styles.content}>
          {iconPosition === 'left' ? iconNode : null}
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            style={[
              textVariants.button,
              display ? styles.displayText : null,
              { color: colors[look.fg] },
            ]}
          >
            {title}
          </Text>
          {iconPosition === 'right' ? iconNode : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.ml,
  },
  lg: { minHeight: 56 },
  md: { minHeight: 44 },
  full: { width: '100%' },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  disabled: { opacity: 0.5 },
  displayText: { fontFamily: 'Archivo_800ExtraBold', fontSize: 20, lineHeight: 24 },
});
