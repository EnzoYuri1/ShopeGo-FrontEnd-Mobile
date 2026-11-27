import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, BrandLogo, Icon, IconButton, type IconName } from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
import { useSignOut } from '@/features/auth/hooks/useAuth';
import { useAppUpdate } from '@/hooks/useAppUpdate';
import { useFeedbackStore } from '@/store';

interface CustomDrawerContentProps {
  navigation: {
    closeDrawer: () => void;
  };
}

interface MenuItem {
  icon: IconName;
  label: string;
  onPress: () => void;
}

// menu lateral: destinos secundários (os principais estão na barra inferior), buscar atualizações e sair
export function CustomDrawerContent({ navigation }: CustomDrawerContentProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const signOutMutation = useSignOut();
  const { isChecking, checkForUpdates } = useAppUpdate();
  const showFeedback = useFeedbackStore((state) => state.show);

  function go(href: '/favorites' | '/orders' | '/offers') {
    navigation.closeDrawer();
    router.push(href);
  }

  const items: MenuItem[] = [
    { icon: 'home', label: strings.drawer.homeLabel, onPress: () => navigation.closeDrawer() },
    { icon: 'package', label: strings.drawer.ordersLabel, onPress: () => go('/orders') },
    { icon: 'heart', label: strings.drawer.favoritesLabel, onPress: () => go('/favorites') },
    { icon: 'tag', label: strings.drawer.offersLabel, onPress: () => go('/offers') },
  ];

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerTop}>
          <BrandLogo floating={false} tone="onBrand" size={30} />
          <IconButton
            icon="close"
            color="onBrand"
            accessibilityLabel={strings.drawer.close}
            onPress={() => navigation.closeDrawer()}
          />
        </View>
        <AppText variant="body" color="onBrand" style={styles.tagline}>
          {strings.drawer.tagline}
        </AppText>
      </View>

      <ScrollView
        contentContainerStyle={[styles.menu, { paddingBottom: insets.bottom + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {items.map((item) => (
            <MenuRow key={item.label} {...item} />
          ))}
        </View>

        <View style={styles.footer}>
          <MenuRow
            icon="refresh"
            label={isChecking ? strings.updates.checking : strings.updates.checkButton}
            onPress={() => void checkForUpdates()}
            disabled={isChecking}
          />
          <MenuRow
            icon="logout"
            label={strings.drawer.signOutLabel}
            onPress={() =>
              signOutMutation.mutate(undefined, {
                onError: () => showFeedback({ message: strings.errors.signOutFailed, lift: 0 }),
              })
            }
            disabled={signOutMutation.isPending}
            danger
          />
        </View>
      </ScrollView>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  disabled = false,
  danger = false,
}: MenuItem & { disabled?: boolean; danger?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.row,
        pressed ? styles.rowPressed : null,
        disabled ? styles.rowDisabled : null,
      ]}
    >
      <Icon name={icon} size={22} color={danger ? 'danger' : 'brand'} />
      <AppText variant="bodyStrong" color={danger ? 'danger' : 'text'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.brand,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tagline: { opacity: 0.85 },
  menu: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: spacing.sm,
    paddingTop: spacing.md,
  },
  footer: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.ms,
    borderRadius: radius.md,
  },
  rowPressed: { backgroundColor: colors.surfaceBrand },
  rowDisabled: { opacity: 0.5 },
});
