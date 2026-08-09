import { inject, InjectionToken, type Provider } from '@angular/core';

import type { JigErrorsMessageContext, JigErrorsMessages } from './types';

/**
 * Multi-provider token for validation error message maps.
 * @category providers
 */
export const JIG_ERRORS_MESSAGES = new InjectionToken<readonly JigErrorsMessages[]>(
  'JIG_ERRORS_MESSAGES',
  {
    factory: () => [],
  }
);

/**
 * Provide custom validation error messages that are merged with defaults.
 * @category providers
 */
export function provideJigErrorsMessages(messages: JigErrorsMessages): Provider {
  return {
    provide: JIG_ERRORS_MESSAGES,
    useValue: messages,
    multi: true,
  };
}

/**
 * Inject all provided validation message maps as a single merged object.
 * @category providers
 */
export function injectJigErrorsMessages(): JigErrorsMessages {
  return Object.assign({}, ...inject(JIG_ERRORS_MESSAGES));
}

/**
 * Resolves a message for the context's key from a user-provided message map,
 * or `undefined` if the map has no (non-null) entry for it. Function resolvers
 * that return `null`/`undefined` are treated as "no message" so resolution can
 * fall through to the next source.
 */
export function resolveUserMessage(
  context: JigErrorsMessageContext,
  messages: JigErrorsMessages
): string | undefined {
  const resolver = messages[context.key];
  // Empty strings count as "no message" so resolution falls through to the next source.
  if (typeof resolver === 'function') {
    return resolver(context) || undefined;
  }
  return resolver || undefined;
}

/**
 * A message carried on the error itself — a plain-string error value, or a
 * `message` field on the error object (e.g. a signal-forms validator's
 * `{ message }`, or a group error). `undefined` when the error carries none.
 */
export function carriedMessage(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (isRecord(value) && typeof value['message'] === 'string') {
    return value['message'];
  }
  return undefined;
}

export function paramsFromValue(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(([key]) => key !== 'message' && !isControlNameKey(key))
  );
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isControlNameKey(key: string): boolean {
  return ['control', 'controlName', 'controls', 'controlNames', 'field', 'fields'].includes(key);
}
