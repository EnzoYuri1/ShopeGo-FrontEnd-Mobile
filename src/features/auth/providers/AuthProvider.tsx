import { createContext, useEffect, useState, type PropsWithChildren } from 'react';

import { subscribeToAuthState } from '@/features/auth/services/authService';
import type { AuthUser } from '@/features/auth/types/auth';

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: user !== null }}>
      {children}
    </AuthContext.Provider>
  );
}
