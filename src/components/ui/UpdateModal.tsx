import { useEffect } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { BrandMark } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { colors, elevation, radius, spacing, strings } from '@/constants';
import { useAppUpdate } from '@/hooks/useAppUpdate';

// aviso de nova versão do app (eas update), com "atualizar agora" e "depois"
export function UpdateModal() {
  const { isModalVisible, isDownloading, error, checkForUpdates, applyUpdate, dismissModal } =
    useAppUpdate();

  useEffect(() => {
    void checkForUpdates({ silent: true });
  }, [checkForUpdates]);

  return (
    <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={dismissModal}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityViewIsModal>
          <BrandMark size={40} />
          <AppText variant="heading" accessibilityRole="header">
            {strings.updates.modalTitle}
          </AppText>
          <AppText variant="body" color="textSecondary">
            {strings.updates.modalDescription}
          </AppText>
          {error ? (
            <AppText variant="caption" color="danger" accessibilityRole="alert">
              {error}
            </AppText>
          ) : null}
          <View style={styles.actions}>
            <Button
              title={isDownloading ? strings.updates.updating : strings.updates.updateNow}
              onPress={() => void applyUpdate()}
              loading={isDownloading}
            />
            <Button
              title={strings.updates.later}
              variant="ghost"
              onPress={dismissModal}
              disabled={isDownloading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    gap: spacing.ms,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    ...elevation.overlay,
  },
  actions: { gap: spacing.xs, marginTop: spacing.sm },
});
