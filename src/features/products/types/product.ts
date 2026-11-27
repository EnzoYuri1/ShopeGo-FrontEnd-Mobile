import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  imageUrl: z.string(),
  /** Galeria de fotos (produtos vindos da API). */
  images: z.array(z.string()).optional(),
  /** Cor pastel de fundo do card (cada produto tem a sua no protótipo). */
  cardColor: z.string().min(1),
  /** Percentual de desconto, quando houver. */
  discountPercent: z.number().min(0).max(100).optional(),
  /** Cor de destaque da tela de detalhe (preço, botões). Padrão: cor primária. */
  accentColor: z.string().optional(),
  /** Rótulo da cor/variação exibido abaixo do nome (ex.: "Branco/Preto"). */
  colorLabel: z.string().optional(),
  category: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  /** Nota média de 0 a 5 (vem da API). */
  rating: z.number().min(0).max(5).optional(),
});

export type Product = z.infer<typeof productSchema>;
