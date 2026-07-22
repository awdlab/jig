import {
  afterRenderEffect,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  type Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { deepCopy } from '@ngneers/controls/utils';
import { signalWithPrevious } from '@ngneers/controls/utils-ng';
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

export function elementSizeSignal(element: ElementSingle, active?: Signal<boolean>): Signal<Size> {
  const val = elementsSizesSignalInt(element, active);
  return computed(() => val()[0] ?? { width: 0, height: 0 });
}

export function elementsSizesSignal(
  element: ElementArray,
  active?: Signal<boolean>
): Signal<readonly Size[]> {
  return elementsSizesSignalInt(element, active);
}

function elementsSizesSignalInt(
  element: ElementArray | ElementSingle,
  active?: Signal<boolean>
): Signal<readonly Size[]> {
  const sizeSignal = signal<readonly Size[]>([], {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });

  let elements: HTMLElement[];
  afterRenderEffect(() => {
    resizeObserver.disconnect();
    if (active && !active()) {
      return;
    }
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
        const borderBoxSize = entry.borderBoxSize[0];
        if (!borderBoxSize) {
          return s;
        }
        copy[index] = {
          width: borderBoxSize.inlineSize,
          height: borderBoxSize.blockSize,
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

/**
 * Creates an Observable that emits the latest event of the specified type from the given DOM element.
 *
 * ⚠️ Cannot be used to cancel or call preventDefault on the event, as the event is emitted after the event handler phase.
 * @param element The target DOM element or ElementRef. Either can be provided directly or via a Signal.
 * @param eventName The name of the event to listen for.
 * @param injector Optional injector to use for lifecycle management. If not provided, the current injector is used.
 * @returns An Observable that emits the latest event of the specified type. Does not complete until the injector is destroyed.
 */
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

/**
 * Creates a Signal that emits the latest event of the specified type from the given DOM element.
 *
 * ⚠️ Cannot be used to cancel or call preventDefault on the event, as the event is emitted after the event handler phase.
 * @param element The target DOM element or ElementRef. Either can be provided directly or via a Signal.
 * @param eventName The name of the event to listen for.
 * @param injector Optional injector to use for lifecycle management. If not provided, the current injector is used.
 * @returns A Signal that emits the latest event of the specified type or null if no event has occurred.
 */
export function domEventSignal<EventName extends keyof GlobalEventHandlersEventMap>(
  element: ElementSingle,
  eventName: EventName,
  injector?: Injector
): Signal<GlobalEventHandlersEventMap[EventName] | null> {
  const inj = injector ?? inject(Injector);
  const res = runInInjectionContext(inj, () => {
    const sig = signal<GlobalEventHandlersEventMap[EventName] | null>(null);
    domEventObservable(element, eventName, inj).subscribe(value => {
      sig.set(value as GlobalEventHandlersEventMap[EventName]);
    });
    return sig;
  });
  return res;
}

/**
 * Attaches an event handler to a DOM element that is automatically removed when the injector is destroyed.
 * @param element The target DOM element or ElementRef. Either can be provided directly or via a Signal.
 * @param eventName The name of the event to listen for.
 * @param handler The function to handle the event.
 * @param injector Optional injector to use for lifecycle management. If not provided, the current injector is used.
 * @param options Optional addEventListener options (e.g. `{ capture: true }`).
 */
export function domEventHandler<EventName extends keyof GlobalEventHandlersEventMap>(
  element: ElementSingle,
  eventName: EventName,
  handler: (event: GlobalEventHandlersEventMap[EventName]) => void,
  injector?: Injector,
  options?: AddEventListenerOptions
): void {
  const inj = injector ?? inject(Injector);
  const destroyRef = inj.get(DestroyRef);
  runInInjectionContext(inj, () => {
    const destroyed = signal(false);
    destroyRef.onDestroy(() => {
      destroyed.set(true);
    });
    const elSig = computed(() => (destroyed() ? null : getElement(element)));
    const elSigWithPrev = signalWithPrevious(elSig);

    effect(() => {
      const element = elSigWithPrev();
      const previousElement = element.previous;
      if (previousElement) {
        previousElement.removeEventListener(
          eventName,
          handler as EventListenerOrEventListenerObject,
          options
        );
      }
      if (element.current) {
        element.current.addEventListener(
          eventName,
          handler as EventListenerOrEventListenerObject,
          options
        );
      }
    });
  });
}
