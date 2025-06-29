import { computed } from '@angular/core';

export function computedWithPrevious<T>(computeFn: (prev?: T) => T, previous?: T): () => T {
  let current = previous;

  return computed<T>(() => {
    const prev = current;
    current = computeFn(prev);
    return current;
  });
}
