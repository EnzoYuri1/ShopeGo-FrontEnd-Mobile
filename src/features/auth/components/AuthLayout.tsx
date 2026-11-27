import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, BrandMark, IconButton } from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  /** Mostra o voltar no cabeçalho (telas internas do fluxo). */
  onBack?: () => void;
  children: ReactNode;
}

/**
 * Estrutura das telas de entrada e senha: faixa Azul Noite com o símbolo e o título,
 * e o formulário numa folha branca. Cuida do teclado e da área segura.
 */
export function AuthLayout({ title, subtitle, onBack, children }: AuthLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.band, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.bandTop}>
            {onBack ? (
              <IconButton
                icon="chevronLeft"
                color="onBrand"
                accessibilityLabel={strings.common.back}
                onPress={onBack}
              />
            ) : (
              <View style={styles.backSpacer} />
            )}
          </View>
          <BrandMark size={44} tone="onBrand" />
          <AppText variant="display" color="onBrand" accessibilityRole="header">
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="body" color="onBrand" style={styles.subtitle}>
              {subtitle}
            </AppText>
          ) : null}
        </View>

        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.brand },
  scroll: { flexGrow: 1 },
  band: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + spacing.md,
    backgroundColor: colors.brand,
  },
  bandTop: { marginLeft: -spacing.ms, marginBottom: spacing.xs },
  backSpacer: { height: 44 },
  subtitle: { opacity: 0.85 },
  sheet: {
    flexGrow: 1,
    gap: spacing.md,
    marginTop: -spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.background,
  },
});
