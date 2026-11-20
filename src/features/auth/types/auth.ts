import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome'),
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
