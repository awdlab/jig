import type {
  ExpandedResizeLimit,
  ExpandedResizeSize,
  ResizeLimit,
  ResizeLimitUnit,
  ResizeSize,
  ResizeSizeUnit,
} from './types';

// --- Size parsing ---

export function isResizeSize(value: unknown): value is ResizeSize {
  if (typeof value !== 'string') return false;
  const m = value.match(/^(.+)(px|fr|%)$/);
  if (!m || !m[1]) return false;
  if (isNaN(parseFloat(m[1]))) return false;
  return true;
}

export function getResizeSizeUnit(value: ResizeSize): ResizeSizeUnit {
  if (value.endsWith('px')) return 'px';
  if (value.endsWith('fr')) return 'fr';
  return '%';
}

export function getResizeSizeValue(value: ResizeSize): number {
  const unit = getResizeSizeUnit(value);
  return parseFloat(value.slice(0, -unit.length));
}

export function expandResizeSize(value: ResizeSize): ExpandedResizeSize {
  return {
    value: getResizeSizeValue(value),
    unit: getResizeSizeUnit(value),
  };
}

export function collapseResizeSize(size: ExpandedResizeSize): ResizeSize {
  return `${size.value}${size.unit}`;
}

// --- Limit parsing ---

export function isResizeLimit(value: unknown): value is ResizeLimit {
  if (typeof value !== 'string') return false;
  const m = value.match(/^(.+)(px|%)$/);
  if (!m || !m[1]) return false;
  if (isNaN(parseFloat(m[1]))) return false;
  return true;
}

export function getResizeLimitUnit(value: ResizeLimit): ResizeLimitUnit {
  return value.endsWith('px') ? 'px' : '%';
}

export function getResizeLimitValue(value: ResizeLimit): number {
  return value.endsWith('px') ? parseFloat(value.slice(0, -2)) : parseFloat(value.slice(0, -1));
}

export function getResizeLimitInPx(value: ResizeLimit, containerSize: number): number {
  const unit = getResizeLimitUnit(value);
  const sizeValue = getResizeLimitValue(value);
  return unit === 'px' ? sizeValue : (sizeValue / 100) * containerSize;
}

export function expandResizeLimit(value: ResizeLimit): ExpandedResizeLimit {
  return {
    value: getResizeLimitValue(value),
    unit: getResizeLimitUnit(value),
  };
}

export function collapseResizeLimit(size: ExpandedResizeLimit): ResizeLimit {
  return `${size.value}${size.unit}`;
}

// --- Pixel resolution ---

/**
 * Resolves a size to its pixel equivalent given the current fraction factors and container size.
 */
export function resolveSizeToPx(
  size: ExpandedResizeSize,
  pxPerFr: number,
  containerSize: number
): number {
  switch (size.unit) {
    case 'px':
      return size.value;
    case 'fr':
      return pxPerFr * size.value;
    case '%':
      return (size.value / 100) * containerSize;
  }
}

/**
 * Converts a pixel delta to the appropriate value delta for the given unit.
 */
export function pxDeltaToUnitDelta(
  pxDelta: number,
  unit: ResizeSizeUnit,
  frPerPx: number,
  percentPerPx: number
): number {
  switch (unit) {
    case 'px':
      return pxDelta;
    case 'fr':
      return pxDelta * frPerPx;
    case '%':
      return pxDelta * percentPerPx;
  }
}
