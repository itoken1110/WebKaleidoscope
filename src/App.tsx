import { useEffect, useRef, useState } from 'react';
import { KaleidoscopeCore } from './kaleidoscope/core';
import { KaleidoscopeConfig, ShapeType, defaultConfig } from './state';

export function App() {
  const [config, setConfig] = useState<KaleidoscopeConfig>(defaultConfig);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const coreRef = useRef<KaleidoscopeCore | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const core = new KaleidoscopeCore(canvas, config);
    core.start();
    coreRef.current = core;
    const handleResize = () => {
      const parent = canvas.parentElement!;
      const size = Math.min(parent.clientWidth, parent.clientHeight);
      core.resize(size, size);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      core.stop();
    };
  }, []);

  useEffect(() => {
    coreRef.current?.setConfig(config);
  }, [config]);

  const shape = config.shapes[0];

  return (
    <div id="app">
      <div id="controls">
        <h2>Controls</h2>
        <div>
          <label htmlFor="shape-select">Shape</label>
          <select
            id="shape-select"
            value={shape.type}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                shapes: [{ ...c.shapes[0], type: e.target.value as ShapeType }],
              }))
            }
          >
            <option value="circle">Circle</option>
            <option value="triangle">Triangle</option>
            <option value="square">Square</option>
            <option value="star">Star</option>
            <option value="line">Line</option>
          </select>
        </div>
        <div>
          <label htmlFor="color-input">Color</label>
          <input
            id="color-input"
            type="color"
            value={shape.color}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                shapes: [{ ...c.shapes[0], color: e.target.value }],
              }))
            }
          />
        </div>
        <div>
          <label htmlFor="rotation-range">Rotation (rpm)</label>
          <input
            id="rotation-range"
            type="range"
            min="-5"
            max="5"
            step="0.1"
            value={config.rotationRpm}
            onChange={(e) =>
              setConfig((c) => ({ ...c, rotationRpm: parseFloat(e.target.value) }))
            }
          />
          <span>{config.rotationRpm.toFixed(1)}</span>
        </div>
        <div>
          <label htmlFor="bg-input">Background</label>
          <input
            id="bg-input"
            type="color"
            value={config.background}
            onChange={(e) =>
              setConfig((c) => ({ ...c, background: e.target.value }))
            }
          />
        </div>
        <button onClick={() => setConfig(defaultConfig)}>Reset</button>
      </div>
      <div id="view">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
