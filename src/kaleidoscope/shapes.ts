import { ShapeSpec } from '../state';

export function drawShape(ctx: CanvasRenderingContext2D, spec: ShapeSpec, radius: number): void {
  ctx.fillStyle = spec.color;
  ctx.strokeStyle = spec.color;
  ctx.lineWidth = 2;
  switch (spec.type) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'square':
      ctx.beginPath();
      ctx.rect(-radius, -radius, radius * 2, radius * 2);
      ctx.fill();
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -radius);
      ctx.lineTo(radius, radius);
      ctx.lineTo(-radius, radius);
      ctx.closePath();
      ctx.fill();
      break;
    case 'star':
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outer = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const inner = outer + Math.PI / 5;
        ctx.lineTo(Math.cos(outer) * radius, Math.sin(outer) * radius);
        ctx.lineTo(Math.cos(inner) * (radius / 2), Math.sin(inner) * (radius / 2));
      }
      ctx.closePath();
      ctx.fill();
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(-radius, 0);
      ctx.lineTo(radius, 0);
      ctx.stroke();
      break;
  }
}
