export interface CompressOptions {
  /** Maior lado da imagem final, em pixels. */
  maxSize?: number;
  /** Qualidade de 0 a 1 (menor = arquivo menor). */
  quality?: number;
}

/**
 * Reduz e comprime uma imagem local em WebP. Se o módulo nativo não existir
 * no app instalado ou a compressão falhar, devolve a URI original.
 */
export async function compressImage(
  uri: string,
  { maxSize = 512, quality = 0.7 }: CompressOptions = {},
): Promise<string> {
  try {
    const { ImageManipulator, SaveFormat } = await import('expo-image-manipulator');
    const context = ImageManipulator.manipulate(uri);
    const image = await context.resize({ width: maxSize }).renderAsync();
    const result = await image.saveAsync({ compress: quality, format: SaveFormat.WEBP });
    return result.uri;
  } catch {
    return uri;
  }
}
