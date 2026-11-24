import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, fontFamily } from '@/constants';

interface SelectFieldProps {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  error?: boolean;
}

/** Campo de seleção (lista em modal) que funciona igual no nativo e no web. */
export function SelectField({ value, placeholder, options, onChange, error }: SelectFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        style={[styles.field, error ? styles.fieldError : null]}
      >
        <Text style={[styles.text, value ? null : styles.placeholder]}>{value || placeholder}</Text>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 9l7 7 7-7"
            stroke={colors.black}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  style={[styles.option, item === value ? styles.optionOn : null]}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>
              )}
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
    height: 36,
    borderRadius: 6,
    backgroundColor: '#C9C9C9',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fieldError: {
    borderColor: colors.danger,
  },
  text: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.black,
  },
  placeholder: {
    color: 'rgba(0,0,0,0.55)',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 40,
  },
  sheet: {
    maxHeight: 320,
    borderRadius: 12,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  optionOn: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    color: colors.black,
  },
});
