import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import {
  updateProfileSchema,
  userProfileSchema,
  type UpdateProfileInput,
  type UserProfile,
} from '@/features/profile/types/profile';
import { db } from '@/services/firebase';

const USERS_COLLECTION = 'users';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, userId));
  if (!snapshot.exists()) {
    return null;
  }

  return userProfileSchema.parse({
    id: snapshot.id,
    ...snapshot.data(),
  });
}

export async function updateUserProfile(userId: string, input: UpdateProfileInput): Promise<void> {
  const payload = updateProfileSchema.parse(input);
  await setDoc(
    doc(db, USERS_COLLECTION, userId),
    { ...payload, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
