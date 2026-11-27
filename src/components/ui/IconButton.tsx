import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon, type IconName } from '@/components/ui/Icon';
import { colors, radius, touchTarget, type ColorName } from '@/constants';

interface IconButtonProps {
  icon: IconName;
  /** Obrigatório: descreve a ação para leitores de tela (ex.: "Abrir carrinho"). */
  accessibilityLabel: string;
  onPress?: () => void;
  variant?: 'plain' | 'filled';
  /** Contador no canto (ex.: itens no carrinho). Oculto quando 0. */
  badgeCount?: number;
  filled?: boolean;
  /** Cor do ícone (ex.: 'onBrand' sobre fundo Azul Noite). */
  color?: ColorName;
}

/** Botão só com ícone, com área de toque de 44 px. */
export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = 'plain',
  badgeCount = 0,
  filled,
  color = 'text',
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={4}
      style={({ pressed }) => [
        styles.button,
        variant === 'filled' ? styles.filled : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Icon name={icon} size={22} color={color} filled={filled} />
      {badgeCount > 0 ? (
        <View style={styles.badge}>
          <AppText variant="label" color="onPrimary" style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : String(badgeCount)}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: { backgroundColor: colors.surfaceBrand },
  pressed: { backgroundColor: colors.surfaceBrandStrong },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 11, lineHeight: 14 },
});
