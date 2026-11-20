import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { getUserProfile, updateUserProfile } from '@/features/profile/services/profileService';
import type { UpdateProfileInput } from '@/features/profile/types/profile';

export const profileKeys = {
  detail: (userId: string) => ['profile', userId] as const,
};

export function useProfile() {
  const { user } = useAuth();
  const userId = user?.uid ?? '';

  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => getUserProfile(userId),
    enabled: Boolean(userId),
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      return updateUserProfile(user.uid, input);
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(user.uid) });
      }
    },
  });
}
