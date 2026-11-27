import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { colors, spacing } from '@/constants';

export interface RouteStop {
  key: string;
  label: string;
  /** Texto de apoio (só na orientação vertical). */
  description?: string;
}

interface RouteLineProps {
  stops: RouteStop[];
  /** Parada atual. Nas verticais, as anteriores aparecem como concluídas. */
  activeIndex: number;
  orientation?: 'horizontal' | 'vertical';
  /** Torna as paradas tocáveis (ex.: categorias). */
  onSelect?: (index: number) => void;
}

/**
 * Elemento próprio da marca ShopGo: uma rota com paradas.
 * Use só onde existe sequência ou percurso real: categorias, etapas do checkout,
 * status do pedido. Nunca como enfeite.
 */
export function RouteLine({ stops, activeIndex, orientation = 'horizontal', onSelect }: RouteLineProps) {
  if (orientation === 'vertical') {
    return (
      <View accessibilityRole="list">
        {stops.map((stop, index) => {
          const done = index < activeIndex;
          const current = index === activeIndex;
          const last = index === stops.length - 1;
          return (
            <View key={stop.key} style={styles.vRow} accessible accessibilityLabel={stop.label}>
              <View style={styles.vTrack}>
                <View style={[styles.vDot, done && styles.dotDone, current && styles.dotCurrent]}>
                  {done ? <Icon name="check" size={12} color="onPrimary" strokeWidth={3} /> : null}
                </View>
                {!last ? <View style={[styles.vLine, done && styles.lineDone]} /> : null}
              </View>
              <View style={styles.vText}>
                <AppText variant={current ? 'bodyStrong' : 'body'} color={index > activeIndex ? 'textSecondary' : 'text'}>
                  {stop.label}
                </AppText>
                {stop.description ? (
                  <AppText variant="caption" color="textSecondary">
                    {stop.description}
                  </AppText>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.hWrap} accessibilityRole="tablist">
      <View style={styles.hLine} />
      {stops.map((stop, index) => {
        const current = index === activeIndex;
        return (
          <Pressable
            key={stop.key}
            disabled={!onSelect}
            onPress={() => onSelect?.(index)}
            accessibilityRole="tab"
            accessibilityState={{ selected: current }}
            hitSlop={8}
            style={styles.hStop}
          >
            <View style={[styles.hDot, current && styles.dotCurrent]} />
            <AppText variant="label" color={current ? 'text' : 'textSecondary'} numberOfLines={1}>
              {stop.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const DOT = 14;

const styles = StyleSheet.create({
  hWrap: { flexDirection: 'row', justifyContent: 'space-between' },
  hLine: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    top: DOT / 2 - 1,
    height: 2,
    backgroundColor: colors.border,
  },
  hStop: { alignItems: 'center', gap: spacing.xs + 2, minWidth: 56 },
  hDot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.brand,
  },
  dotCurrent: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotDone: { backgroundColor: colors.primary, borderColor: colors.primary },

  vRow: { flexDirection: 'row', gap: spacing.ms },
  vTrack: { alignItems: 'center', width: 20 },
  vDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vLine: { flex: 1, width: 2, minHeight: 24, backgroundColor: colors.border },
  lineDone: { backgroundColor: colors.primary },
  vText: { flex: 1, paddingBottom: spacing.ml, gap: 2 },
});
