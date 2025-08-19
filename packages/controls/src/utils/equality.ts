import { objectKeys } from './object';

export function areObjectsDeepEqual<T extends object>(a: T, b: T): boolean {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  return objectKeys(a).every(key => {
    if (typeof a[key] !== typeof b[key]) {
      return false;
    }
    if (typeof a[key] === 'object') {
      return areObjectsDeepEqual(a[key] as object, b[key] as object);
    }
    return a[key] === b[key];
  });
}

export function areArraysDeepEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (typeof a[i] === 'object' && typeof b[i] === 'object') {
      return areObjectsDeepEqual(a[i] as object, b[i] as object);
    } else {
      return a[i] === b[i];
    }
  }
  return true;
}
