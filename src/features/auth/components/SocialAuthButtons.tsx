import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, radius, spacing, strings, textVariants } from '@/constants';

function showUnavailable() {
  Alert.alert(strings.common.soon, strings.auth.socialUnavailable);
}

export function SocialAuthButtons() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{strings.auth.orContinueWith}</Text>
      <View style={styles.row}>
        {/* shortcut: login social OAuth sera conectado apos configuracao de provedores no Firebase */}
        <Pressable style={styles.iconButton} onPress={showUnavailable} accessibilityLabel="Google">
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5c-.2 1.2-1 2.3-2 3v2.5h3.2c1.9-1.7 3.1-4.3 3.1-7.3z"
              fill={colors.text}
            />
            <Path
              d="M12 22c2.7 0 5-.9 6.7-2.5l-3.2-2.5c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.9v2.6C4.6 19.7 8 22 12 22z"
              fill={colors.text}
            />
            <Path
              d="M6.2 13.7c-.2-.6-.3-1.2-.3-1.7s.1-1.1.3-1.7V7.7H2.9C2.3 9 2 10.5 2 12s.3 3 .9 4.3l3.3-2.6z"
              fill={colors.text}
            />
            <Path
              d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9C17 2.9 14.7 2 12 2 8 2 4.6 4.3 2.9 7.7l3.3 2.6C7 7.8 9.3 6 12 6z"
              fill={colors.text}
            />
          </Svg>
        </Pressable>

        <Pressable
          style={styles.iconButton}
          onPress={showUnavailable}
          accessibilityLabel="Facebook"
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C6.48 2 2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12c0-5.52-4.48-10-10-10z"
              fill={colors.text}
            />
          </Svg>
        </Pressable>

        <Pressable style={styles.iconButton} onPress={showUnavailable} accessibilityLabel="Apple">
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M16.37 12.66c-.02-2.16 1.76-3.2 1.84-3.25-1-1.47-2.56-1.67-3.11-1.7-1.32-.13-2.59.78-3.26.78-.68 0-1.72-.76-2.83-.74-1.45.02-2.8.85-3.54 2.15-1.52 2.63-.39 6.53 1.08 8.66.72 1.04 1.58 2.21 2.71 2.17 1.09-.04 1.5-.71 2.82-.71 1.31 0 1.69.71 2.83.68 1.17-.02 1.91-1.06 2.62-2.11.83-1.21 1.17-2.39 1.19-2.45-.03-.01-2.33-.9-2.35-3.19zM14.23 6.26c.6-.73 1-1.74.89-2.76-.86.04-1.91.57-2.52 1.3-.55.64-1.03 1.67-.9 2.66.96.07 1.94-.48 2.53-1.2z"
              fill={colors.text}
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  label: { ...textVariants.caption, color: colors.textSecondary },
  row: { flexDirection: 'row', gap: spacing.ms },
  iconButton: {
    width: 64,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
