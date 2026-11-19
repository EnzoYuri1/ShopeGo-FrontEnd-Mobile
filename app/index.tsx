import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, strings } from '@/constants';

/** Tela provisória da Etapa 01. Será substituída pela Welcome na Etapa 02. */
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.app.name}</Text>
      <Text style={styles.subtitle}>{strings.app.tagline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.primary },
  subtitle: { marginTop: 8, textAlign: 'center', color: colors.textSecondary },
});
