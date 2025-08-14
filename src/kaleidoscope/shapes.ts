import { Graphics } from 'pixi.js';
import type { ShapeType, RgbHex } from '../state';

function colorToNumber(color: RgbHex): number {
  return parseInt(color.replace('#', ''), 16);
}

export function createShape(type: ShapeType, color: RgbHex): Graphics {
  const g = new Graphics();
  g.beginFill(colorToNumber(color));
  switch (type) {
    case 'circle':
      g.drawCircle(0, 0, 40);
      break;
    case 'triangle':
      g.drawPolygon([-40, 40, 40, 40, 0, -40]);
      break;
    case 'square':
      g.drawRect(-40, -40, 80, 80);
      break;
    case 'star':
      g.drawStar(0, 0, 5, 40, 20);
      break;
    case 'line':
      g.drawRect(-50, -5, 100, 10);
      break;
  }
  g.endFill();
  // random position inside 200x200 square
  g.position.set((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200);
  return g;
}
