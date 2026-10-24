/** Number of decimal places of `value` (bounded to 20, exponent-safe). */
export function decimalPlaces(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  let factor = 1;
  let places = 0;
  while (Math.round(value * factor) / factor !== value && places < 20) {
    factor *= 10;
    places++;
  }
  return places;
}

/** Rounds `value` to `decimals` decimal places (float-drift cleanup). */
export function roundToPrecision(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Adds `delta` to `base` and rounds the result to the operands' combined
 * precision, so repeated stepping never surfaces float drift (`0.1 + 0.2`).
 */
export function addWithPrecision(base: number, delta: number): number {
  return roundToPrecision(base + delta, Math.max(decimalPlaces(base), decimalPlaces(delta)));
}
