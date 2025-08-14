import type { Ticker } from 'pixi.js';

export class FpsMeter {
  private last = performance.now();
  private frames = 0;

  constructor(ticker: Ticker) {
    ticker.add(() => this.update());
  }

  private update(): void {
    this.frames++;
    const now = performance.now();
    if (now - this.last >= 1000) {
      console.log(`FPS: ${this.frames}`);
      this.frames = 0;
      this.last = now;
    }
  }
}
