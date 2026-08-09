import type { ValidationErrors } from '@angular/forms';

/**
 * Origin of a normalized validation error.
 * @category types
 */
export type AwdErrorsSource = 'control' | 'group' | 'custom';

/**
 * Interaction state that controls when validation messages are visible.
 * @category types
 */
export type AwdErrorsShowOn = 'touched' | 'dirty' | 'submitted' | 'always' | 'never';

/**
 * Message aggregation mode for visible errors.
 * @category types
 */
export type AwdErrorsMode = 'first' | 'all';

/**
 * Static or computed message for a validation error key.
 * @category types
 */
export type AwdErrorsMessage =
  | string
  | ((error: AwdErrorsMessageContext) => string | null | undefined);

/**
 * Map of validation error keys to message resolvers.
 * @category types
 */
export type AwdErrorsMessages = Record<string, AwdErrorsMessage>;

/**
 * Custom errors supplied directly to ngnErrors.
 * @category types
 */
export type AwdErrorsCustom =
  | ValidationErrors
  | readonly (string | AwdErrorsCustomEntry)[]
  | null
  | undefined;

/**
 * Custom error entry with optional value, params, and explicit message.
 * @category types
 */
export interface AwdErrorsCustomEntry {
  key: string;
  value?: unknown;
  message?: string;
  params?: Record<string, unknown>;
}

/**
 * Normalized validation error exposed by ngnErrors.
 * @category types
 */
export interface AwdError {
  key: string;
  value: unknown;
  source: AwdErrorsSource;
  message: string;
  params: Record<string, unknown>;
}

/**
 * Context passed to computed validation message resolvers.
 * @category types
 */
export interface AwdErrorsMessageContext {
  key: string;
  value: unknown;
  source: AwdErrorsSource;
  params: Record<string, unknown>;
}

/**
 * Current validation state that can be bridged into hint controls.
 * @category types
 */
export interface AwdErrorsState {
  visible: boolean;
  pending: boolean;
  errors: readonly AwdError[];
  firstError: AwdError | null;
  message: string | null;
}
