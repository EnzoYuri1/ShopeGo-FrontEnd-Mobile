import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors, fontFamily, spacing, strings } from '@/constants';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

/** Mensagem de erro com botão "Tentar novamente". */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Button title={strings.common.tryAgain} onPress={onRetry} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  message: { fontFamily: fontFamily.regular, fontSize: 14, color: colors.text, textAlign: 'center' },
  button: { alignSelf: 'stretch' },
});
