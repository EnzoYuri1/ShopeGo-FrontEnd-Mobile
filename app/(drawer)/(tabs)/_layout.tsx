import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import { useCart } from '@/features/cart/hooks/useCart';

function tabIcon(name: IconName) {
  function TabIcon({ focused }: { focused: boolean }) {
    return (
      <Icon
        name={name}
        size={24}
        color={focused ? 'primary' : 'textSecondary'}
        filled={focused}
        strokeWidth={focused ? 2.2 : 2}
      />
    );
  }
  return TabIcon;
}

/** Barra inferior: os 5 destinos principais. O menu lateral fica para Pedidos, Ofertas e Sair. */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontFamily: fontFamily.brandSemibold, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: strings.tabs.home, tabBarIcon: tabIcon('home') }}
      />
      <Tabs.Screen
        name="categories"
        options={{ title: strings.tabs.categories, tabBarIcon: tabIcon('grid') }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: strings.tabs.search, tabBarIcon: tabIcon('search') }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: strings.tabs.cart,
          tabBarIcon: tabIcon('bag'),
          tabBarBadge: itemCount > 0 ? (itemCount > 99 ? '99+' : itemCount) : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: colors.onPrimary,
            fontFamily: fontFamily.brandBold,
            fontSize: 11,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: strings.tabs.account, tabBarIcon: tabIcon('user') }}
      />
    </Tabs>
  );
}
