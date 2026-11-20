import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { AuthContext } from '@/features/auth/providers/AuthProvider';
import { resetPassword, signIn, signOut, signUp } from '@/features/auth/services/authService';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider');
  }
  return context;
}

export function useSignIn() {
  return useMutation({ mutationFn: signIn });
}

export function useSignUp() {
  return useMutation({ mutationFn: signUp });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}
