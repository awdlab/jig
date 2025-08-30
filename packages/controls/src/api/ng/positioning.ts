import { DestroyRef, inject, Injector } from '@angular/core';
import {
  Alignment,
  autoUpdate,
  computePosition,
  ComputePositionReturn,
  flip,
  Middleware,
  offset,
  Placement,
  shift,
  Side,
  size,
  Strategy,
} from '@floating-ui/dom';

export type PositioningSizeConstraints = {
  /**
   * The minimum width of the floating element. When a string is provided, it is used as the CSS min-width value.
   */
  minWidth?: string;
  /**
   * The width of the floating element. When a number is provided, it is relative to the width of the reference element.
   * When a string is provided, it is used as the CSS width value.
   */
  width?: number | string;
  /**
   * The maximum width of the floating element. When a number is provided, it is relative to the width of the reference element.
   * When a string is provided, it is used as the CSS max-width value.
   */
  maxWidth?: number | string;
  /**
   * The height of the floating element. When a string is provided, it is used as the CSS height value.
   */
  height?: string;
  /**
   * The maximum height of the floating element. When a string is provided, it is used as the CSS max-height value.
   */
  maxHeight?: string;
};

export type PositioningOptions = {
  injector?: Injector;
  placement?: Placement;
  flip?: boolean;
  resize?: boolean;
  shift?: boolean;
  offset?: number;
  stopped?: boolean;
  sizeConstraints?: PositioningSizeConstraints;
  strategy?: Strategy;
  middleware?: Middleware[];
  disableSettingStyles?: boolean;
  onPositionChange?: (position: ComputePositionReturn) => void;
};

export type AutoPositioningHandle = {
  stop: () => void;
  start: () => void;
  isRunning: () => boolean;
};

function filterNonNullishKeys<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value != null)) as Partial<T>;
}

function mergeWithDefaults(options: PositioningOptions): PositioningOptions {
  return {
    placement: 'bottom',
    flip: true,
    resize: true,
    shift: true,
    offset: 4,
    stopped: false,
    ...filterNonNullishKeys(options),
  };
}

export function positionElement(
  referenceEl: HTMLElement,
  floatingEl: HTMLElement,
  options: PositioningOptions = {}
) {
  options = mergeWithDefaults(options);

  const isVerticalAlignment =
    options.placement?.startsWith('top') || options.placement?.startsWith('bottom');

  const flipMiddleware = options.flip
    ? flip(options.shift ? { crossAxis: 'alignment' } : undefined)
    : undefined;
  const shiftMiddleware = options.shift ? shift() : undefined;

  if (options.sizeConstraints) {
    if (options.sizeConstraints.width || options.sizeConstraints.maxWidth) {
      const refWidth = referenceEl.getBoundingClientRect().width;
      if (options.sizeConstraints.width) {
        if (typeof options.sizeConstraints.width === 'string') {
          floatingEl.style.width = options.sizeConstraints.width;
        } else {
          const widthConstraints = options.sizeConstraints.width * refWidth;
          floatingEl.style.width = `min(100%, ${widthConstraints}px)`;
        }
      }
      if (options.sizeConstraints.maxWidth) {
        if (typeof options.sizeConstraints.maxWidth === 'string') {
          floatingEl.style.maxWidth = options.sizeConstraints.maxWidth;
        } else {
          const maxWidthConstraints = options.sizeConstraints.maxWidth * refWidth;
          floatingEl.style.maxWidth = `min(100%, ${maxWidthConstraints}px)`;
        }
      }
    }
    if (options.sizeConstraints.height || options.sizeConstraints.maxHeight) {
      if (options.sizeConstraints.height) {
        floatingEl.style.height = options.sizeConstraints.height;
      }
      if (options.sizeConstraints.maxHeight) {
        floatingEl.style.maxHeight = options.sizeConstraints.maxHeight;
      }
    }
    if (options.sizeConstraints.minWidth) {
      floatingEl.style.minWidth = options.sizeConstraints.minWidth;
    }
  }

  computePosition(referenceEl, floatingEl, {
    placement: options.placement,
    strategy: options.strategy,
    middleware: [
      options.offset ? offset(options.offset) : undefined,
      options.resize
        ? size({
            apply({ availableHeight }) {
              const maxHeightConstraint = options.sizeConstraints?.maxHeight;
              const maxHeightInPx = maxHeightConstraint?.replace(/px$/, '');
              const maxHeight = maxHeightInPx
                ? Math.min(availableHeight, parseInt(maxHeightInPx))
                : availableHeight;
              Object.assign(floatingEl.style, {
                height: `${maxHeight - 1}px`,
              });
            },
          })
        : undefined,
      ...(options.placement?.includes('-')
        ? [flipMiddleware, shiftMiddleware]
        : [shiftMiddleware, flipMiddleware]),
      ...(options.middleware || []),
    ].filter(Boolean),
  }).then(pos => {
    if (!options.disableSettingStyles) {
      Object.assign(floatingEl.style, {
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        justifyContent:
          pos.middlewareData.flip?.index && isVerticalAlignment ? 'flex-end' : 'flex-start',
      });
    }
    options.onPositionChange?.(pos);
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

  destroyRef.onDestroy(() => {
    cleanup?.();
    cleanup = undefined;
  });
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

export function splitPlacement(placement: Placement): [Side, Alignment | undefined] {
  return placement.split('-') as [Side, Alignment | undefined];
}
