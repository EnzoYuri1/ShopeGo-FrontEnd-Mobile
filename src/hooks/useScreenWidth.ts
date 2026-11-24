import { useWindowDimensions } from 'react-native';

/** Largura máxima do app no web: o layout segue o frame mobile do Figma (393 px). */
export const MAX_APP_WIDTH = 430;

/** Largura útil da tela; no web nunca passa da moldura mobile. */
export function useScreenWidth(): number {
  const { width } = useWindowDimensions();
  return Math.min(width, MAX_APP_WIDTH);
}
