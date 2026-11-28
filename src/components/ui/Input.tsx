import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing, textVariants } from '@/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

// campo de texto da marca: fundo céu, borda azul noite no foco, vermelho no erro
export function Input({ label, error, style, onFocus, onBlur, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="label" color="textSecondary">
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel={label ?? props.placeholder}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          focused ? styles.focused : null,
          error ? styles.inputError : null,
          style,
        ]}
        {...props}
      />
      {error ? (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', gap: spacing.xs + 2 },
  input: {
    width: '100%',
    minHeight: 52,
    backgroundColor: colors.surfaceBrand,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    color: colors.text,
    // sem lineheight: no android ele desalinha o texto dentro do textinput
    fontFamily: textVariants.body.fontFamily,
    fontSize: textVariants.body.fontSize,
  },
  focused: { borderColor: colors.brand, backgroundColor: colors.background },
  inputError: { borderColor: colors.danger },
});
