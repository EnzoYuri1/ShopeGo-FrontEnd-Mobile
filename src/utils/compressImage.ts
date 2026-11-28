export interface CompressOptions {
  maxSize?: number;
  quality?: number;
}

// reduz e comprime uma imagem local em webp
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
  } catch (error) {
    console.warn('[compressImage]', error);
    return uri;
  }
}
