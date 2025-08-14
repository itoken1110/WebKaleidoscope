export type ShapeType = 'circle' | 'triangle' | 'square' | 'star' | 'line';
export type RgbHex = `#${string}`;

export interface ShapeSpec {
  id: string;
  type: ShapeType;
  color: RgbHex;
}

export interface KaleidoscopeConfig {
  sectors: number;
  rotationRpm: number;
  background: RgbHex;
  shapes: ShapeSpec[];
}

export const defaultConfig: KaleidoscopeConfig = {
  sectors: 12,
  rotationRpm: 1,
  background: '#000000',
  shapes: [
    {
      id: 'shape-1',
      type: 'circle',
      color: '#ff8800',
    },
  ],
};
