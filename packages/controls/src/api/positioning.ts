import {
  afterRenderEffect,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  Signal,
} from '@angular/core';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

type PositioningOptions = {
  injector?: Injector;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  flip?: boolean;
  shift?: boolean;
  offset?: number;
  stopped?: boolean;
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
): AutoPositioningHandle {
  options = mergeWithDefaults(options);
  let cleanup: (() => void) | undefined;

  const running = runInInjectionContext(
    options.injector ?? inject(Injector),
    () => {
      return signal(!options.stopped);
    },
  );

  afterRenderEffect(
    () => {
      const reference = referenceEl();
      const floating = floatingEl();
      const isRunning = running();
      if (!reference || !floating || !isRunning) {
        cleanup?.();
        cleanup = undefined;
        return;
      }
      cleanup = autoUpdate(reference, floating, () => {
        positionElement(reference, floating, options);
      });
    },
    { injector: options.injector },
  );

  return {
    start: () => {
      running.set(true);
    },
    stop: () => {
      running.set(false);
    },
    isRunning: () => running(),
  };
}
