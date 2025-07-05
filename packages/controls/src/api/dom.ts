import { afterRenderEffect, DestroyRef, inject, signal, Signal } from '@angular/core';

export function elementSizeSignal(
  element: Signal<HTMLElement>
): Signal<{ width: number; height: number }> {
  const sizeSignal = signal<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  afterRenderEffect(() => {
    const el = element();
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
