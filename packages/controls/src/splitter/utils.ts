import { SplitterPanelSize, SplitterPanelSizeUnit } from './types';

export function isSplitterPanelSize(value: string): value is SplitterPanelSize {
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
