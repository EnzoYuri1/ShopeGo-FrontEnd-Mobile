import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { colors, elevation, radius, spacing } from '@/constants';

interface SelectFieldProps {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  error?: boolean;
  /** Descreve o campo para leitores de tela (ex.: "Mês de validade"). */
  accessibilityLabel?: string;
}

/** Campo de seleção da marca (lista em modal), igual no nativo e no web. */
export function SelectField({
  value,
  placeholder,
  options,
  onChange,
  error,
  accessibilityLabel,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? placeholder}
        accessibilityValue={value ? { text: value } : undefined}
        style={[styles.field, error ? styles.fieldError : null]}
      >
        <AppText variant="body" color={value ? 'text' : 'textSecondary'}>
          {value || placeholder}
        </AppText>
        <Icon name="chevronDown" size={18} color="textSecondary" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={({ pressed }) => [
                      styles.option,
                      selected ? styles.optionOn : null,
                      pressed ? styles.optionPressed : null,
                    ]}
                  >
                    <AppText variant={selected ? 'bodyStrong' : 'body'}>{item}</AppText>
                    {selected ? (
                      <Icon name="check" size={18} color="brand" strokeWidth={2.5} />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceBrand,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  fieldError: { borderColor: colors.danger },
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: {
    maxHeight: 360,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    overflow: 'hidden',
    ...elevation.overlay,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: spacing.ml,
  },
  optionOn: { backgroundColor: colors.surfaceBrand },
  optionPressed: { backgroundColor: colors.surfaceBrandStrong },
});
