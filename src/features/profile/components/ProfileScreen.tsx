import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { BackButton, BrandLogo, Button } from '@/components/ui';
import { colors, fontFamily, strings } from '@/constants';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getAvatarUri, saveAvatarUri } from '@/features/profile/avatarStorage';
import { useProfile, useUpdateProfile } from '@/features/profile/hooks/useProfile';

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

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
    const uri = result.assets?.[0]?.uri;
    if (result.canceled || !uri) return;
    setAvatarUri(uri);
    setMessage(null);
    if (user) void saveAvatarUri(user.uid, uri);
  }

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)');
  }

  function handleCancel() {
    setDraft(null);
    setMessage(null);
  }

  function handlePrimary() {
    if (!editing) {
      setMessage(null);
      setDraft({ name: savedName, phone: savedPhone, address: savedAddress });
      return;
    }

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

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <BackButton onPress={handleBack} />
        <BrandLogo />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} contentFit="cover" style={styles.avatarImage} />
            ) : (
              <Svg width={112} height={112} viewBox="0 0 96 96">
                <Circle cx={48} cy={48} r={48} fill="#F4896B" />
                <Circle cx={48} cy={38} r={15} fill="#1B1B1B" />
                <Path d="M16 90c2-20 16-30 32-30s30 10 32 30a48 48 0 0 1-64 0z" fill="#1B1B1B" />
              </Svg>
            )}
          </View>
          <Pressable
            onPress={handlePickPhoto}
            accessibilityRole="button"
            accessibilityLabel={strings.profile.changePhoto}
            style={({ pressed }) => [styles.pencil, pressed ? styles.pressed : null]}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4"
                stroke={colors.white}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </View>
        <Text style={styles.name}>{savedName || strings.profile.guest}</Text>

        <View style={styles.form}>
          <Field
            label={strings.profile.name}
            value={name}
            editable={editing}
            onChangeText={(value) => setDraft((d) => d && { ...d, name: value })}
            autoComplete="name"
          />
          <Field
            label={strings.profile.address}
            value={address}
            editable={editing}
            onChangeText={(value) => setDraft((d) => d && { ...d, address: value })}
            autoComplete="street-address"
          />
          <Field label={strings.profile.email} value={email} editable={false} />
          <Field
            label={strings.profile.phone}
            value={phone}
            editable={editing}
            onChangeText={(value) => setDraft((d) => d && { ...d, phone: value })}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
        </View>

        {message ? (
          <Text style={[styles.message, message.error ? styles.messageError : null]}>
            {message.text}
          </Text>
        ) : null}

        <View style={styles.actions}>
          <Button
            title={editing ? strings.profile.save : strings.profile.edit}
            onPress={handlePrimary}
            loading={updateProfile.isPending}
            style={styles.primary}
          />
          <Button
            title={strings.profile.cancel}
            variant="outline"
            onPress={editing ? handleCancel : handleBack}
            style={styles.cancel}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface FieldProps {
  label: string;
  value: string;
  editable: boolean;
  onChangeText?: (value: string) => void;
  keyboardType?: 'default' | 'phone-pad';
  autoComplete?: 'name' | 'street-address' | 'tel';
}

function Field({ label, value, editable, onChangeText, keyboardType, autoComplete }: FieldProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        style={[styles.input, editable ? styles.inputEditable : null]}
      />
    </View>
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
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarWrap: {
    width: 112,
    height: 112,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#FFF3EC',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 112,
    height: 112,
  },
  pencil: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  name: {
    marginTop: 12,
    fontFamily: fontFamily.interBold,
    fontSize: 18,
    color: colors.black,
  },
  form: {
    width: '100%',
    marginTop: 22,
    gap: 14,
  },
  label: {
    marginBottom: 4,
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  input: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E9EEFB',
    paddingHorizontal: 14,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.black,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputEditable: {
    backgroundColor: colors.white,
    borderColor: '#2B7BFF',
  },
  message: {
    marginTop: 14,
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.success,
  },
  messageError: {
    color: colors.danger,
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 14,
    marginTop: 26,
  },
  primary: {
    flex: 1,
    width: undefined,
    backgroundColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  cancel: {
    flex: 1,
    width: undefined,
    borderWidth: 1,
    borderColor: colors.black,
  },
});
