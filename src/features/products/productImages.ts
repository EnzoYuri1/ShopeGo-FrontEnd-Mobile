import type { ImageSource } from 'expo-image';

import type { Product } from '@/features/products/types/product';

/**
 * Imagens locais dos produtos de demonstração (extraídas do Figma).
 * Ficam fora do `Product` porque o carrinho é persistido em JSON e um `require()`
 * não é estável entre builds. Produtos reais usam `imageUrl`.
 */
interface ProductImageSet {
  /** Imagem do card na Home/Busca. */
  card: ImageSource;
  /** Imagem do banner na tela de detalhe. */
  banner: ImageSource;
  /** Variações de cor mostradas em "Opções disponíveis". */
  variants: ImageSource[];
}

const watchWhite = require('../../../assets/images/products/watch-white.webp');
const watchBlack = require('../../../assets/images/products/watch-black.webp');
const tshirtBlack = require('../../../assets/images/products/tshirt-black.webp');
const tshirtGray = require('../../../assets/images/products/tshirt-gray.webp');
const speaker = require('../../../assets/images/products/speaker.webp');

const imageSets: Record<string, ProductImageSet> = {
  '1': { card: tshirtBlack, banner: tshirtBlack, variants: [tshirtBlack, tshirtGray] },
  '2': {
    card: watchWhite,
    banner: require('../../../assets/images/products/watch-banner.webp'),
    variants: [watchWhite, watchBlack],
  },
  '3': { card: speaker, banner: speaker, variants: [] },
};

export function getProductImages(product: Product): ProductImageSet | undefined {
  // Produto com foto remota (API) nunca usa o asset local: os ids '1'..'3' coincidem.
  if (product.imageUrl) return undefined;
  return imageSets[product.id];
}

/** Fonte da imagem do card: asset local (demo) ou `imageUrl` remota; `undefined` = placeholder. */
export function getCardImageSource(product: Product): ImageSource | undefined {
  if (product.imageUrl) return { uri: product.imageUrl };
  return imageSets[product.id]?.card;
}
