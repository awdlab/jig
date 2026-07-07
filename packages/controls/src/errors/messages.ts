import { inject, InjectionToken, type Provider } from '@angular/core';

import type { NgnErrorsMessageContext, NgnErrorsMessages } from './types';

/**
 * Multi-provider token for validation error message maps.
 * @category providers
 */
export const NGN_ERRORS_MESSAGES = new InjectionToken<readonly NgnErrorsMessages[]>(
  'NGN_ERRORS_MESSAGES',
  {
    factory: () => [],
  }
);

/**
 * Provide custom validation error messages that are merged with defaults.
 * @category providers
 */
export function provideNgnErrorsMessages(messages: NgnErrorsMessages): Provider {
  return {
    provide: NGN_ERRORS_MESSAGES,
    useValue: messages,
    multi: true,
  };
}

/**
 * Inject all provided validation message maps as a single merged object.
 * @category providers
 */
export function injectNgnErrorsMessages(): NgnErrorsMessages {
  return Object.assign({}, ...inject(NGN_ERRORS_MESSAGES));
}

export const defaultNgnErrorsMessages: NgnErrorsMessages = {
  required: 'Required',
  email: 'Enter a valid email address',
  minlength: ({ params }) => {
    const requiredLength = params['requiredLength'];
    return `Use at least ${requiredLength} characters`;
  },
  maxlength: ({ params }) => {
    const requiredLength = params['requiredLength'];
    return `Use at most ${requiredLength} characters`;
  },
  min: ({ params }) => {
    const min = params['min'];
    return `Must be at least ${min}`;
  },
  max: ({ params }) => {
    const max = params['max'];
    return `Must be at most ${max}`;
  },
  pattern: 'Invalid format',
};

export function resolveNgnErrorMessage(
  context: NgnErrorsMessageContext,
  messages: NgnErrorsMessages
): string {
  const resolver = messages[context.key];
  if (typeof resolver === 'function') {
    return resolver(context) ?? context.key;
  }
  if (resolver) {
    return resolver;
  }
  if (typeof context.value === 'string') {
    return context.value;
  }
  if (isRecord(context.value) && typeof context.value['message'] === 'string') {
    return context.value['message'];
  }
  return context.key;
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
