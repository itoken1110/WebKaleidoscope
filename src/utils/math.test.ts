import { describe, expect, it } from 'vitest';
import { rpmToRadPerSec } from './math';

describe('rpmToRadPerSec', () => {
  it('converts rpm to radians per second', () => {
    expect(rpmToRadPerSec(60)).toBeCloseTo(2 * Math.PI);
  });
});
