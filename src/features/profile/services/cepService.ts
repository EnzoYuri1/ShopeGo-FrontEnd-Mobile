import { z } from 'zod';

import { strings } from '@/constants';
import { apiGet } from '@/services/api/client';

const viaCepSchema = z.object({
  erro: z.union([z.boolean(), z.string()]).optional(),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  localidade: z.string().optional(),
  uf: z.string().optional(),
});

// consulta endereço na api pública viacep e devolve linha formatada
export async function lookupCep(rawCep: string): Promise<string> {
  const digits = rawCep.replace(/\D/g, '');
  if (digits.length !== 8) {
    throw new Error(strings.profile.cepInvalid);
  }

  const data = await apiGet(`https://viacep.com.br/ws/${digits}/json/`);
  const parsed = viaCepSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(strings.profile.cepFailed);
  }

  const { erro, logradouro, bairro, localidade, uf } = parsed.data;
  if (erro === true || erro === 'true' || !localidade || !uf) {
    throw new Error(strings.profile.cepNotFound);
  }

  const streetPart = [logradouro, bairro]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(', ');
  const cityPart = `${localidade.trim()}/${uf.trim()}`;
  return streetPart ? `${streetPart} - ${cityPart}` : cityPart;
}
