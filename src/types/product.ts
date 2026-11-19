export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  /** Cor pastel de fundo do card (cada produto tem a sua no protótipo). */
  cardColor: string;
  /** Percentual de desconto, quando houver. */
  discountPercent?: number;
}
