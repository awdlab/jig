import {
  afterRenderEffect,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { deepCopy } from '@ngneers/controls/utils';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';

export type Size = { width: number; height: number };

type ElementArray =
  | Signal<ReadonlyArray<HTMLElement | ElementRef<HTMLElement>>>
  | ReadonlyArray<HTMLElement | ElementRef<HTMLElement>>;
type ElementSingle =
  | Signal<HTMLElement | ElementRef<HTMLElement> | undefined>
  | HTMLElement
  | Document
  | ElementRef<HTMLElement>;

function getElement(el: ElementSingle): HTMLElement | Document | undefined {
  const rawElement = typeof el === 'function' ? el() : el;
  const element = rawElement instanceof ElementRef ? rawElement.nativeElement : rawElement;
  return element;
}

export function elementSizeSignal(element: ElementSingle): Signal<Size> {
  const val = elementsSizesSignalInt(element);
  return computed(() => val()[0] ?? { width: 0, height: 0 });
}

export function elementsSizesSignal(element: ElementArray): Signal<readonly Size[]> {
  return elementsSizesSignalInt(element);
}

function elementsSizesSignalInt(element: ElementArray | ElementSingle): Signal<readonly Size[]> {
  const sizeSignal = signal<readonly Size[]>([], {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });

  let elements: HTMLElement[];
  afterRenderEffect(() => {
    resizeObserver.disconnect();
    const rawElement = typeof element === 'function' ? element() : element;
    const arrayElement = Array.isArray(rawElement) ? rawElement : rawElement ? [rawElement] : [];
    elements = arrayElement.map(el => (el instanceof ElementRef ? el.nativeElement : el));

    if (!elements.length) {
      return;
    }
    sizeSignal.set(
      elements.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
        };
      })
    );
    elements.forEach(el => {
      resizeObserver.observe(el, { box: 'border-box' });
    });
  });
  const destroyRef = inject(DestroyRef);
  if (typeof ResizeObserver === 'undefined') {
    return sizeSignal; // ResizeObserver is not supported, return initial size
  }
  const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
      const index = elements.findIndex(el => el === entry.target);
      sizeSignal.update(s => {
        const copy = deepCopy(s);
        copy[index] = {
          width: entry.borderBoxSize[0].inlineSize,
          height: entry.borderBoxSize[0].blockSize,
        };
        return copy;
      });
    });
  });
  destroyRef.onDestroy(() => {
    resizeObserver.disconnect();
  });
  return sizeSignal;
}

const ABORT_SIGNAL_SYMBOL = Symbol('AbortSignal');
export function abortSignalOnDestroy(options?: { injector?: Injector }): AbortSignal {
  const destroyRef = options?.injector?.get(DestroyRef) ?? inject(DestroyRef);
  if (ABORT_SIGNAL_SYMBOL in destroyRef) {
    return destroyRef[ABORT_SIGNAL_SYMBOL] as AbortSignal;
  }
  const abortController = new AbortController();
  destroyRef.onDestroy(() => {
    abortController.abort();
  });
  (destroyRef as any)[ABORT_SIGNAL_SYMBOL] = abortController.signal;
  return abortController.signal;
}

export function domEventObservable<EventName extends keyof GlobalEventHandlersEventMap>(
  element: ElementSingle,
  eventName: EventName,
  injector?: Injector
): Observable<GlobalEventHandlersEventMap[EventName]> {
  const inj = injector ?? inject(Injector);

  const result = new Subject<GlobalEventHandlersEventMap[EventName]>();
  const destroyRef = inj.get(DestroyRef);

  let subscription: Subscription | undefined;
  runInInjectionContext(inj, () => {
    afterRenderEffect(() => {
      subscription?.unsubscribe();
      const el = getElement(element);
      if (!el) {
        return;
      }
      subscription = fromEvent(el, eventName)
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(e => result.next(e as GlobalEventHandlersEventMap[EventName]));
    });
  });
  return result.asObservable().pipe(takeUntilDestroyed(destroyRef));
}

export function domEventSignal<EventName extends keyof GlobalEventHandlersEventMap>(
  element: HTMLElement,
  eventName: EventName,
  injector?: Injector
): Signal<GlobalEventHandlersEventMap[EventName] | null> {
  const inj = injector ?? inject(Injector);
  const res = runInInjectionContext(inj, () => {
    const sig = signal<GlobalEventHandlersEventMap[EventName] | null>(null);
    fromEvent(element, eventName)
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        sig.set(value as GlobalEventHandlersEventMap[EventName]);
      });
    return sig;
  });
  return res;
}
