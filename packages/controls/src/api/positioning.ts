import { DestroyRef, inject, Injector } from '@angular/core';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

type PositioningOptions = {
  injector?: Injector;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  flip?: boolean;
  shift?: boolean;
  offset?: number;
  stopped?: boolean;
  widthConstraints?: {
    width?: number;
    maxWidth?: number;
  };
};

export type AutoPositioningHandle = {
  stop: () => void;
  start: () => void;
  isRunning: () => boolean;
};

function mergeWithDefaults(options: PositioningOptions): PositioningOptions {
  return {
    placement: 'bottom',
    flip: true,
    shift: true,
    offset: 4,
    stopped: false,
    ...options,
  };
}

export function positionElement(
  referenceEl: HTMLElement,
  floatingEl: HTMLElement,
  options: PositioningOptions = {}
) {
  options = mergeWithDefaults(options);

  const flipMiddleware = options.flip
    ? flip(options.shift ? { crossAxis: 'alignment', fallbackAxisSideDirection: 'end' } : undefined)
    : undefined;
  const shiftMiddleware = options.shift ? shift() : undefined;

  if (options.widthConstraints) {
    const refWidth = referenceEl.offsetWidth;
    if (options.widthConstraints.width) {
      const widthConstraints = options.widthConstraints.width * refWidth;
      floatingEl.style.width = `min(100%, ${widthConstraints}px)`;
    }
    if (options.widthConstraints.maxWidth) {
      const maxWidthConstraints = options.widthConstraints.maxWidth * refWidth;
      floatingEl.style.maxWidth = `min(100%, ${maxWidthConstraints}px)`;
    }
  }

  computePosition(referenceEl, floatingEl, {
    placement: options.placement,
    middleware: [
      options.offset ? offset(options.offset) : undefined,
      ...(options.placement?.includes('-')
        ? [flipMiddleware, shiftMiddleware]
        : [shiftMiddleware, flipMiddleware]),
    ].filter(Boolean),
  }).then(({ x, y }) => {
    Object.assign(floatingEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  });
}

export function autoPositionElement(
  referenceEl: HTMLElement,
  floatingEl: HTMLElement,
  options: PositioningOptions = {}
): AutoPositioningHandle {
  options = mergeWithDefaults(options);

  let cleanup: (() => void) | undefined;
  const destroyRef = options.injector?.get(DestroyRef) ?? inject(DestroyRef);

  function startAutoUpdate() {
    cleanup = autoUpdate(referenceEl, floatingEl, () => {
      positionElement(referenceEl, floatingEl, options);
    });
    return cleanup;
  }

  return {
    start: () => {
      cleanup?.();
      startAutoUpdate();
    },
    stop: () => {
      cleanup?.();
      cleanup = undefined;
    },
    isRunning: () => !!cleanup,
  };
}
