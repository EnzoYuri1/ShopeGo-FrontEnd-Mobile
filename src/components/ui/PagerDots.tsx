import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants';

interface PagerDotsProps {
  count: number;
  activeIndex: number;
}

export function PagerDots({ count, activeIndex }: PagerDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={[styles.dot, index === activeIndex ? styles.active : null]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
  },
  active: {
    backgroundColor: colors.black,
  },
});
