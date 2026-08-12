import { validate } from '@angular/forms/signals';

import type {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  ValidationError,
} from '@angular/forms/signals';

/** Bounds shared by both tag validators. Omit either end to leave it unbounded. */
export interface TagBounds {
  min?: number;
  max?: number;
}

/**
 * The error {@link tagCount} reports. `min`/`max`/`count` reach a message
 * resolver as `params`.
 * @category types
 */
export interface TagCountValidationError extends ValidationError {
  readonly kind: 'tagCount';
  readonly min?: number;
  readonly max?: number;
  readonly count: number;
}

/**
 * The error {@link tagLength} reports, carrying the first offending tag.
 * @category types
 */
export interface TagLengthValidationError extends ValidationError {
  readonly kind: 'tagLength';
  readonly min?: number;
  readonly max?: number;
  readonly tag: string;
  readonly index: number;
}

/**
 * Requires the number of tags to sit within the given bounds.
 *
 * Use this rather than the stock `minLength`/`maxLength`: a tag input's value is
 * `string[] | null`, which those validators reject at compile time because
 * `null` has no `length`. An empty value is left to `required`.
 *
 * @category validators
 */
export function tagCount<
  TValue extends readonly string[] | null,
  TPathKind extends PathKind = PathKind.Root,
>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, bounds: TagBounds): void {
  validate(path, ctx => {
    const tags = ctx.value();
    if (!tags?.length) {
      return undefined;
    }
    const count = tags.length;
    const tooFew = bounds.min !== undefined && count < bounds.min;
    const tooMany = bounds.max !== undefined && count > bounds.max;
    if (!tooFew && !tooMany) {
      return undefined;
    }
    const error: TagCountValidationError = {
      kind: 'tagCount',
      min: bounds.min,
      max: bounds.max,
      count,
    };
    return error;
  });
}

/**
 * Requires every tag's length to sit within the given bounds, reporting the
 * first tag that breaks the rule.
 *
 * The control already blocks both ends while typing, so this exists for values
 * arriving from outside the control — a server response, or bounds tightened
 * after tags were stored. An empty value is left to `required`.
 *
 * @category validators
 */
export function tagLength<
  TValue extends readonly string[] | null,
  TPathKind extends PathKind = PathKind.Root,
>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, bounds: TagBounds): void {
  validate(path, ctx => {
    const tags = ctx.value();
    if (!tags?.length) {
      return undefined;
    }
    const index = tags.findIndex(
      tag =>
        (bounds.min !== undefined && tag.length < bounds.min) ||
        (bounds.max !== undefined && tag.length > bounds.max)
    );
    const tag = index === -1 ? undefined : tags[index];
    if (tag === undefined) {
      return undefined;
    }
    const error: TagLengthValidationError = {
      kind: 'tagLength',
      min: bounds.min,
      max: bounds.max,
      tag,
      index,
    };
    return error;
  });
}
