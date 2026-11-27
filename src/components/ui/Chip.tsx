import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon, type IconName } from '@/components/ui/Icon';
import { colors, radius, spacing, touchTarget } from '@/constants';

interface ChipProps {
  label: string;
  selected?: boolean;
  icon?: IconName;
  onPress?: () => void;
}

/** Filtro ou opção selecionável (ordenar, filtrar, variação de produto). */
export function Chip({ label, selected = false, icon, onPress }: ChipProps) {
  const fg = selected ? 'onBrand' : 'text';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selected : styles.idle,
        pressed && !selected ? styles.pressed : null,
      ]}
    >
      {icon ? <Icon name={icon} size={16} color={fg} /> : null}
      <AppText variant="caption" color={fg}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    minHeight: touchTarget - 8,
    paddingHorizontal: spacing.ms,
    borderRadius: radius.sm,
    borderWidth: 1.5,
  },
  idle: { backgroundColor: colors.background, borderColor: colors.border },
  selected: { backgroundColor: colors.brand, borderColor: colors.brand },
  pressed: { backgroundColor: colors.surfaceBrand },
});
