import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Snackbar } from '@/components/ui';
import { spacing } from '@/constants';
import { useFeedbackStore } from '@/store';

const VISIBLE_MS = 3000;
/** Altura aproximada da barra inferior, para o aviso aparecer acima dela. */
const TAB_BAR_CLEARANCE = 64;

/** Mostra o aviso global na base da tela e o esconde sozinho após 3 s. */
export function FeedbackHost() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const current = useFeedbackStore((state) => state.current);
  const hide = useFeedbackStore((state) => state.hide);

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(hide, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [current, hide]);

  if (!current) return null;

  const href = current.actionHref;
  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { bottom: insets.bottom + (current.lift ?? TAB_BAR_CLEARANCE) + spacing.sm }]}
    >
      <Snackbar
        key={current.id}
        message={current.message}
        actionLabel={current.actionLabel}
        onAction={
          href
            ? () => {
                hide();
                router.push(href);
              }
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: spacing.md, right: spacing.md },
});
