import { stringMatches } from './string-match';

type NgnFilterDataType = 'string' | 'number' | 'date' | 'dateTime' | 'boolean' | 'custom';

type NgnFilterMatchMode = 'all' | 'any';

type NgnFilterKind = 'default' | 'list';

type NgnFilterOperatorId =
  | 'isEqual'
  | 'isNotEqual'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'isTrue'
  | 'isFalse'
  | 'custom';

type NgnFilterConditionConfig = {
  operator: NgnFilterOperatorId;
  rawValue: string | null;
};

type NgnFilterConfig = {
  kind?: NgnFilterKind;
  dataType: NgnFilterDataType;
  matchMode: NgnFilterMatchMode;
  conditions: readonly NgnFilterConditionConfig[];
};

type NgnFilterCondition = {
  operator: NgnFilterOperatorId;
  value: unknown;
};

export type NgnFilterValueSelector<T> = (item: T) => unknown;

function normalizeString(value: unknown): string {
  return (value ?? '').toString().toLowerCase();
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function asDateMs(value: unknown): number | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.getTime();
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
  }
  return null;
}

function operatorRequiresValue(operator: NgnFilterOperatorId): boolean {
  switch (operator) {
    case 'isEmpty':
    case 'isNotEmpty':
    case 'isTrue':
    case 'isFalse':
      return false;
    default:
      return true;
  }
}

export function parseFilterRawValue(raw: string | null, dataType: NgnFilterDataType): unknown {
  if (raw == null || raw === '') {
    return null;
  }

  switch (dataType) {
    case 'string':
      return raw;
    case 'number':
      return asNumber(raw);
    case 'date':
    case 'dateTime': {
      const d = new Date(raw);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    case 'boolean':
      return raw === 'true';
    case 'custom':
      return raw;
  }
}

export function getActiveFilterConditions(config: NgnFilterConfig): readonly NgnFilterCondition[] {
  const dt = config.dataType;
  return config.conditions
    .map(c => {
      const requiresValue = operatorRequiresValue(c.operator);
      const parsed =
        c.operator === 'in' && dt === 'string'
          ? (() => {
              if (!c.rawValue) {
                return null;
              }
              try {
                const v = JSON.parse(c.rawValue) as unknown;
                return Array.isArray(v) ? v.map(x => String(x)) : null;
              } catch {
                return null;
              }
            })()
          : parseFilterRawValue(c.rawValue, dt);
      if (requiresValue && (parsed == null || parsed === '')) {
        return null;
      }
      if (c.operator === 'in' && Array.isArray(parsed) && parsed.length === 0) {
        return null;
      }
      return <NgnFilterCondition>{ operator: c.operator, value: parsed };
    })
    .filter((x): x is NgnFilterCondition => x != null);
}

function matchesValue(
  value: unknown,
  dataType: NgnFilterDataType,
  condition: NgnFilterCondition
): boolean {
  switch (dataType) {
    case 'string': {
      const left = normalizeString(value);
      switch (condition.operator) {
        case 'isEqual':
          return left === normalizeString(condition.value);
        case 'isNotEqual':
          return left !== normalizeString(condition.value);
        case 'contains':
          return stringMatches(left, normalizeString(condition.value), 'contains');
        case 'startsWith':
          return stringMatches(left, normalizeString(condition.value), 'startsWith');
        case 'endsWith':
          return stringMatches(left, normalizeString(condition.value), 'endsWith');
        case 'in': {
          const arr = Array.isArray(condition.value) ? condition.value : [];
          return arr.map(normalizeString).includes(left);
        }
        case 'isEmpty':
          return left.length === 0;
        case 'isNotEmpty':
          return left.length > 0;
        default:
          return false;
      }
    }
    case 'number': {
      const left = asNumber(value);
      const right = asNumber(condition.value);
      if (left == null) {
        return false;
      }
      switch (condition.operator) {
        case 'isEqual':
          return right != null && left === right;
        case 'isNotEqual':
          return right != null && left !== right;
        case 'greaterThan':
          return right != null && left > right;
        case 'greaterThanOrEqual':
          return right != null && left >= right;
        case 'lessThan':
          return right != null && left < right;
        case 'lessThanOrEqual':
          return right != null && left <= right;
        default:
          return false;
      }
    }
    case 'date':
    case 'dateTime': {
      const left = asDateMs(value);
      const right = asDateMs(condition.value);
      if (left == null || right == null) {
        return false;
      }
      switch (condition.operator) {
        case 'isEqual':
          return left === right;
        case 'isNotEqual':
          return left !== right;
        case 'greaterThan':
          return left > right;
        case 'greaterThanOrEqual':
          return left >= right;
        case 'lessThan':
          return left < right;
        case 'lessThanOrEqual':
          return left <= right;
        default:
          return false;
      }
    }
    case 'boolean': {
      const b = !!value;
      if (condition.operator === 'isTrue') {
        return b === true;
      }
      if (condition.operator === 'isFalse') {
        return b === false;
      }
      return false;
    }
    case 'custom': {
      // Default behavior for custom: treat as string contains
      const left = normalizeString(value);
      const right = normalizeString(condition.value);
      return stringMatches(left, right, 'contains');
    }
  }
}

export function executeFilter<T>(
  data: readonly T[],
  config: NgnFilterConfig,
  selector: NgnFilterValueSelector<T> = (item: T): unknown => item
): readonly T[] {
  const active = getActiveFilterConditions(config);
  if (active.length === 0) {
    return data;
  }

  const mode = config.matchMode;
  const dt = config.dataType;
  return data.filter(item => {
    const value = selector(item);
    const evals = active.map(cond => matchesValue(value, dt, cond));
    return mode === 'any' ? evals.some(Boolean) : evals.every(Boolean);
  });
}
