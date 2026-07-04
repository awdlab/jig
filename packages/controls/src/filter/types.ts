export type NgnFilterDataType =
  'string' | 'number' | 'date' | 'dateTime' | 'boolean' | 'custom' | 'list';

export type NgnFilterMode = 'inline' | 'input' | 'headless';

export type NgnFilterMatchMode = 'any' | 'all';

export type NgnFilterOperatorId =
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
export type NgnFilterConditionConfig = {
  operator: NgnFilterOperatorId;
  /** Raw user-entered value (string from the input), or null when empty. */
  rawValue: string | null;
};

/**
 * Complete filter configuration without any actual dataset/result.
 */
export type NgnFilterConfig = {
  /** The chosen datatype for the filter value. */
  dataType: NgnFilterDataType;
  /** How multiple conditions should be combined. */
  matchMode: NgnFilterMatchMode;
  /** Configured conditions (may include empty values depending on operator). */
  conditions: readonly NgnFilterConditionConfig[];
};

export type NgnFilterCondition = {
  operator: NgnFilterOperatorId;
  value: unknown;
};

/**
 * Full client-side filter result (configuration + filtered dataset).
 * Prefer {@link NgnFilterConfig} when you only need the config.
 */
export type NgnFilterOutput<T> = NgnFilterConfig & {
  /** The active (parsed) conditions used for local evaluation. */
  activeConditions: readonly NgnFilterCondition[];
  /** The filtered data result. */
  filtered: readonly T[];
};
