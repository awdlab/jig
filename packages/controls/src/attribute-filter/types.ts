import type {
  JigFilterDataType,
  JigFilterMatchMode,
  JigFilterOperatorId,
} from '@awdlab/jig/filter';
import type { AllKeysOfUnion } from '@awdlab/jig/utils';

/**
 * The property names a condition may name on `TData`.
 * Falls back to `string` when the payload type is unknown — which is also what
 * Angular leaves behind when a generic input is not given.
 */
export type JigFilterAttributeKey<TData> = unknown extends TData
  ? string
  : Extract<AllKeysOfUnion<TData>, string>;

/**
 * An attribute a condition can filter on.
 *
 * `TItem` is what the data array holds; `TData` is the object a {@link JigFilterAttribute.key}
 * indexes. They differ when the items wrap their payload — a {@link JigItem} carries it in `data` —
 * so `jig-filter-list-box` types its keys against the payload while the selector still receives the item.
 */
export type JigFilterAttribute<TItem = unknown, TData = TItem> = {
  /** Shown in the attribute select. */
  label: string | (() => string);
  /** Determines the available operators and the value editor. */
  dataType: JigFilterDataType;
  /** Options for a `list` attribute. Derived from the data when omitted. */
  listOptions?: readonly string[];
} & (
  | {
      /** Names the property to read, and identifies the attribute in a condition. */
      key: JigFilterAttributeKey<TData>;
      /** Reads the value to compare. Defaults to `(item.data ?? item)[key]`. */
      selector?: (item: TItem) => unknown;
    }
  | {
      /** Any identifier, since {@link JigFilterAttribute.selector} reads the value instead of the key. */
      key: string;
      /** Reads the value to compare — required here, because the key names no property. */
      selector: (item: TItem) => unknown;
    }
);

/**
 * A single configured condition, naming the attribute it applies to.
 * Serializable, so it can be handed to a server.
 */
export type JigAttributeFilterConditionConfig = {
  /** {@link JigFilterAttribute.key} this condition filters on — a declared property, or a computed attribute's own identifier. */
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
