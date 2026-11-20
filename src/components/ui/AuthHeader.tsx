import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@/constants';

interface AuthHeaderProps {
  title: string;
}

export function AuthHeader({ title }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.xl + spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 160,
    borderBottomRightRadius: 160,
    marginHorizontal: -40,
  },
  title: {
    fontSize: fontSize.xl + 4,
    fontWeight: fontWeight.bold,
    color: colors.black,
    textAlign: 'center',
  },
});
