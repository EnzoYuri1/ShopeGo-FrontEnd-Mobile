import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { colors, fontFamily, radius } from '@/constants';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  loading?: boolean;
  /** `primary` = preto (padrão); `outline` = branco com texto escuro. */
  variant?: 'primary' | 'outline';
  /** Usa a fonte de destaque (Sansita) dos botões do onboarding. */
  display?: boolean;
}

export function Button({
  title,
  loading = false,
  variant = 'primary',
  display = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isOutline = variant === 'outline';

  return (
    <Pressable
      disabled={isDisabled}
      style={(state) => [
        styles.button,
        isOutline ? styles.outline : styles.primary,
        isDisabled ? styles.disabled : null,
        state.pressed && !isDisabled ? styles.pressed : null,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.black : colors.white} />
      ) : (
        <Text
          style={[
            styles.text,
            display ? styles.displayText : null,
            isOutline ? styles.outlineText : null,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 54,
    paddingVertical: 12,
    borderRadius: radius.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.black,
    shadowColor: colors.buttonShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
  },
  outline: {
    backgroundColor: colors.white,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.white,
    fontFamily: fontFamily.semibold,
    fontSize: 20,
  },
  outlineText: {
    color: colors.black,
  },
  displayText: {
    fontFamily: fontFamily.display,
    fontSize: 24,
  },
});
