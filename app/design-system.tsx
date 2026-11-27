import { Redirect } from 'expo-router';

import { DesignSystemScreen } from '@/features/design-system/DesignSystemScreen';

// catálogo interno do design system. só existe em desenvolvimento
export default function DesignSystemRoute() {
  if (!__DEV__) return <Redirect href="/" />;
  return <DesignSystemScreen />;
}
