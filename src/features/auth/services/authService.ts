import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  type AuthUser,
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterInput,
} from '@/features/auth/types/auth';
import { auth, db } from '@/services/firebase';

function mapFirebaseUser(user: FirebaseUser): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export async function signIn(input: LoginInput): Promise<AuthUser> {
  const { email, password } = loginSchema.parse(input);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(credential.user);
}

export async function signUp(input: RegisterInput): Promise<AuthUser> {
  const { name, email, password } = registerSchema.parse(input);
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(credential.user, { displayName: name });
  await setDoc(doc(db, 'users', credential.user.uid), {
    name,
    email,
    createdAt: serverTimestamp(),
  });

  return mapFirebaseUser(credential.user);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function resetPassword(input: ForgotPasswordInput): Promise<void> {
  const { email } = forgotPasswordSchema.parse(input);
  await sendPasswordResetEmail(auth, email);
}

export function subscribeToAuthState(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? mapFirebaseUser(user) : null);
  });
}
