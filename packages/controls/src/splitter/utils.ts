import {
  SplitterPanelSize,
  SplitterPanelSizeLimit,
  SplitterPanelSizeLimitUnit,
  SplitterPanelSizeUnit,
} from './types';

export type ExpandedSplitterPanelSize = {
  value: number;
  unit: SplitterPanelSizeUnit;
};
export type ExpandedSplitterPanelSizeLimit = {
  value: number;
  unit: SplitterPanelSizeLimitUnit;
};

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

export function getSplitterPanelSizeLimitInPx(
  value: SplitterPanelSizeLimit,
  totalSize: number
): number {
  const unit = getSplitterPanelSizeLimitUnit(value);
  const sizeValue = getSplitterPanelSizeLimitValue(value);
  return unit === 'px' ? sizeValue : (sizeValue / 100) * totalSize;
}

export function expandSplitterPanelSize(value: SplitterPanelSize): ExpandedSplitterPanelSize {
  return {
    value: getSplitterPanelSizeValue(value),
    unit: getSplitterPanelSizeUnit(value),
  };
}

export function expandSplitterPanelSizeLimit(
  value: SplitterPanelSizeLimit
): ExpandedSplitterPanelSizeLimit {
  return {
    value: getSplitterPanelSizeLimitValue(value),
    unit: getSplitterPanelSizeLimitUnit(value),
  };
}

export function collapseSplitterPanelSize(size: ExpandedSplitterPanelSize): SplitterPanelSize {
  return `${size.value}${size.unit}`;
}

export function collapseSplitterPanelSizeLimit(
  size: ExpandedSplitterPanelSizeLimit
): SplitterPanelSizeLimit {
  return `${size.value}${size.unit}`;
}
