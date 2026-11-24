import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { BackButton, BrandLogo, Button } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import { useOrder } from '@/features/orders/hooks/useOrders';
import {
  formatDate,
  getCurrentStep,
  getStatusLabel,
  TRACKING_STEPS,
} from '@/features/orders/utils/orderStatus';

const BLUE = '#2563EB';
const GRAY = '#D6D9E0';

interface TrackingScreenProps {
  orderId: string;
}

export function TrackingScreen({ orderId }: TrackingScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: order, isLoading } = useOrder(orderId);

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/orders');
  }

  const current = order ? getCurrentStep(order.status) : 0;
  const first = order?.items[0];
  const unitCount = order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <BackButton onPress={handleBack} style={styles.back} />
        <Text style={styles.title}>{strings.tracking.title}</Text>
        <BrandLogo />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.center} />
      ) : !order ? (
        <Text style={styles.notFound}>{strings.tracking.notFound}</Text>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <View style={styles.summary}>
                <View style={styles.boxIcon}>
                  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 2l9 5v10l-9 5-9-5V7l9-5zM3 7l9 5 9-5M12 12v10"
                      stroke={colors.white}
                      strokeWidth={1.8}
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.orderNumber}>
                    {strings.tracking.orderNumber} #{order.id.slice(0, 8).toUpperCase()}
                  </Text>
                  <Text style={styles.productName} numberOfLines={1}>
                    {first?.name}
                  </Text>
                  <Text style={styles.units}>{unitCount} un.</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{getStatusLabel(order.status)}</Text>
                </View>
              </View>
              <View style={styles.estimateRow}>
                <Text style={styles.estimateLabel}>{strings.tracking.estimate}</Text>
                <Text style={styles.estimateValue}>{formatDate(order.createdAt, 5)}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>{strings.tracking.location}</Text>
              <DeliveryMap />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>{strings.tracking.statusTitle}</Text>
              {current < 0 ? (
                <Text style={styles.cancelled}>{strings.tracking.cancelled}</Text>
              ) : (
                TRACKING_STEPS.map((step, index) => (
                  <TimelineStep
                    key={step.title}
                    title={step.title}
                    subtitle={step.subtitle}
                    state={index < current ? 'done' : index === current ? 'current' : 'todo'}
                    last={index === TRACKING_STEPS.length - 1}
                  />
                ))
              )}
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <Button
              title={strings.tracking.details}
              onPress={handleBack}
              style={styles.detailsButton}
            />
          </View>
        </>
      )}
    </View>
  );
}

interface TimelineStepProps {
  title: string;
  subtitle: string;
  state: 'done' | 'current' | 'todo';
  last: boolean;
}

function TimelineStep({ title, subtitle, state, last }: TimelineStepProps) {
  const color = state === 'current' ? colors.primary : state === 'done' ? BLUE : GRAY;

  return (
    <View style={styles.step}>
      <View style={styles.stepRail}>
        <View style={[styles.dot, { backgroundColor: color }]}>
          {state === 'done' ? (
            <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 12.5l4.5 4.5L19 7"
                stroke={colors.white}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : null}
        </View>
        {last ? null : (
          <View style={[styles.line, { backgroundColor: state === 'done' ? BLUE : GRAY }]} />
        )}
      </View>
      <View style={styles.stepText}>
        <Text style={[styles.stepTitle, state === 'todo' ? styles.stepTitleTodo : null]}>
          {title}
        </Text>
        <Text style={styles.stepSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

/** Mapa ilustrativo da rota de entrega (o app ainda não tem localização real). */
function DeliveryMap() {
  return (
    <Svg width="100%" height={150} viewBox="0 0 340 150" style={styles.map}>
      <Rect width={340} height={150} rx={12} fill="#EAF0FA" />
      <Rect x={14} y={14} width={70} height={42} rx={4} fill="#DCE6F5" />
      <Rect x={100} y={14} width={90} height={42} rx={4} fill="#DCE6F5" />
      <Rect x={206} y={14} width={120} height={42} rx={4} fill="#DCE6F5" />
      <Rect x={14} y={72} width={110} height={64} rx={4} fill="#DCE6F5" />
      <Rect x={140} y={72} width={70} height={64} rx={4} fill="#DCE6F5" />
      <Rect x={226} y={72} width={100} height={64} rx={4} fill="#DCE6F5" />
      <Path
        d="M30 118C70 60 110 130 160 90S250 40 306 44"
        stroke={BLUE}
        strokeWidth={3}
        strokeDasharray="7 6"
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={30} cy={118} r={7} fill={BLUE} stroke={colors.white} strokeWidth={2} />
      <Circle cx={306} cy={44} r={8} fill={colors.primary} stroke={colors.white} strokeWidth={2} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    height: 64,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    marginRight: 4,
  },
  title: {
    fontFamily: fontFamily.interBold,
    fontSize: 20,
    color: colors.black,
  },
  center: {
    marginTop: 80,
  },
  notFound: {
    marginTop: 80,
    textAlign: 'center',
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.textSecondary,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 14,
  },
  card: {
    backgroundColor: '#F5F7FD',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  boxIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryInfo: {
    flex: 1,
  },
  orderNumber: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: colors.textMuted,
  },
  productName: {
    marginTop: 2,
    fontFamily: fontFamily.interBold,
    fontSize: 17,
    color: colors.black,
  },
  units: {
    marginTop: 2,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E1ECFF',
  },
  badgeText: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    color: BLUE,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimateLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  estimateValue: {
    fontFamily: fontFamily.interBold,
    fontSize: 14,
    color: colors.black,
  },
  cardTitle: {
    fontFamily: fontFamily.interBold,
    fontSize: 16,
    color: colors.black,
  },
  map: {
    borderRadius: 12,
  },
  cancelled: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.danger,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 52,
  },
  stepRail: {
    alignItems: 'center',
    width: 18,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: 2,
  },
  stepText: {
    flex: 1,
    paddingBottom: 12,
  },
  stepTitle: {
    fontFamily: fontFamily.interBold,
    fontSize: 14,
    color: colors.black,
  },
  stepTitleTodo: {
    color: colors.textMuted,
  },
  stepSub: {
    marginTop: 1,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  detailsButton: {
    backgroundColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
});
