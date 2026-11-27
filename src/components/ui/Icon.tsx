import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors, type ColorName } from '@/constants';

type Shape =
  | { kind: 'path'; d: string }
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'rect'; x: number; y: number; width: number; height: number; rx?: number };

const p = (d: string): Shape => ({ kind: 'path', d });
const c = (cx: number, cy: number, r: number): Shape => ({ kind: 'circle', cx, cy, r });
const r = (x: number, y: number, width: number, height: number, rx = 0): Shape => ({
  kind: 'rect',
  x,
  y,
  width,
  height,
  rx,
});

/**
 * Ícones do ShopGo: grade 24 px, traço 2 px, pontas arredondadas.
 * Ícones marcados em `FILLABLE` aceitam `filled` (estado ativo/selecionado).
 */
const ICONS = {
  home: [p('M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z')],
  grid: [r(4, 4, 7, 7, 1.5), r(13, 4, 7, 7, 1.5), r(4, 13, 7, 7, 1.5), r(13, 13, 7, 7, 1.5)],
  search: [c(11, 11, 7), p('m20 20-3.5-3.5')],
  bag: [p('M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8z'), p('M9 8V7a3 3 0 0 1 6 0v1')],
  user: [c(12, 8, 4), p('M4 21c1.6-4 4.6-6 8-6s6.4 2 8 6')],
  heart: [p('M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5C19 15.6 12 20 12 20z')],
  star: [p('m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z')],
  bell: [p('M6 9a6 6 0 0 1 12 0c0 6.5 2.5 8 2.5 8h-17S6 15.5 6 9'), p('M10 20.5a2 2 0 0 0 4 0')],
  menu: [p('M4 7h16M4 12h16M4 17h16')],
  close: [p('M6 6l12 12M18 6 6 18')],
  chevronLeft: [p('m15 5-7 7 7 7')],
  chevronRight: [p('m9 5 7 7-7 7')],
  chevronDown: [p('m5 9 7 7 7-7')],
  arrowRight: [p('M4 12h16M14 6l6 6-6 6')],
  plus: [p('M12 5v14M5 12h14')],
  minus: [p('M5 12h14')],
  check: [p('m5 12.5 4.5 4.5L19 7')],
  filter: [p('M4 6h16M7 12h10M10 18h4')],
  trash: [p('M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13')],
  tag: [p('M3 12V4h8l10 10-8 8z'), c(7.5, 7.5, 1.5)],
  percent: [p('M6 18 18 6'), c(7, 7, 2), c(17, 17, 2)],
  truck: [p('M3 6h11v10H3z'), p('M14 10h4l3 3v3h-7'), c(7, 18, 2), c(17, 18, 2)],
  package: [p('M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z'), p('M3 7.5 12 12l9-4.5M12 12v9')],
  creditCard: [r(3, 5, 18, 14, 2), p('M3 10h18')],
  mapPin: [p('M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z'), c(12, 9.5, 2.5)],
  camera: [p('M4 8h3l2-3h6l2 3h3v11H4z'), c(12, 13, 3.5)],
  alert: [c(12, 12, 9), p('M12 7.5V13M12 16.5v.5')],
  logout: [p('M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10')],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;

const FILLABLE: ReadonlySet<IconName> = new Set<IconName>(['heart', 'star', 'home', 'bag', 'tag']);

interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorName;
  /** Preenche o ícone (só para heart, star, home, bag, tag). */
  filled?: boolean;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, color = 'text', filled = false, strokeWidth = 2 }: IconProps) {
  const stroke = colors[color];
  const fill = filled && FILLABLE.has(name) ? stroke : 'none';

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessible={false}
    >
      {ICONS[name].map((shape: Shape, index) => {
        if (shape.kind === 'circle') {
          return <Circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} fill={fill} />;
        }
        if (shape.kind === 'rect') {
          return (
            <Rect
              key={index}
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              rx={shape.rx}
              fill={fill}
            />
          );
        }
        return <Path key={index} d={shape.d} fill={fill} />;
      })}
    </Svg>
  );
}
