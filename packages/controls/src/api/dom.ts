import { afterRenderEffect, DestroyRef, ElementRef, inject, signal, Signal } from '@angular/core';

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
