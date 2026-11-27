import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants';
import { MAX_APP_WIDTH } from '@/hooks/useScreenWidth';

// centraliza telas desenhadas para largura de celular (login, onboarding...)
export function CenteredColumn({ children }: { children: ReactNode }) {
  return (
    <View style={styles.outer}>
      <View style={styles.column}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: colors.background },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_APP_WIDTH,
    alignSelf: 'center',
    overflow: 'hidden',
  },
});
