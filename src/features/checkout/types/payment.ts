import { z } from 'zod';

import { strings } from '@/constants';

export type PaymentMethod = 'card' | 'other';

export const cardTypeSchema = z.enum(['visa', 'mastercard']);
export type CardType = z.infer<typeof cardTypeSchema>;

/**
 * Validação do formulário de cartão. Estes dados NUNCA são salvos nem enviados:
 * o pedido guarda apenas o método (ex.: "card:visa"). A cobrança real depende do backend.
 */
export const cardFormSchema = z
  .object({
    cardType: cardTypeSchema,
    cardNumber: z
      .string()
      .transform((value) => value.replace(/\s/g, ''))
      .pipe(z.string().regex(/^\d{16}$/, strings.checkout.invalidCardNumber)),
    expMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, strings.checkout.invalidExpiry),
    expYear: z.string().regex(/^\d{4}$/, strings.checkout.invalidExpiry),
    cvn: z.string().regex(/^\d{3,4}$/, strings.checkout.invalidCvn),
  })
  .refine(
    ({ expMonth, expYear }) => {
      const now = new Date();
      const year = Number(expYear);
      const month = Number(expMonth);
      return (
        year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
      );
    },
    { message: strings.checkout.expired, path: ['expMonth'] },
  );

export type CardFormInput = z.input<typeof cardFormSchema>;
