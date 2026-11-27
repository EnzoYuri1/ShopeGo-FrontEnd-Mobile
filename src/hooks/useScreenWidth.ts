import { useWindowDimensions } from 'react-native';

// largura máxima do app no web: o layout segue o frame mobile do figma (393 px)
export const MAX_APP_WIDTH = 430;

// largura útil da tela; no web nunca passa da moldura mobile
export function useScreenWidth(): number {
  const { width } = useWindowDimensions();
  return Math.min(width, MAX_APP_WIDTH);
}

// indica se a janela está em paisagem (largura maior que a altura)
export function useIsLandscape(): boolean {
  const { width, height } = useWindowDimensions();
  return width > height;
}

// número de colunas das listas de produtos: 2 em retrato e 4 em paisagem
export function useGridColumns(): number {
  return useIsLandscape() ? 4 : 2;
}
