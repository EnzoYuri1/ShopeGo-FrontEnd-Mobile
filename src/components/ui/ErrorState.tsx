import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { colors, radius, spacing, strings } from '@/constants';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

/** Falha ao carregar: diz o que aconteceu e oferece "Tentar novamente". */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.iconWrap}>
        <Icon name="alert" size={28} color="danger" />
      </View>
      <AppText variant="bodyStrong" align="center" style={styles.message}>
        {message}
      </AppText>
      <Button
        title={strings.common.tryAgain}
        variant="secondary"
        size="md"
        fullWidth={false}
        onPress={onRetry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.ms,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  message: { maxWidth: 300 },
});
