import { Application } from 'pixi.js';
import { KaleidoscopeCore } from './kaleidoscope/core';
import { State, KaleidoscopeConfig, ShapeSpec, ShapeType } from './state';
import { FpsMeter } from './utils/fpsMeter';

function $(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element ${id}`);
  return el;
}

(async () => {
  const canvas = $('canvas') as HTMLCanvasElement;
  const app = new Application();
  await app.init({ view: canvas, background: '#000000', antialias: true });

  const initial: KaleidoscopeConfig = {
    sectors: 12,
    rotationRpm: 1,
    background: '#000000',
    shapes: [{ id: 'initial', type: 'circle', color: '#ff8800' }],
  };

  const state = new State(initial);
  const core = new KaleidoscopeCore(app, state.get());
  state.subscribe((cfg) => core.update(cfg));
  new FpsMeter(app.ticker);

  // UI bindings
  const rotation = $('rotation') as HTMLInputElement;
  const rotationValue = $('rotation-value');
  rotation.addEventListener('input', () => {
    const val = parseFloat(rotation.value);
    rotationValue.textContent = val.toFixed(1);
    state.set({ rotationRpm: val });
  });

  const bg = $('background') as HTMLInputElement;
  bg.addEventListener('input', () => state.set({ background: bg.value as any }));

  const shapeType = $('shape-type') as HTMLSelectElement;
  const shapeColor = $('shape-color') as HTMLInputElement;
  $('add-shape').addEventListener('click', () => {
    const spec: ShapeSpec = {
      id: Date.now().toString(),
      type: shapeType.value as ShapeType,
      color: shapeColor.value as any,
    };
    state.setShapes([...state.get().shapes, spec]);
  });

  $('reset').addEventListener('click', () => {
    state.set({
      sectors: 12,
      rotationRpm: 1,
      background: '#000000',
    });
    state.setShapes([{ id: 'initial', type: 'circle', color: '#ff8800' }]);
    rotation.value = '1';
    rotationValue.textContent = '1.0';
    bg.value = '#000000';
    shapeColor.value = '#ff8800';
    shapeType.value = 'circle';
  });

  $('screenshot').addEventListener('click', () => {
    const url = app.renderer.extract.base64();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kaleidoscope.png';
    a.click();
  });
})();
