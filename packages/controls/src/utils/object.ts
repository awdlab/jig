import { AllKeysOfUnion } from './types';

export function deepCopy<T>(obj: T): T extends ReadonlyArray<infer U> ? Array<U> : T {
  return JSON.parse(JSON.stringify(obj));
}

export function objectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function objectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  target: T,
  source: U
): T & U {
  const output = { ...target } as T & U;
  for (const key of objectKeys(source)) {
    const value = source[key];
    if (isObject(value) && isObject(output[key])) {
      (output[key] as Record<string, unknown>) = deepMerge(
        output[key] as Record<string, unknown>,
        value
      );
    } else {
      (output[key] as U[keyof U]) = value;
    }
  }
  return output;
}

export function getPropertyIfExists<T extends object, K extends AllKeysOfUnion<T>>(
  obj: T,
  key: K
): T[K] | undefined {
  if (key in obj) {
    return obj[key];
  }
  return undefined;
}
