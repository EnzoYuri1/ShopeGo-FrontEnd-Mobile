import { useLocalSearchParams } from 'expo-router';

import { TrackingScreen } from '@/features/orders/components/TrackingScreen';

export default function TrackingRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TrackingScreen orderId={id ?? ''} />;
}
