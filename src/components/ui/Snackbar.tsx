import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon, type IconName } from '@/components/ui/Icon';
import { colors, elevation, radius, spacing } from '@/constants';

interface SnackbarProps {
  message: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Aviso curto na base da tela (ex.: "Adicionado ao carrinho" + "Ver carrinho").
 * Quem usa controla posição e tempo de exibição.
 */
export function Snackbar({ message, icon = 'check', actionLabel, onAction }: SnackbarProps) {
  return (
    <View style={styles.bar} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Icon name={icon} size={20} color="primary" strokeWidth={2.5} />
      <AppText variant="bodyStrong" color="onBrand" style={styles.message} numberOfLines={2}>
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={8}>
          <AppText variant="bodyStrong" color="primary">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.ms,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.ms,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    ...elevation.overlay,
  },
  message: { flex: 1 },
});
