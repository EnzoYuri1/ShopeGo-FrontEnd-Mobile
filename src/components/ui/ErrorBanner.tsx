import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, spacing, strings } from '@/constants';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

/** Aviso inline de erro com opção opcional de tentar novamente. */
export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Icon name="alert" size={18} color="danger" />
      <AppText variant="caption" color="danger" style={styles.message}>
        {message}
      </AppText>
      {onRetry ? (
        <Pressable onPress={onRetry} hitSlop={8} accessibilityRole="button">
          <AppText variant="label" color="primaryText">
            {strings.common.tryAgain}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.ms,
    borderRadius: radius.md,
    backgroundColor: colors.dangerLight,
  },
  message: { flex: 1 },
});
