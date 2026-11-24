import AsyncStorage from '@react-native-async-storage/async-storage';

const key = (userId: string) => `shopgo-avatar-${userId}`;

/** Foto de perfil escolhida na galeria, guardada localmente (URI do arquivo). */
export async function getAvatarUri(userId: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key(userId));
  } catch {
    return null;
  }
}

export async function saveAvatarUri(userId: string, uri: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key(userId), uri);
  } catch {
    // Sem persistência a foto vale só nesta sessão.
  }
}
