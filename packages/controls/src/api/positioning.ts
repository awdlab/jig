import { afterRenderEffect, Signal } from '@angular/core';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

type PositioningOptions = {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  flip?: boolean;
  shift?: boolean;
  offset?: number;
};

function mergeWithDefaults(options: PositioningOptions): PositioningOptions {
  return {
    placement: 'bottom',
    flip: true,
    offset: 4,
    ...options,
  };
}

export function positionElement(
  referenceEl: HTMLElement,
  floatingEl: HTMLElement,
  options: PositioningOptions = {},
) {
  options = mergeWithDefaults(options);

  const flipMiddleware = options.flip
    ? flip(
        options.shift
          ? { crossAxis: 'alignment', fallbackAxisSideDirection: 'end' }
          : undefined,
      )
    : undefined;
  const shiftMiddleware = options.shift ? shift() : undefined;

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
  referenceEl: Signal<HTMLElement | undefined>,
  floatingEl: Signal<HTMLElement | undefined>,
  options: PositioningOptions = {},
) {
  options = mergeWithDefaults(options);
  let cleanup: (() => void) | undefined;

  afterRenderEffect(() => {
    const reference = referenceEl();
    const floating = floatingEl();
    if (!reference || !floating) {
      cleanup?.();
      cleanup = undefined;
      return;
    }
    cleanup = autoUpdate(reference, floating, () => {
      positionElement(reference, floating, options);
    });
  });
}
