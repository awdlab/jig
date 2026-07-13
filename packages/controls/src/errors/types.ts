import type { ValidationErrors } from '@angular/forms';

/**
 * Origin of a normalized validation error.
 * @category types
 */
export type NgnErrorsSource = 'control' | 'group' | 'custom';

/**
 * Interaction state that controls when validation messages are visible.
 * @category types
 */
export type NgnErrorsShowOn = 'touched' | 'dirty' | 'submitted' | 'always' | 'never';

/**
 * Message aggregation mode for visible errors.
 * @category types
 */
export type NgnErrorsMode = 'first' | 'all';

/**
 * Static or computed message for a validation error key.
 * @category types
 */
export type NgnErrorsMessage =
  | string
  | ((error: NgnErrorsMessageContext) => string | null | undefined);

/**
 * Map of validation error keys to message resolvers.
 * @category types
 */
export type NgnErrorsMessages = Record<string, NgnErrorsMessage>;

/**
 * Custom errors supplied directly to ngnErrors.
 * @category types
 */
export type NgnErrorsCustom =
  | ValidationErrors
  | readonly (string | NgnErrorsCustomEntry)[]
  | null
  | undefined;

/**
 * Custom error entry with optional value, params, and explicit message.
 * @category types
 */
export interface NgnErrorsCustomEntry {
  key: string;
  value?: unknown;
  message?: string;
  params?: Record<string, unknown>;
}

/**
 * Normalized validation error exposed by ngnErrors.
 * @category types
 */
export interface NgnError {
  key: string;
  value: unknown;
  source: NgnErrorsSource;
  message: string;
  params: Record<string, unknown>;
}

/**
 * Context passed to computed validation message resolvers.
 * @category types
 */
export interface NgnErrorsMessageContext {
  key: string;
  value: unknown;
  source: NgnErrorsSource;
  params: Record<string, unknown>;
}

/**
 * Current validation state that can be bridged into hint controls.
 * @category types
 */
export interface NgnErrorsState {
  visible: boolean;
  pending: boolean;
  errors: readonly NgnError[];
  firstError: NgnError | null;
  message: string | null;
}
