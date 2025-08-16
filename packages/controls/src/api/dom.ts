import {
  afterRenderEffect,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  signal,
  Signal,
} from '@angular/core';

export type Size = { width: number; height: number };

type ElementArray =
  | Signal<Array<HTMLElement | ElementRef<HTMLElement>>>
  | Array<HTMLElement | ElementRef<HTMLElement>>;
type ElementSingle =
  | Signal<HTMLElement | ElementRef<HTMLElement>>
  | HTMLElement
  | ElementRef<HTMLElement>;

export function elementSizeSignal(element: ElementSingle): Signal<Size> {
  const val = elementsSizesSignalInt(element);
  return computed(() => val()[0] ?? { width: 0, height: 0 });
}

export function elementsSizesSignal(element: ElementArray): Signal<Size[]> {
  return elementsSizesSignalInt(element);
}

function elementsSizesSignalInt(element: ElementArray | ElementSingle): Signal<Size[]> {
  const sizeSignal = signal<Size[]>([]);

  let elements: HTMLElement[];
  afterRenderEffect(() => {
    const rawElement = typeof element === 'function' ? element() : element;
    const arrayElement = Array.isArray(rawElement) ? rawElement : [rawElement];
    elements = arrayElement.map(el => (el instanceof ElementRef ? el.nativeElement : el));

    if (!elements.length) {
      return;
    }
    sizeSignal.set(
      elements.map(el => ({
        width: el.clientWidth,
        height: el.clientHeight,
      }))
    );
    // TODO: Unobserve / disconnect
    elements.forEach(el => {
      resizeObserver.observe(el);
    });
  });
  const destroyRef = inject(DestroyRef);
  if (typeof ResizeObserver === 'undefined') {
    return sizeSignal; // ResizeObserver is not supported, return initial size
  }
  const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
      const index = elements.findIndex(el => el === entry.target);
      const element = elements[index];
      sizeSignal.update(s => {
        s[index] = {
          width: element.clientWidth, // Using clientWidth instead of the resizeObservers rects as the source of truth
          height: element.clientHeight,
        };
        return s;
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
