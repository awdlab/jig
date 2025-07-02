import { DestroyRef, inject, signal, Signal } from '@angular/core';

export function elementSizeSignal(element: HTMLElement): Signal<{ width: number; height: number }> {
  const sizeSignal = signal<{ width: number; height: number }>({
    width: element.clientWidth,
    height: element.clientHeight,
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
  resizeObserver.observe(element);
  destroyRef.onDestroy(() => {
    resizeObserver.disconnect();
  });
  return sizeSignal;
}
