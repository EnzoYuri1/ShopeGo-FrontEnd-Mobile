import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, strings } from '@/constants';
import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * Tela inicial conectada ao estado de autenticação.
 * O redirecionamento para /(auth) ou /(drawer) será ativado na Etapa 02,
 * quando as rotas das telas forem criadas.
 */
export default function Index() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
