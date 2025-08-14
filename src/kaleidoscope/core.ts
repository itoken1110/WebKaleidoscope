import { KaleidoscopeConfig, ShapeSpec } from '../state';
import { drawShape } from './shapes';
import { rpmToRadPerSec } from '../utils/math';

export class KaleidoscopeCore {
  private ctx: CanvasRenderingContext2D;
  private offscreen: HTMLCanvasElement;
  private offCtx: CanvasRenderingContext2D;
  private rafId = 0;
  private angle = 0;
  private last = 0;

  constructor(private canvas: HTMLCanvasElement, private config: KaleidoscopeConfig) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context not supported');
    this.ctx = ctx;
    this.offscreen = document.createElement('canvas');
    this.offCtx = this.offscreen.getContext('2d')!;
    this.resize(canvas.width, canvas.height);
    this.buildShapes();
  }

  resize(w: number, h: number) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.offscreen.width = w;
    this.offscreen.height = h;
    this.buildShapes();
  }

  setConfig(cfg: KaleidoscopeConfig) {
    this.config = cfg;
    this.buildShapes();
  }

  private buildShapes() {
    const { width, height } = this.offscreen;
    const ctx = this.offCtx;
    ctx.clearRect(0, 0, width, height);
    const radius = width / 10;
    for (const shape of this.config.shapes) {
      ctx.save();
      ctx.translate(width / 2, height / 2 - width / 4);
      drawShape(ctx, shape, radius);
      ctx.restore();
    }
  }

  private frame = (time: number) => {
    const delta = (time - this.last) / 1000;
    this.last = time;
    const omega = rpmToRadPerSec(this.config.rotationRpm);
    this.angle += omega * delta;
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    ctx.fillStyle = this.config.background;
    ctx.fillRect(0, 0, width, height);
    const sectors = this.config.sectors;
    const theta = (2 * Math.PI) / sectors;
    for (let i = 0; i < sectors; i++) {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(this.angle + i * theta);
      if (i % 2 === 1) ctx.scale(-1, 1);
      ctx.drawImage(this.offscreen, -width / 2, -height / 2);
      ctx.restore();
    }
    this.rafId = requestAnimationFrame(this.frame);
  };

  start() {
    this.last = performance.now();
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop() {
    cancelAnimationFrame(this.rafId);
  }
}
