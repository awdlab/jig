import {
  SplitterPanelSize,
  SplitterPanelSizeLimit,
  SplitterPanelSizeLimitUnit,
  SplitterPanelSizeUnit,
} from './types';

export function isSplitterPanelSize(value: unknown): value is SplitterPanelSize {
  if (typeof value !== 'string') return false;
  const m = value.match(/^(.+)(px|fr)$/);
  if (!m) return false;
  if (isNaN(parseFloat(m[1]))) return false;
  return true;
}

export function getSplitterPanelSizeUnit(value: SplitterPanelSize): SplitterPanelSizeUnit {
  return value.slice(-2) as SplitterPanelSizeUnit;
}

export function getSplitterPanelSizeValue(value: SplitterPanelSize): number {
  return parseFloat(value.slice(0, -2));
}

export function isSplitterPanelSizeLimit(value: unknown): value is SplitterPanelSize {
  if (typeof value !== 'string') return false;
  const m = value.match(/^(.+)(px|%)$/);
  if (!m) return false;
  if (isNaN(parseFloat(m[1]))) return false;
  return true;
}

export function getSplitterPanelSizeLimitUnit(
  value: SplitterPanelSizeLimit
): SplitterPanelSizeLimitUnit {
  return value.endsWith('px') ? 'px' : '%';
}

export function getSplitterPanelSizeLimitValue(value: SplitterPanelSizeLimit): number {
  return value.endsWith('px') ? parseFloat(value.slice(0, -2)) : parseFloat(value.slice(0, -1));
}
