import AsyncStorage from '@react-native-async-storage/async-storage';

const key = (userId: string) => `shopgo-avatar-${userId}`;

// foto de perfil escolhida na galeria, guardada localmente
export async function getAvatarUri(userId: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key(userId));
  } catch (error) {
    console.warn('[avatarStorage] getAvatarUri:', error);
    return null;
  }
}

export async function saveAvatarUri(userId: string, uri: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key(userId), uri);
  } catch (error) {
    console.warn('[avatarStorage] saveAvatarUri:', error);
  }
}
