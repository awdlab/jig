import {
  afterRenderEffect,
  computed,
  effect,
  InputSignal,
  InputSignalWithTransform,
  signal,
  Signal,
} from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';

export function computedWithPrevious<T>(computeFn: (prev?: T) => T, previous?: T): Signal<T> {
  let current = previous;

  return computed<T>(() => {
    const prev = current;
    current = computeFn(prev);
    return current;
  });
}

export function signalWithPrevious<T>(
  signal: Signal<T>,
  previous?: T
): Signal<{ current: T; previous: T | undefined }> {
  let current = previous;

  return computed(() => {
    const prev = current;
    current = signal();
    return { current, previous: prev };
  });
}

export function asyncComputed<T>(
  computeFn: () => Promise<T>,
  initial: T
): { (): T; isRunning: Signal<boolean>; firstRunCompleted: Signal<boolean> } {
  let latestUpdated = 0;
  const runningCounter = signal(0);
  const firstRunCompleted = signal(false);
  const returnSignal = signal<T>(initial);
  effect(() => {
    const current = Date.now();
    runningCounter.update(value => value + 1);
    computeFn()
      .then(value => {
        runningCounter.update(value => value - 1);
        // Only update the signal if this is the latest call
        if (current < latestUpdated) {
          console.debug('asyncComputed: ignoring stale value update');
          return;
        }
        latestUpdated = current;
        returnSignal.set(value);
        firstRunCompleted.set(true);
      })
      .catch(error => {
        runningCounter.update(value => value - 1);
        console.error('Error in asyncComputed:', error);
      });
  });
  const isRunning = computed(() => runningCounter() > 0);
  const returnFn = returnSignal as unknown as {
    (): T;
    isRunning: Signal<boolean>;
    firstRunCompleted: Signal<boolean>;
  };
  returnFn.isRunning = isRunning;
  returnFn.firstRunCompleted = firstRunCompleted;
  return returnFn;
}

export function setInputSignalValue<T>(
  input: InputSignal<T> | InputSignalWithTransform<T, unknown>,
  value: T
): void {
  input[SIGNAL].applyValueToInputSignal(input[SIGNAL], value);
}

export function afterRenderComputed<T>(computeFn: () => T, defaultValue: T): () => T {
  const value = signal(defaultValue);
  afterRenderEffect(() => {
    value.set(computeFn());
  });
  return value.asReadonly();
}
