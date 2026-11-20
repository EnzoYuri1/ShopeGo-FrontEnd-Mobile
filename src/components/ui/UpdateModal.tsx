import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors, fontSize, fontWeight, radius, spacing, strings } from '@/constants';
import { useAppUpdate } from '@/hooks/useAppUpdate';

export function UpdateModal() {
  const { isModalVisible, isDownloading, error, checkForUpdates, applyUpdate, dismissModal } =
    useAppUpdate();

  useEffect(() => {
    void checkForUpdates({ silent: true });
  }, [checkForUpdates]);

  return (
    <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={dismissModal}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{strings.updates.modalTitle}</Text>
          <Text style={styles.description}>{strings.updates.modalDescription}</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <Button
              title={isDownloading ? strings.updates.updating : strings.updates.updateNow}
              onPress={() => void applyUpdate()}
              loading={isDownloading}
            />

            <Pressable
              onPress={dismissModal}
              disabled={isDownloading}
              style={({ pressed }) => [styles.laterButton, pressed ? styles.pressed : null]}
            >
              <Text style={styles.laterText}>{strings.updates.later}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  error: {
    marginTop: spacing.md,
    fontSize: fontSize.xs,
    color: colors.danger,
    textAlign: 'center',
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  laterButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  laterText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
});
