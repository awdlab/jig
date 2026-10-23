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
  | 'notContains'
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

/**
 * What a custom filter template is handed. Write a configuration back with
 * {@link JigFilterFieldTemplateContext.setValue} and the field filters as usual.
 */
export type JigFilterFieldTemplateContext<T = unknown> = {
  /** The configuration being edited, `null` while nothing is set. */
  $implicit: JigFilterConfig | null;
  /** The data being filtered, for deriving options from. */
  data: readonly T[];
  /** The field's data type, which decides the operators you may use. */
  dataType: JigFilterDataType;
  disabled: boolean;
  readonly: boolean;
  /** Writes a configuration back, honouring `autoApply` and its debounce. */
  setValue: (config: JigFilterConfig | null) => void;
  /** Commits the pending configuration. Only meaningful while `autoApply` is off. */
  apply: () => void;
  /** Restores the configuration as it was when the popover opened. */
  cancel: () => void;
  /** Clears the configuration. */
  clear: () => void;
  /** Closes the popover. */
  close: () => void;
};
