import { Application, Container, Sprite, RenderTexture } from 'pixi.js';
import type { KaleidoscopeConfig, ShapeSpec } from '../state';
import { createShape } from './shapes';

export class KaleidoscopeCore {
  private app: Application;
  private root: Container;
  private baseContainer: Container;
  private sectors: Sprite[] = [];
  private angularVelocity = 0; // rad per sec

  constructor(app: Application, config: KaleidoscopeConfig) {
    this.app = app;
    this.root = new Container();
    this.root.position.set(app.renderer.width / 2, app.renderer.height / 2);
    this.app.stage.addChild(this.root);
    this.baseContainer = new Container();
    this.update(config);
    this.app.ticker.add((delta) => this.tick(delta));
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  update(cfg: KaleidoscopeConfig): void {
    this.app.renderer.background.color = parseInt(cfg.background.replace('#', ''), 16);
    this.angularVelocity = (cfg.rotationRpm * Math.PI * 2) / 60;
    this.rebuildShapes(cfg.shapes);
    this.rebuildSectors(cfg.sectors);
  }

  private rebuildShapes(shapes: ShapeSpec[]): void {
    this.baseContainer.removeChildren();
    for (const s of shapes) {
      this.baseContainer.addChild(createShape(s.type, s.color));
    }
  }

  private rebuildSectors(sectors: number): void {
    this.root.removeChildren();
    const renderer = this.app.renderer;
    const rt = RenderTexture.create({width: 400, height: 400});
    renderer.render(this.baseContainer, { renderTexture: rt });
    this.sectors = [];
    const theta = (Math.PI * 2) / sectors;
    for (let i = 0; i < sectors; i++) {
      const sp = new Sprite(rt);
      sp.anchor.set(0.5);
      sp.rotation = i * theta;
      if (i % 2 === 1) {
        sp.scale.x = -1;
      }
      this.root.addChild(sp);
      this.sectors.push(sp);
    }
  }

  private tick(delta: number): void {
    const deltaSec = delta / 60; // Pixi ticker default 60fps basis
    this.root.rotation += this.angularVelocity * deltaSec;
  }

  private resize(): void {
    const parent = this.app.view.parentElement as HTMLElement;
    const size = Math.min(parent.clientWidth, parent.clientHeight);
    this.app.renderer.resize(size, size);
    this.root.position.set(size / 2, size / 2);
    this.root.scale.set(size / 400);
  }
}
