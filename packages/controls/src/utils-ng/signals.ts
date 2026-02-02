import {
  afterRenderEffect,
  computed,
  effect,
  EffectRef,
  InputSignal,
  InputSignalWithTransform,
  signal,
  Signal,
  untracked,
} from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';

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

export function computedWithPrevious<T>(computeFn: (prev?: T) => T, previous?: T): Signal<T> {
  let current = previous;

  return computed<T>(() => {
    const prev = current;
    current = computeFn(prev);
    return current;
  });
}

export function effectWithPrevious<T>(
  signal: Signal<T>,
  effectFn: (current: T, previous: T | undefined) => void
): EffectRef {
  const sig = signalWithPrevious(signal);
  return effect(() => {
    const { current, previous } = sig();
    effectFn(current, previous);
  });
}
function explicitEffectBase<T extends readonly Signal<any>[]>(
  usedEffectFn: (fn: () => void) => EffectRef,
  signals: [...T],
  effectFn: (values: { [K in keyof T]: T[K] extends Signal<infer U> ? U : never }) => void
): EffectRef {
  return usedEffectFn(() => {
    const values = signals.map(sig => sig()) as {
      [K in keyof T]: T[K] extends Signal<infer U> ? U : never;
    };
    untracked(() => {
      effectFn(values);
    });
  });
}

export function explicitEffect<T extends readonly Signal<any>[]>(
  signals: [...T],
  effectFn: (values: { [K in keyof T]: T[K] extends Signal<infer U> ? U : never }) => void
): EffectRef {
  return explicitEffectBase(effect, signals, effectFn);
}

export function explicitAfterRenderEffect<T extends readonly Signal<any>[]>(
  signals: [...T],
  effectFn: (values: { [K in keyof T]: T[K] extends Signal<infer U> ? U : never }) => void
): EffectRef {
  return explicitEffectBase(afterRenderEffect, signals, effectFn);
}

export function asyncComputed<T>(
  computeFn: () => Promise<T>,
  initial: T
): { (): T; isRunning: Signal<boolean>; firstRunCompleted: Signal<boolean> } {
  let latestId = 0;
  let latestCompletedId = 0;
  const isRunningSignal = signal(false);
  const firstRunCompleted = signal(false);
  const returnSignal = signal<T>(initial);

  effect(() => {
    const currentId = ++latestId;
    isRunningSignal.set(true);

    computeFn()
      .then(value => {
        // Only update the signal if this is the latest call
        if (currentId <= latestCompletedId) {
          console.debug('asyncComputed: ignoring stale value update');
          return;
        }
        latestCompletedId = currentId;
        returnSignal.set(value);
        firstRunCompleted.set(true);

        // Set isRunning to false if this is the latest operation
        if (currentId === latestId) {
          isRunningSignal.set(false);
        }
      })
      .catch(error => {
        // Also check if this is the latest operation on error
        if (currentId === latestId) {
          isRunningSignal.set(false);
        }
        console.error('Error in asyncComputed:', error);
      });
  });

  const returnFn = returnSignal as unknown as {
    (): T;
    isRunning: Signal<boolean>;
    firstRunCompleted: Signal<boolean>;
  };
  returnFn.isRunning = isRunningSignal.asReadonly();
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

export function debounceSignal<T>(input: Signal<T>, delayMs: (() => number) | number): Signal<T> {
  const delayFn = typeof delayMs === 'function' ? delayMs : () => delayMs;
  const debounced = signal(input());
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  effect(onCleanup => {
    const value = input();
    const delay = delayFn();

    // Clear any pending timeout
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      debounced.set(value);
      timeoutId = undefined;
    }, delay);

    // Cleanup function to clear timeout when effect is destroyed or re-run
    onCleanup(() => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    });
  });

  return debounced.asReadonly();
}
