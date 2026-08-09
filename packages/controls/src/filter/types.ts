export type JigFilterDataType =
  | 'string'
  | 'number'
  | 'date'
  | 'dateTime'
  | 'boolean'
  | 'custom'
  | 'list';

export type JigFilterMode = 'inline' | 'input' | 'headless';

export type JigFilterMatchMode = 'any' | 'all';

export type JigFilterOperatorId =
  // string
  | 'isEqual'
  | 'isNotEqual'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'isEmpty'
  | 'isNotEmpty'
  // number/date/dateTime
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  // boolean
  | 'isTrue'
  | 'isFalse'
  // custom
  | 'custom';

/**
 * A single configured filter condition.
 * This is intentionally data-free and serializable (useful for server-side filtering).
 */
export type JigFilterConditionConfig = {
  operator: JigFilterOperatorId;
  /** Raw user-entered value (string from the input), or null when empty. */
  rawValue: string | null;
};

/**
 * Complete filter configuration without any actual dataset/result.
 */
export type JigFilterConfig = {
  /** The chosen datatype for the filter value. */
  dataType: JigFilterDataType;
  /** How multiple conditions should be combined. */
  matchMode: JigFilterMatchMode;
  /** Configured conditions (may include empty values depending on operator). */
  conditions: readonly JigFilterConditionConfig[];
};

export type JigFilterCondition = {
  operator: JigFilterOperatorId;
  value: unknown;
};

/**
 * Full client-side filter result (configuration + filtered dataset).
 * Prefer {@link JigFilterConfig} when you only need the config.
 */
export type JigFilterOutput<T> = JigFilterConfig & {
  /** The active (parsed) conditions used for local evaluation. */
  activeConditions: readonly JigFilterCondition[];
  /** The filtered data result. */
  filtered: readonly T[];
};
