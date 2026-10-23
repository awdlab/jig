import type {
  JigFilterDataType,
  JigFilterMatchMode,
  JigFilterOperatorId,
} from '@awdlab/jig/filter';

/**
 * An attribute a condition can filter on.
 */
export type JigFilterAttribute<T = unknown> = {
  /** Identifies the attribute in a condition and, without a {@link JigFilterAttribute.selector}, names the property to read. */
  key: string;
  /** Shown in the attribute select. */
  label: string | (() => string);
  /** Determines the available operators and the value editor. */
  dataType: JigFilterDataType;
  /** Options for a `list` attribute. Derived from the data when omitted. */
  listOptions?: readonly string[];
  /** Reads the value to compare. Defaults to `(item.data ?? item)[key]`. */
  selector?: (item: T) => unknown;
};

/**
 * A single configured condition, naming the attribute it applies to.
 * Serializable, so it can be handed to a server.
 */
export type JigAttributeFilterConditionConfig = {
  /** Key of the {@link JigFilterAttribute} this condition filters on. */
  attribute: string;
  operator: JigFilterOperatorId;
  /** Raw user-entered value, or null when empty. */
  rawValue: string | null;
};

/**
 * Complete attribute filter configuration without any dataset or result.
 */
export type JigAttributeFilterConfig = {
  /** How the conditions are combined. */
  matchMode: JigFilterMatchMode;
  /** Configured conditions (may include empty values depending on operator). */
  conditions: readonly JigAttributeFilterConditionConfig[];
};
