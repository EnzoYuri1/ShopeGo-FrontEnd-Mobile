import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fontFamily, fontSize, radius, spacing } from '@/constants';

interface InputProps extends TextInputProps {
  error?: string;
}

export function Input({ error, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 64,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md - 2,
    paddingHorizontal: 20,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.danger,
  },
});
