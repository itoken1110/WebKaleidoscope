export function rpmToRadPerSec(rpm: number): number {
  return (rpm * 2 * Math.PI) / 60;
}
