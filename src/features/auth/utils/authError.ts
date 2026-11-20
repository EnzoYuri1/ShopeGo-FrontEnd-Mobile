import { strings } from '@/constants';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': strings.errors.invalidCredentials,
  'auth/user-not-found': strings.errors.invalidCredentials,
  'auth/wrong-password': strings.errors.invalidCredentials,
  'auth/email-already-in-use': strings.errors.emailInUse,
  'auth/weak-password': strings.errors.weakPassword,
  'auth/invalid-email': strings.errors.invalidEmail,
  'auth/too-many-requests': strings.errors.tooManyRequests,
  'auth/network-request-failed': strings.errors.network,
};

export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = String((error as { code: unknown }).code);
    if (code in AUTH_ERROR_MESSAGES) {
      return AUTH_ERROR_MESSAGES[code];
    }
  }
  return strings.errors.generic;
}
