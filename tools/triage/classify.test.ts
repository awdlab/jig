import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { classify, type RgbaImage } from './classify.ts';

function image(width: number, height: number, fill: [number, number, number] = [255, 255, 255]) {
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data[i * 4] = fill[0];
    data[i * 4 + 1] = fill[1];
    data[i * 4 + 2] = fill[2];
    data[i * 4 + 3] = 255;
  }
  return { width, height, data } satisfies RgbaImage;
}

function setPixel(img: RgbaImage, x: number, y: number, rgb: [number, number, number]) {
  const i = (y * img.width + x) * 4;
  img.data[i] = rgb[0];
  img.data[i + 1] = rgb[1];
  img.data[i + 2] = rgb[2];
}

function fillRect(
  img: RgbaImage,
  x: number,
  y: number,
  w: number,
  h: number,
  rgb: [number, number, number]
) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      setPixel(img, x + dx, y + dy, rgb);
    }
  }
}

test('identical images are safe', () => {
  const expected = image(40, 40);
  const actual = image(40, 40);

  const result = classify(expected, actual);

  assert.equal(result.verdict, 'safe');
  assert.equal(result.components.length, 0);
});

test('a size change is never safe', () => {
  const result = classify(image(40, 40), image(40, 41));

  assert.equal(result.verdict, 'review');
});

test('a solid region over flat background is a regression', () => {
  const expected = image(60, 60);
  const actual = image(60, 60);
  // A light tint, the kind a focus highlight paints: small per-pixel delta,
  // large area, nothing underneath it but flat background.
  fillRect(actual, 10, 10, 30, 14, [232, 236, 247]);

  const result = classify(expected, actual);

  assert.equal(result.verdict, 'regression');
  assert.equal(result.components.length, 1);
  assert.equal(result.components[0]!.survivesErosion, true);
  assert.deepEqual(result.components[0]!.bbox, { x: 10, y: 10, w: 30, h: 14 });
});

test('scattered single pixels along a contrast edge are safe', () => {
  const expected = image(60, 60);
  // A black block gives the right-hand column a hard edge to sit on.
  fillRect(expected, 0, 0, 30, 60, [0, 0, 0]);
  const actual = structuredClone(expected);
  // Rasterisation wobble: isolated pixels straddling that edge.
  for (const y of [8, 17, 29, 38, 51]) {
    setPixel(actual, 30, y, [120, 120, 120]);
  }

  const result = classify(expected, actual);

  assert.equal(result.verdict, 'safe');
});

test('a one pixel line over flat background needs review', () => {
  const expected = image(60, 60);
  const actual = image(60, 60);
  // A border recolour: dies under erosion like antialiasing does, but sits on
  // flat background, so it must not be waved through.
  fillRect(actual, 10, 20, 40, 1, [200, 120, 120]);

  const result = classify(expected, actual);

  assert.equal(result.verdict, 'review');
  assert.equal(result.components[0]!.survivesErosion, false);
});

test('a few stray off-edge pixels are still safe', () => {
  const expected = image(60, 60);
  fillRect(expected, 0, 0, 30, 60, [0, 0, 0]);
  const actual = structuredClone(expected);
  // Mostly edge-aligned wobble plus a couple of strays out in the open — a
  // handful of loose pixels is not a finding.
  for (const y of [8, 17, 29, 38, 51]) {
    setPixel(actual, 30, y, [120, 120, 120]);
  }
  setPixel(actual, 48, 12, [240, 240, 240]);
  setPixel(actual, 52, 44, [240, 240, 240]);

  const result = classify(expected, actual);

  assert.equal(result.verdict, 'safe');
});
