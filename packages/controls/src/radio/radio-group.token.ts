import { InjectionToken, type Signal } from '@angular/core';

/**
 * A single radio option registered with its enclosing group. The group keys
 * selection and keyboard coordination off these refs; `element` correlates a
 * roving-focus item back to its payload `value`.
 */
export interface NgnRadioRef<V> {
  readonly element: HTMLElement;
  /** The option payload this radio contributes to the group value. */
  readonly value: Signal<V>;
  /** Effective disabled state (own disabled OR the group being disabled). */
  readonly disabled: Signal<boolean>;
}

/**
 * The slice of the radio group that child `awd-radio`s consume. Kept as a
 * token + interface (rather than the concrete class) so the child never imports
 * the group component — avoiding a circular dependency between the two files.
 */
export interface NgnRadioGroupApi<V> {
  /** The currently selected group value. */
  readonly value: Signal<V>;
  /** Whether the whole group is disabled. */
  readonly disabled: Signal<boolean>;
  /** Whether the group is read-only (navigable, but selection is frozen). */
  readonly readonly: Signal<boolean>;
  register(ref: NgnRadioRef<V>): void;
  unregister(ref: NgnRadioRef<V>): void;
}

export const NGN_RADIO_GROUP = new InjectionToken<NgnRadioGroupApi<unknown>>('NGN_RADIO_GROUP');
