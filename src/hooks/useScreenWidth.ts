import { Dimensions, useWindowDimensions } from 'react-native';

// largura máxima do app no web: o layout segue o frame mobile do figma (393 px)
export const MAX_APP_WIDTH = 430;

// dimensions.get('window') captura as dimensões iniciais estáticas na carga do módulo
const initialWindow = Dimensions.get('window');

// usewindowdimensions reage à rotação de tela em tempo real, com fallback de dimensions.get('window')
export function useScreenWidth(): number {
  const { width = initialWindow.width } = useWindowDimensions();
  return Math.min(width, MAX_APP_WIDTH);
}

// usa usewindowdimensions para detectar orientação paisagem ao girar a tela
export function useIsLandscape(): boolean {
  const { width = initialWindow.width, height = initialWindow.height } = useWindowDimensions();
  return width > height;
}

// número de colunas das listas de produtos: 2 em retrato e 4 em paisagem
export function useGridColumns(): number {
  return useIsLandscape() ? 4 : 2;
}
