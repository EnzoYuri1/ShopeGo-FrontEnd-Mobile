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

const watchWhite = require('../../../assets/images/products/watch-white.png');
const watchBlack = require('../../../assets/images/products/watch-black.png');
const tshirtBlack = require('../../../assets/images/products/tshirt-black.png');
const tshirtGray = require('../../../assets/images/products/tshirt-gray.png');
const speaker = require('../../../assets/images/products/speaker.png');

const imageSets: Record<string, ProductImageSet> = {
  '1': { card: tshirtBlack, banner: tshirtBlack, variants: [tshirtBlack, tshirtGray] },
  '2': {
    card: watchWhite,
    banner: require('../../../assets/images/products/watch-banner.png'),
    variants: [watchWhite, watchBlack],
  },
  '3': { card: speaker, banner: speaker, variants: [] },
};

export function getProductImages(product: Product): ProductImageSet | undefined {
  return imageSets[product.id];
}

/** Fonte da imagem do card: asset local (demo) ou `imageUrl` remota; `undefined` = placeholder. */
export function getCardImageSource(product: Product): ImageSource | undefined {
  const local = imageSets[product.id]?.card;
  if (local) return local;
  return product.imageUrl ? { uri: product.imageUrl } : undefined;
}
