import type { ValidationErrors } from '@angular/forms';

/**
 * Origin of a normalized validation error.
 * @category types
 */
export type JigErrorsSource = 'control' | 'group' | 'custom';

/**
 * Interaction state that controls when validation messages are visible.
 * @category types
 */
export type JigErrorsShowOn = 'touched' | 'dirty' | 'submitted' | 'always' | 'never';

/**
 * Message aggregation mode for visible errors.
 * @category types
 */
export type JigErrorsMode = 'first' | 'all';

/**
 * Static or computed message for a validation error key.
 * @category types
 */
export type JigErrorsMessage =
  | string
  | ((error: JigErrorsMessageContext) => string | null | undefined);

/**
 * Map of validation error keys to message resolvers.
 * @category types
 */
export type JigErrorsMessages = Record<string, JigErrorsMessage>;

/**
 * Custom errors supplied directly to jigErrors.
 * @category types
 */
export type JigErrorsCustom =
  | ValidationErrors
  | readonly (string | JigErrorsCustomEntry)[]
  | null
  | undefined;

/**
 * Custom error entry with optional value, params, and explicit message.
 * @category types
 */
export interface JigErrorsCustomEntry {
  key: string;
  value?: unknown;
  message?: string;
  params?: Record<string, unknown>;
}

/**
 * Normalized validation error exposed by jigErrors.
 * @category types
 */
export interface JigError {
  key: string;
  value: unknown;
  source: JigErrorsSource;
  message: string;
  params: Record<string, unknown>;
}

/**
 * Context passed to computed validation message resolvers.
 * @category types
 */
export interface JigErrorsMessageContext {
  key: string;
  value: unknown;
  source: JigErrorsSource;
  params: Record<string, unknown>;
}

/**
 * Current validation state that can be bridged into hint controls.
 * @category types
 */
export interface JigErrorsState {
  visible: boolean;
  pending: boolean;
  errors: readonly JigError[];
  firstError: JigError | null;
  message: string | null;
}
