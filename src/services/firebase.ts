import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

const { getAuth, initializeAuth } = firebaseAuth;

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

type ReactNativePersistenceFactory = (storage: typeof AsyncStorage) => firebaseAuth.Persistence;

function createAuth(): firebaseAuth.Auth {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  // @firebase/auth expoe getReactNativePersistence no bundle RN (dist/rn), mas nao em auth-public.d.ts
  const getReactNativePersistence = (
    firebaseAuth as unknown as { getReactNativePersistence?: ReactNativePersistenceFactory }
  ).getReactNativePersistence;

  try {
    if (getReactNativePersistence) {
      return initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
    return getAuth(app);
  } catch {
    // Hot Reload pode reexecutar o modulo quando o Auth ja foi inicializado no app
    return getAuth(app);
  }
}

const auth = createAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
