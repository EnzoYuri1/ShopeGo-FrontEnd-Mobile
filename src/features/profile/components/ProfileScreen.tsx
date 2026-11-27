import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Button, Icon, Input, type IconName } from '@/components/ui';
import { colors, radius, spacing, strings } from '@/constants';
import { useAuth, useSignOut } from '@/features/auth/hooks/useAuth';
import { getAvatarUri, saveAvatarUri } from '@/features/profile/avatarStorage';
import { useProfile, useUpdateProfile } from '@/features/profile/hooks/useProfile';
import { compressImage } from '@/utils/compressImage';

type Shortcut = { icon: IconName; label: string; href: '/orders' | '/favorites' | '/offers' };

const SHORTCUTS: Shortcut[] = [
  { icon: 'package', label: strings.profile.orders, href: '/orders' },
  { icon: 'heart', label: strings.profile.favorites, href: '/favorites' },
  { icon: 'tag', label: strings.profile.offers, href: '/offers' },
];

/** Aba Conta: foto, dados pessoais editáveis, atalhos e sair. */
export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const signOut = useSignOut();

  const savedName = profile?.name ?? user?.displayName ?? '';
  const savedPhone = profile?.phone ?? '';
  const savedAddress = profile?.address ?? '';
  const email = profile?.email ?? user?.email ?? '';

  // `draft` só existe durante a edição; fora dela os campos mostram o perfil salvo.
  const [draft, setDraft] = useState<{ name: string; phone: string; address: string } | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const editing = draft !== null;
  const name = draft?.name ?? savedName;
  const phone = draft?.phone ?? savedPhone;
  const address = draft?.address ?? savedAddress;

  useEffect(() => {
    if (!user) return;
    let active = true;
    getAvatarUri(user.uid).then((uri) => {
      if (active) setAvatarUri(uri);
    });
    return () => {
      active = false;
    };
  }, [user]);

  async function handlePickPhoto() {
    try {
      // Import tardio: se o app instalado não tiver o módulo nativo, só este botão falha (a tela abre).
      const ImagePicker = await import('expo-image-picker');
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setMessage({ text: strings.profile.photoDenied, error: true });
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      const pickedUri = result.assets?.[0]?.uri;
      if (result.canceled || !pickedUri) return;
      // Comprime antes de guardar: o avatar não precisa de mais de 512 px.
      const uri = await compressImage(pickedUri);
      setAvatarUri(uri);
      setMessage(null);
      if (user) void saveAvatarUri(user.uid, uri);
    } catch {
      setMessage({ text: strings.profile.photoUnavailable, error: true });
    }
  }

  function startEditing() {
    setMessage(null);
    setDraft({ name: savedName, phone: savedPhone, address: savedAddress });
  }

  function handleCancel() {
    setDraft(null);
    setMessage(null);
  }

  function handleSave() {
    updateProfile.mutate(
      { name: name.trim() || undefined, phone: phone.trim(), address: address.trim() },
      {
        onSuccess: () => {
          setDraft(null);
          setMessage({ text: strings.profile.saved, error: false });
        },
        onError: () => setMessage({ text: strings.profile.saveFailed, error: true }),
      },
    );
  }

  const initial = (savedName || email || '?').trim().charAt(0).toUpperCase();

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="title" accessibilityRole="header">
          {strings.profile.screenTitle}
        </AppText>

        <View style={styles.identity}>
          <Pressable
            onPress={() => void handlePickPhoto()}
            accessibilityRole="button"
            accessibilityLabel={strings.profile.changePhoto}
            style={styles.avatar}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} contentFit="cover" style={styles.avatarImage} />
            ) : (
              <AppText variant="display" color="onBrand">
                {initial}
              </AppText>
            )}
            <View style={styles.cameraBadge}>
              <Icon name="camera" size={14} color="onPrimary" strokeWidth={2.5} />
            </View>
          </Pressable>
          <View style={styles.identityText}>
            <AppText variant="heading" numberOfLines={1}>
              {savedName || strings.profile.guest}
            </AppText>
            {email ? (
              <AppText variant="caption" color="textSecondary" numberOfLines={1}>
                {email}
              </AppText>
            ) : null}
          </View>
        </View>

        {message ? (
          <View style={[styles.message, message.error ? styles.messageError : styles.messageOk]}>
            <Icon
              name={message.error ? 'alert' : 'check'}
              size={18}
              color={message.error ? 'danger' : 'successText'}
            />
            <AppText
              variant="caption"
              color={message.error ? 'danger' : 'successText'}
              style={styles.messageText}
              accessibilityRole="alert"
            >
              {message.text}
            </AppText>
          </View>
        ) : null}

        <View style={styles.section}>
          <AppText variant="subheading">{strings.profile.personalData}</AppText>
          <Input
            label={strings.profile.name}
            value={name}
            editable={editing}
            onChangeText={(text) => setDraft((prev) => (prev ? { ...prev, name: text } : prev))}
            autoComplete="name"
          />
          <Input
            label={strings.profile.phone}
            value={phone}
            editable={editing}
            placeholder={editing ? strings.profile.phonePlaceholder : undefined}
            keyboardType="phone-pad"
            autoComplete="tel"
            onChangeText={(text) => setDraft((prev) => (prev ? { ...prev, phone: text } : prev))}
          />
          <Input
            label={strings.profile.address}
            value={address}
            editable={editing}
            placeholder={editing ? strings.profile.addressPlaceholder : undefined}
            autoComplete="street-address"
            onChangeText={(text) => setDraft((prev) => (prev ? { ...prev, address: text } : prev))}
          />

          {editing ? (
            <View style={styles.editActions}>
              <Button
                title={strings.profile.cancel}
                variant="outline"
                fullWidth={false}
                onPress={handleCancel}
                style={styles.editAction}
              />
              <Button
                title={strings.profile.save}
                fullWidth={false}
                onPress={handleSave}
                loading={updateProfile.isPending}
                style={styles.editAction}
              />
            </View>
          ) : (
            <Button
              title={strings.profile.edit}
              variant="outline"
              icon="user"
              onPress={startEditing}
            />
          )}
        </View>

        <View style={styles.section}>
          <AppText variant="subheading">{strings.profile.shortcuts}</AppText>
          <View style={styles.shortcuts}>
            {SHORTCUTS.map((item, index) => (
              <Pressable
                key={item.href}
                onPress={() => router.push(item.href)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.shortcut,
                  index > 0 ? styles.shortcutDivider : null,
                  pressed ? styles.shortcutPressed : null,
                ]}
              >
                <View style={styles.shortcutIcon}>
                  <Icon name={item.icon} size={20} color="brand" />
                </View>
                <AppText variant="bodyStrong" style={styles.shortcutLabel}>
                  {item.label}
                </AppText>
                <Icon name="chevronRight" size={18} color="textSecondary" />
              </Pressable>
            ))}
          </View>
        </View>

        <Button
          title={strings.profile.signOut}
          variant="ghost"
          icon="logout"
          onPress={() => signOut.mutate()}
          loading={signOut.isPending}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const AVATAR = 72;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xl },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: { width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.background,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: { flex: 1, gap: 2 },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.ms,
    borderRadius: radius.md,
  },
  messageOk: { backgroundColor: colors.successLight },
  messageError: { backgroundColor: colors.dangerLight },
  messageText: { flex: 1 },
  section: { gap: spacing.md },
  editActions: { flexDirection: 'row', gap: spacing.ms },
  editAction: { flex: 1 },
  shortcuts: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  shortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.ms,
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
  shortcutDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  shortcutPressed: { backgroundColor: colors.surface },
  shortcutIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceBrand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutLabel: { flex: 1 },
});
