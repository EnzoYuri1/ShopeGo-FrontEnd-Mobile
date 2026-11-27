import { Redirect } from 'expo-router';

import { DesignSystemScreen } from '@/features/design-system/DesignSystemScreen';

/** Catálogo interno do Design System. Só existe em desenvolvimento. */
export default function DesignSystemRoute() {
  if (!__DEV__) return <Redirect href="/" />;
  return <DesignSystemScreen />;
}
