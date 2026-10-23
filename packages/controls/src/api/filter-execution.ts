import { type AllKeysOfUnion, objectEntries } from '@awdlab/jig/utils';

import { stringMatches } from './string-match';

type JigFilterDataType = 'string' | 'number' | 'date' | 'dateTime' | 'boolean' | 'custom' | 'list';

type JigFilterMatchMode = 'all' | 'any';

type JigFilterOperatorId =
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

type JigFilterConditionConfig = {
  operator: JigFilterOperatorId;
  rawValue: string | null;
};

type JigFilterConfig = {
  dataType: JigFilterDataType;
  matchMode: JigFilterMatchMode;
  conditions: readonly JigFilterConditionConfig[];
};

type JigFilterAttribute<T = unknown> = {
  key: string;
  label: string | (() => string);
  dataType: JigFilterDataType;
  listOptions?: readonly string[];
  selector?: (item: T) => unknown;
};

type JigAttributeFilterConditionConfig = {
  attribute: string;
  operator: JigFilterOperatorId;
  rawValue: string | null;
};

type JigAttributeFilterConfig = {
  matchMode: JigFilterMatchMode;
  conditions: readonly JigAttributeFilterConditionConfig[];
};

type JigFilterCondition = {
  operator: JigFilterOperatorId;
  value: unknown;
};

export type JigFilterValueSelector<T> = (item: T) => unknown;

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
    return parseFilterRawDate(value)?.getTime() ?? null;
  }
  return null;
}

function startOfLocalDayMs(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function operatorRequiresValue(operator: JigFilterOperatorId): boolean {
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

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** Parse a filter date string. A bare `YYYY-MM-DD` is local midnight, not UTC midnight. */
export function parseFilterRawDate(raw: string): Date | null {
  const d = new Date(DATE_ONLY.test(raw) ? `${raw}T00:00` : raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseFilterRawValue(raw: string | null, dataType: JigFilterDataType): unknown {
  if (raw == null || raw === '') {
    return null;
  }

  switch (dataType) {
    case 'string':
      return raw;
    case 'list':
      return raw;
    case 'number':
      return asNumber(raw);
    case 'date':
    case 'dateTime':
      return parseFilterRawDate(raw);
    case 'boolean':
      return raw === 'true';
    case 'custom':
      return raw;
  }
}

export function getActiveFilterConditions(config: JigFilterConfig): readonly JigFilterCondition[] {
  const dt = config.dataType;
  return config.conditions
    .map(c => {
      const requiresValue = operatorRequiresValue(c.operator);
      const parsed =
        c.operator === 'in' && (dt === 'string' || dt === 'list')
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
      return <JigFilterCondition>{ operator: c.operator, value: parsed };
    })
    .filter((x): x is JigFilterCondition => x != null);
}

function matchesValue(
  value: unknown,
  dataType: JigFilterDataType,
  condition: JigFilterCondition
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
    case 'list': {
      const left = normalizeString(value);
      switch (condition.operator) {
        case 'in': {
          const arr = Array.isArray(condition.value) ? condition.value : [];
          return arr.map(normalizeString).includes(left);
        }
        case 'isEmpty':
          return left.length === 0;
        case 'isNotEmpty':
          return left.length > 0;
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
      const leftMs = asDateMs(value);
      const rightMs = asDateMs(condition.value);
      if (leftMs == null || rightMs == null) {
        return false;
      }
      // 'date' compares whole local days, so a time of day on either side is ignored.
      const left = dataType === 'date' ? startOfLocalDayMs(leftMs) : leftMs;
      const right = dataType === 'date' ? startOfLocalDayMs(rightMs) : rightMs;
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
  config: JigFilterConfig,
  selector: JigFilterValueSelector<T> = (item: T): unknown => item
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

export function executeMultiFilter<T extends object>(
  data: readonly T[],
  configs: {
    [key in Extract<AllKeysOfUnion<T>, string>]?: JigFilterConfig;
  }
): readonly T[] {
  let result: readonly T[] = data;
  for (const [key, config] of objectEntries(configs).filter(x => !!x[1])) {
    const forcedAll: JigFilterConfig = { ...(config as JigFilterConfig), matchMode: 'all' };
    result = executeFilter(result, forcedAll, (item: T): unknown => item[key]);
  }
  return result;
}

/** Reads an attribute's value from an item: the attribute's own selector, else `(item.data ?? item)[key]`. */
export function readFilterAttributeValue<T>(item: T, attribute: JigFilterAttribute<T>): unknown {
  if (attribute.selector) {
    return attribute.selector(item);
  }
  const source = (item as { data?: unknown } | null)?.data ?? item;
  return (source as Record<string, unknown> | null | undefined)?.[attribute.key];
}

/** Filters by conditions that each name their own attribute; `matchMode` joins them across attributes. */
export function executeAttributeFilter<T>(
  data: readonly T[],
  config: JigAttributeFilterConfig,
  attributes: readonly JigFilterAttribute<T>[],
  childrenKey?: keyof T
): readonly T[] {
  const active = config.conditions.flatMap(c => {
    const attribute = attributes.find(a => a.key === c.attribute);
    if (!attribute) {
      return [];
    }
    const [condition] = getActiveFilterConditions({
      dataType: attribute.dataType,
      matchMode: 'all',
      conditions: [c],
    });
    return condition ? [{ attribute, condition }] : [];
  });
  if (active.length === 0) {
    return data;
  }

  const matches = (item: T): boolean => {
    const test = ({ attribute, condition }: (typeof active)[number]): boolean =>
      matchesValue(readFilterAttributeValue(item, attribute), attribute.dataType, condition);
    return config.matchMode === 'any' ? active.some(test) : active.every(test);
  };

  const filterLevel = (items: readonly T[]): T[] =>
    items.flatMap(item => {
      const children = childrenKey ? item[childrenKey] : undefined;
      if (Array.isArray(children) && children.length > 0) {
        const surviving = filterLevel(children as T[]);
        if (surviving.length > 0) {
          return [{ ...item, [childrenKey as keyof T]: surviving }];
        }
      }
      return matches(item) ? [item] : [];
    });

  return filterLevel(data);
}
