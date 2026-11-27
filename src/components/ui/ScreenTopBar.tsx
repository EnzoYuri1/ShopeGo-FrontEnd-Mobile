import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { colors, spacing, strings } from '@/constants';

interface ScreenTopBarProps {
  onBack: () => void;
  /** Título curto ao lado do voltar. Omita quando a tela tem título grande no conteúdo. */
  title?: string;
  /** Ações à direita (ex.: favoritar, carrinho). */
  right?: ReactNode;
}

/**
 * Cabeçalho padrão das telas empilhadas: voltar, título e ações.
 * Já aplica a área segura do topo.
 */
export function ScreenTopBar({ onBack, title, right }: ScreenTopBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.xs }]}>
      <IconButton icon="chevronLeft" accessibilityLabel={strings.common.back} onPress={onBack} />
      <View style={styles.title}>
        {title ? (
          <AppText variant="heading" numberOfLines={1} accessibilityRole="header">
            {title}
          </AppText>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  title: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center' },
});
