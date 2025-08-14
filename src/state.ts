export type ShapeType = 'circle' | 'triangle' | 'square' | 'star' | 'line';
export type RgbHex = `#${string}`;

export interface ShapeSpec {
  id: string;
  type: ShapeType;
  color: RgbHex;
}

export interface KaleidoscopeConfig {
  sectors: number;
  rotationRpm: number; // -5..5
  background: RgbHex;
  shapes: ShapeSpec[];
}

type Listener = (cfg: KaleidoscopeConfig) => void;

export class State {
  private cfg: KaleidoscopeConfig;
  private listeners = new Set<Listener>();

  constructor(initial: KaleidoscopeConfig) {
    this.cfg = initial;
  }

  get(): KaleidoscopeConfig {
    return this.cfg;
  }

  set(partial: Partial<KaleidoscopeConfig>): void {
    this.cfg = { ...this.cfg, ...partial };
    this.emit();
  }

  setShapes(shapes: ShapeSpec[]): void {
    this.cfg = { ...this.cfg, shapes };
    this.emit();
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(): void {
    for (const fn of this.listeners) fn(this.cfg);
  }
}
