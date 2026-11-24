import { useRef, type ComponentRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors, fontFamily } from '@/constants';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

/** Campo de código com uma caixa por dígito; as caixas refletem um único valor. */
export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const inputs = useRef<(ComponentRef<typeof TextInput> | null)[]>([]);

  function handleChange(index: number, text: string) {
    const digits = text.replace(/\D/g, '');
    const chars = value.padEnd(length, ' ').split('');

    if (digits.length === 0) {
      chars[index] = ' ';
      onChange(chars.join('').trimEnd());
      return;
    }

    // Suporta colar o código inteiro: distribui a partir da caixa atual.
    digits
      .slice(0, length - index)
      .split('')
      .forEach((digit, offset) => {
        chars[index + offset] = digit;
      });
    onChange(chars.join('').trimEnd().slice(0, length));

    const next = Math.min(index + digits.length, length - 1);
    inputs.current[next]?.focus();
  }

  function handleKeyPress(index: number, key: string) {
    if (key === 'Backspace' && !value[index]?.trim() && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  return (
    <View style={styles.row}>
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(node) => {
            inputs.current[index] = node;
          }}
          value={value[index]?.trim() ?? ''}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={length}
          textContentType="oneTimeCode"
          selectTextOnFocus
          style={styles.box}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  box: {
    flex: 1,
    height: 72,
    borderWidth: 2,
    borderColor: colors.otpBorder,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.63)',
    textAlign: 'center',
    fontFamily: fontFamily.semibold,
    fontSize: 24,
    color: colors.text,
  },
});
