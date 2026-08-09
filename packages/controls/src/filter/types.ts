export type AwdFilterDataType =
  | 'string'
  | 'number'
  | 'date'
  | 'dateTime'
  | 'boolean'
  | 'custom'
  | 'list';

export type AwdFilterMode = 'inline' | 'input' | 'headless';

export type AwdFilterMatchMode = 'any' | 'all';

export type AwdFilterOperatorId =
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
export type AwdFilterConditionConfig = {
  operator: AwdFilterOperatorId;
  /** Raw user-entered value (string from the input), or null when empty. */
  rawValue: string | null;
};

/**
 * Complete filter configuration without any actual dataset/result.
 */
export type AwdFilterConfig = {
  /** The chosen datatype for the filter value. */
  dataType: AwdFilterDataType;
  /** How multiple conditions should be combined. */
  matchMode: AwdFilterMatchMode;
  /** Configured conditions (may include empty values depending on operator). */
  conditions: readonly AwdFilterConditionConfig[];
};

export type AwdFilterCondition = {
  operator: AwdFilterOperatorId;
  value: unknown;
};

/**
 * Full client-side filter result (configuration + filtered dataset).
 * Prefer {@link AwdFilterConfig} when you only need the config.
 */
export type AwdFilterOutput<T> = AwdFilterConfig & {
  /** The active (parsed) conditions used for local evaluation. */
  activeConditions: readonly AwdFilterCondition[];
  /** The filtered data result. */
  filtered: readonly T[];
};
