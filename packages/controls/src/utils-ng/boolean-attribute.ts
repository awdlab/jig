import { booleanAttribute } from '@angular/core';

/**
 * `booleanAttribute`, except `null` and `undefined` become `undefined`. For tri-state
 * boolean inputs whose unset value means "derive it" rather than `false`.
 */
export function optionalBooleanAttribute(value: unknown): boolean | undefined {
  return value == null ? undefined : booleanAttribute(value);
}
