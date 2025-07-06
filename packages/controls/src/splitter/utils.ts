import { SplitterPanelSize, SplitterPanelSizeUnit } from './types';

export function isSplitterPanelSize<U extends SplitterPanelSizeUnit>(
  value: SplitterPanelSize,
  unit: SplitterPanelSizeUnit
): value is SplitterPanelSize<U> {
  return value.endsWith(unit);
}

export function getSplitterPanelSizeUnit(value: SplitterPanelSize): SplitterPanelSizeUnit {
  return value.slice(-2) as SplitterPanelSizeUnit;
}

export function getSplitterPanelSizeValue(value: SplitterPanelSize): number {
  return parseFloat(value.slice(0, -2));
}
