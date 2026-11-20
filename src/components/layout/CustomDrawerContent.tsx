import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { colors, fontSize, fontWeight, radius, spacing, strings } from '@/constants';
import { useSignOut } from '@/features/auth/hooks/useAuth';
import { useAppUpdate } from '@/hooks/useAppUpdate';

interface CustomDrawerContentProps {
  navigation: {
    closeDrawer: () => void;
  };
}

interface DrawerMenuItem {
  label: string;
  color: string;
  onPress: () => void;
}

export function CustomDrawerContent({ navigation }: CustomDrawerContentProps) {
  const insets = useSafeAreaInsets();
  const signOutMutation = useSignOut();
  const { isChecking, checkForUpdates } = useAppUpdate();

  function showSoon(title: string) {
    navigation.closeDrawer();
    Alert.alert(title, strings.common.soon);
  }

  const menuItems: DrawerMenuItem[] = [
    { label: strings.drawer.home, color: '#2563EB', onPress: () => navigation.closeDrawer() },
    {
      label: strings.drawer.favourites,
      color: '#E53935',
      onPress: () => showSoon(strings.drawer.favourites),
    },
    { label: strings.drawer.cart, color: '#2DB67C', onPress: () => showSoon(strings.drawer.cart) },
    {
      label: strings.drawer.myOrders,
      color: '#7C3AED',
      onPress: () => showSoon(strings.drawer.myOrders),
    },
    {
      label: strings.drawer.myProfile,
      color: '#F59E0B',
      onPress: () => showSoon(strings.drawer.myProfile),
    },
    {
      label: strings.drawer.myOffers,
      color: '#06B6D4',
      onPress: () => showSoon(strings.drawer.myOffers),
    },
  ];

  function handleSignOut() {
    signOutMutation.mutate();
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Pressable
          style={styles.closeButton}
          onPress={() => navigation.closeDrawer()}
          hitSlop={10}
          accessibilityLabel="Fechar menu"
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 7V6a6 6 0 1112 0v1h2a1 1 0 011 1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h2zm2 0h8V6a4 4 0 10-8 0v1z"
            fill={colors.primary}
          />
          <Path
            d="M9.5 14l2 2 4-4"
            stroke={colors.white}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>

        <Text style={styles.brand}>
          Shop<Text style={styles.brandHighlight}>Go</Text>
        </Text>
        <Text style={styles.tagline}>{strings.drawer.tagline}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.menu, { paddingBottom: insets.bottom + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.itemsGroup}>
          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuButton,
                { backgroundColor: item.color },
                pressed ? styles.pressed : null,
              ]}
            >
              <Text style={styles.menuText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.footerGroup}>
          <Pressable
            onPress={() => void checkForUpdates()}
            disabled={isChecking}
            style={({ pressed }) => [
              styles.menuButton,
              styles.updateButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.menuText}>
              {isChecking ? strings.updates.checking : strings.updates.checkButton.toUpperCase()}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSignOut}
            disabled={signOutMutation.isPending}
            style={({ pressed }) => [
              styles.menuButton,
              styles.signOutButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.menuText}>{strings.drawer.signOut}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  closeText: {
    fontSize: fontSize.lg,
    color: colors.text,
  },
  brand: {
    marginTop: spacing.xs,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  brandHighlight: {
    color: '#2563EB',
  },
  tagline: {
    marginTop: 2,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  menu: {
    flexGrow: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  itemsGroup: {
    gap: spacing.sm + 2,
  },
  footerGroup: {
    gap: spacing.sm + 2,
  },
  menuButton: {
    height: 46,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: '#3A3A3C',
  },
  signOutButton: {
    backgroundColor: '#FF6B4A',
  },
  pressed: {
    opacity: 0.85,
  },
  menuText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
