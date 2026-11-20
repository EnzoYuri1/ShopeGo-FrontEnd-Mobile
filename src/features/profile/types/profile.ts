import { z } from 'zod';

export const userProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type User = UserProfile;

export const updateProfileSchema = userProfileSchema
  .pick({
    name: true,
    phone: true,
    address: true,
    avatarUrl: true,
  })
  .partial();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
