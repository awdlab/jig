import {
  afterRenderEffect,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  signal,
  Signal,
} from '@angular/core';

export type Size = { width: number; height: number };

export function elementSizeSignal(
  element: Signal<HTMLElement | ElementRef<HTMLElement>> | HTMLElement | ElementRef<HTMLElement>
): Signal<Size> {
  const sizeSignal = signal<Size>({ width: 0, height: 0 });

  afterRenderEffect(() => {
    let el = typeof element === 'function' ? element() : element;
    if (el instanceof ElementRef) {
      el = el.nativeElement;
    }
    if (!el) {
      return;
    }
    sizeSignal.set({
      width: el.clientWidth,
      height: el.clientHeight,
    });
    resizeObserver.observe(el);
  });

  const destroyRef = inject(DestroyRef);
  if (typeof ResizeObserver === 'undefined') {
    return sizeSignal; // ResizeObserver is not supported, return initial size
  }
  const resizeObserver = new ResizeObserver(entries => {
    const firstEntry = entries[0];
    sizeSignal.set({
      width: firstEntry.contentRect.width,
      height: firstEntry.contentRect.height,
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
