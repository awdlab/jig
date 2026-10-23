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
export type JigFilterPropertyKey<TData> = unknown extends TData
  ? string
  : Extract<AllKeysOfUnion<TData>, string>;

/**
 * An property a condition can filter on.
 *
 * `TItem` is what the data array holds; `TData` is the object a {@link JigFilterProperty.key}
 * indexes. They differ when the items wrap their payload — a {@link JigItem} carries it in `data` —
 * so `jig-filter-list-box` types its keys against the payload while the selector still receives the item.
 */
export type JigFilterProperty<TItem = unknown, TData = TItem> = {
  /** Shown in the property select. */
  label: string | (() => string);
  /** Determines the available operators and the value editor. */
  dataType: JigFilterDataType;
  /** Options for a `list` property. Derived from the data when omitted. */
  listOptions?: readonly string[];
} & (
  | {
      /** Names the property to read, and identifies the property in a condition. */
      key: JigFilterPropertyKey<TData>;
      /**
       * Overrides how this property's value is read — the key still identifies it.
       * Defaults to `(item.data ?? item)[key]`.
       */
      selector?: (item: TItem) => unknown;
      computedKey?: never;
    }
  | {
      /**
       * Identifies a computed property in a condition. It names no property, which is
       * why {@link JigFilterProperty.selector} is required — and why it is a separate
       * field, so `key` stays the item's own property names and keeps autocompleting.
       */
      computedKey: string;
      /** Reads the value to compare. */
      selector: (item: TItem) => unknown;
      key?: never;
    }
);

/**
 * A single configured condition, naming the property it applies to.
 * Serializable, so it can be handed to a server.
 */
export type JigFilterBuilderConditionConfig = {
  /** {@link JigFilterProperty.key} this condition filters on — a declared property, or a computed property's own identifier. */
  property: string;
  operator: JigFilterOperatorId;
  /** Raw user-entered value, or null when empty. */
  rawValue: string | null;
};

/**
 * Complete property filter configuration without any dataset or result.
 */
export type JigFilterBuilderConfig = {
  /** How the conditions are combined. */
  matchMode: JigFilterMatchMode;
  /** Configured conditions (may include empty values depending on operator). */
  conditions: readonly JigFilterBuilderConditionConfig[];
};
