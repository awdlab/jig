import {
  afterRenderEffect,
  computed,
  effect,
  inject,
  Injector,
  InputSignal,
  runInInjectionContext,
  signal,
  Signal,
} from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';

export function computedWithPrevious<T>(computeFn: (prev?: T) => T, previous?: T): () => T {
  let current = previous;

  return computed<T>(() => {
    const prev = current;
    current = computeFn(prev);
    return current;
  });
}

export function asyncComputed<T>(
  computeFn: () => Promise<T>,
  initial: T
): { (): T; isRunning: Signal<boolean> } {
  let latestUpdated = 0;
  let runningCounter = signal(0);
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
      })
      .catch(error => {
        runningCounter.update(value => value - 1);
        console.error('Error in asyncComputed:', error);
      });
  });
  const isRunning = computed(() => runningCounter() > 0);
  const returnFn = returnSignal as unknown as { (): T; isRunning: Signal<boolean> };
  returnFn.isRunning = isRunning;
  return returnFn;
}

export function setInputSignalValue<T>(input: InputSignal<T>, value: T): void {
  input[SIGNAL].applyValueToInputSignal(input[SIGNAL], value);
}

export function fromEventSignal<T extends Event>(
  element: HTMLElement,
  eventName: string,
  injector?: Injector
): Signal<T | null> {
  const inj = injector ?? inject(Injector);
  const res = runInInjectionContext(inj, () => {
    const sig = signal<T | null>(null);
    fromEvent<T>(element, eventName)
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        sig.set(value);
      });
    return sig;
  });
  return res;
}

export function afterRenderComputed<T>(computeFn: () => T, defaultValue: T): () => T {
  const value = signal(defaultValue);
  afterRenderEffect(() => {
    value.set(computeFn());
  });
  return value.asReadonly();
}
