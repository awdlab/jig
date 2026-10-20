export type RgbaImage = { width: number; height: number; data: Uint8Array };

export type Component = {
  area: number;
  bbox: { x: number; y: number; w: number; h: number };
  /** Pixels that keep all four orthogonal neighbours — a solid core, not a thin run. */
  coreArea: number;
  /** Pixels with no contrast nearby in the expected image to explain them. */
  offEdgeArea: number;
  survivesErosion: boolean;
  flatFraction: number;
};

export type Verdict = 'safe' | 'review' | 'regression';

export type Classification = {
  verdict: Verdict;
  components: Component[];
  diffPixels: number;
  offEdgePixels: number;
  reason: string;
};

export type Thresholds = {
  /** Max per-channel delta still counted as the same pixel. Deliberately low. */
  colorEps: number;
  /** Luminance range in the expected neighbourhood that marks contrast. */
  edgeRange: number;
  /** How far a pixel may sit from that contrast and still be explained by it. */
  edgeRadius: number;
  /** Solid, unexplained area a region needs before it counts as a regression. */
  minArea: number;
  /** Unexplained pixels tolerated across the whole image before it leaves `safe`. */
  offEdgeMax: number;
};

export const defaultThresholds: Thresholds = {
  colorEps: 4,
  edgeRange: 24,
  edgeRadius: 2,
  minArea: 150,
  offEdgeMax: 20,
};

function luminance(data: Uint8Array, i: number) {
  return 0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!;
}

function diffMask(expected: RgbaImage, actual: RgbaImage, colorEps: number) {
  const { width, height } = expected;
  const mask = new Uint8Array(width * height);
  for (let p = 0; p < width * height; p++) {
    const i = p * 4;
    const d = Math.max(
      Math.abs(expected.data[i]! - actual.data[i]!),
      Math.abs(expected.data[i + 1]! - actual.data[i + 1]!),
      Math.abs(expected.data[i + 2]! - actual.data[i + 2]!)
    );
    if (d > colorEps) mask[p] = 1;
  }
  return mask;
}

/**
 * Where the expected image has enough local contrast for a rasteriser to disagree
 * with itself. Separable min/max over a (2r+1) window so the cost stays linear.
 */
function edgeMask(expected: RgbaImage, edgeRange: number, radius: number) {
  const { width, height, data } = expected;
  const lum = new Float32Array(width * height);
  for (let p = 0; p < width * height; p++) lum[p] = luminance(data, p * 4);

  const rowMin = new Float32Array(width * height);
  const rowMax = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let min = Infinity;
      let max = -Infinity;
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        if (nx < 0 || nx >= width) continue;
        const l = lum[y * width + nx]!;
        if (l < min) min = l;
        if (l > max) max = l;
      }
      rowMin[y * width + x] = min;
      rowMax[y * width + x] = max;
    }
  }

  const mask = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let min = Infinity;
      let max = -Infinity;
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        const a = rowMin[ny * width + x]!;
        const b = rowMax[ny * width + x]!;
        if (a < min) min = a;
        if (b > max) max = b;
      }
      if (max - min > edgeRange) mask[y * width + x] = 1;
    }
  }
  return mask;
}

function isCore(mask: Uint8Array, width: number, height: number, x: number, y: number) {
  if (x === 0 || y === 0 || x === width - 1 || y === height - 1) return false;
  return (
    mask[y * width + x - 1] === 1 &&
    mask[y * width + x + 1] === 1 &&
    mask[(y - 1) * width + x] === 1 &&
    mask[(y + 1) * width + x] === 1
  );
}

function components(mask: Uint8Array, edges: Uint8Array, width: number, height: number) {
  const seen = new Uint8Array(width * height);
  const out: Component[] = [];
  const stack: number[] = [];

  for (let start = 0; start < mask.length; start++) {
    if (mask[start] !== 1 || seen[start] === 1) continue;

    seen[start] = 1;
    stack.push(start);
    let area = 0;
    let offEdge = 0;
    let core = 0;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    while (stack.length > 0) {
      const p = stack.pop()!;
      const x = p % width;
      const y = (p - x) / width;

      area++;
      const off = edges[p] !== 1;
      if (off) offEdge++;
      if (off && isCore(mask, width, height, x, y)) core++;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;

      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          const q = ny * width + nx;
          if (mask[q] === 1 && seen[q] === 0) {
            seen[q] = 1;
            stack.push(q);
          }
        }
      }
    }

    out.push({
      area,
      bbox: { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 },
      coreArea: core,
      offEdgeArea: offEdge,
      survivesErosion: core > 0,
      flatFraction: offEdge / area,
    });
  }

  return out;
}

/**
 * Sorts a snapshot change into safe / review / regression. A change earns `safe`
 * only by being fully explained by contrast already in the expected image, which
 * is where a rasteriser is free to disagree between engine builds. Pixels with no
 * such contrast near them are unexplained, and unexplained pixels in a solid mass
 * are a regression.
 */
export function classify(
  expected: RgbaImage,
  actual: RgbaImage,
  thresholds: Thresholds = defaultThresholds
): Classification {
  if (expected.width !== actual.width || expected.height !== actual.height) {
    return {
      verdict: 'review',
      components: [],
      diffPixels: 0,
      offEdgePixels: 0,
      reason: `size changed ${expected.width}x${expected.height} to ${actual.width}x${actual.height}`,
    };
  }

  const mask = diffMask(expected, actual, thresholds.colorEps);
  const edges = edgeMask(expected, thresholds.edgeRange, thresholds.edgeRadius);
  const found = components(mask, edges, expected.width, expected.height);

  const diffPixels = found.reduce((n, c) => n + c.area, 0);
  const offEdgePixels = found.reduce((n, c) => n + c.offEdgeArea, 0);

  if (diffPixels === 0) {
    return { verdict: 'safe', components: [], diffPixels, offEdgePixels, reason: 'identical' };
  }

  found.sort((a, b) => b.offEdgeArea - a.offEdgeArea || b.area - a.area);

  const solid = found.find(
    c => c.coreArea >= thresholds.minArea && c.offEdgeArea >= thresholds.minArea
  );
  if (solid) {
    return {
      verdict: 'regression',
      components: found,
      diffPixels,
      offEdgePixels,
      reason: `solid ${solid.offEdgeArea}px region with no edge to explain it at ${solid.bbox.x},${solid.bbox.y}`,
    };
  }

  if (offEdgePixels <= thresholds.offEdgeMax) {
    return {
      verdict: 'safe',
      components: found,
      diffPixels,
      offEdgePixels,
      reason: `${diffPixels}px, all but ${offEdgePixels} explained by nearby contrast`,
    };
  }

  return {
    verdict: 'review',
    components: found,
    diffPixels,
    offEdgePixels,
    reason: `${offEdgePixels}px with no nearby contrast, largest patch ${found[0]!.offEdgeArea}px`,
  };
}
