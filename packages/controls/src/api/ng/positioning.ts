import { DestroyRef, inject, Injector } from '@angular/core';

import type {
  Alignment,
  ComputePositionReturn,
  Middleware,
  Placement,
  ReferenceElement,
  Side,
  Strategy,
} from '@floating-ui/dom';

type FloatingUi = typeof import('@floating-ui/dom');
let floatingPromise: Promise<FloatingUi> | undefined;
let floating: FloatingUi | undefined;
function loadFloating(): Promise<FloatingUi> {
  if (!floatingPromise) {
    floatingPromise = import('@floating-ui/dom').then(m => (floating = m));
  }
  return floatingPromise;
}

export type Point = {
  x: number;
  y: number;
};

export type Anchor = HTMLElement | Point;

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
  /**
   * The minimum height of the floating element. When a string is provided, it is used as the CSS min-height value.
   */
  minHeight?: string;
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
  hasShrinkableContent?: boolean;
  onPositionChange?: (position: ComputePositionReturn) => void;
};

export type AutoPositioningHandle = {
  stop: () => void;
  start: () => void;
  isRunning: () => boolean;
};

/**
 * Snap a coordinate to the device-pixel grid. floating-ui returns subpixel
 * coordinates; setting them raw puts the floating element (and its arrow) on
 * fractional boundaries, producing blurry, non-deterministic anti-aliasing.
 * Rounding by DPR keeps rendering crisp and stable. Matches floating-ui's own
 * `roundByDPR` guidance.
 */
export function roundByDpr(el: HTMLElement, value: number): number {
  const dpr = el.ownerDocument.defaultView?.devicePixelRatio || 1;
  return Math.round(value * dpr) / dpr;
}

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
  anchor: Anchor,
  floatingEl: HTMLElement,
  options: PositioningOptions = {}
) {
  options = mergeWithDefaults(options);

  function run(fui: FloatingUi): void {
    const { computePosition, flip, offset, shift, size } = fui;

    const referenceElement = toReferenceElement(anchor);

    const flipMiddleware = options.flip
      ? flip(
          options.shift ? { crossAxis: 'alignment', fallbackAxisSideDirection: 'end' } : undefined
        )
      : undefined;
    const shiftMiddleware = options.shift ? shift() : undefined;

    if (options.sizeConstraints) {
      if (options.sizeConstraints.width || options.sizeConstraints.maxWidth) {
        const refWidth = referenceElement.getBoundingClientRect().width;
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

    void computePosition(referenceElement, floatingEl, {
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
                if (options.hasShrinkableContent) {
                  Object.assign(floatingEl.style, {
                    height: `${maxHeight - 1}px`,
                  });
                }
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
        const flipped = pos.middlewareData.flip?.index;
        const flippedToLREnd =
          flipped &&
          (pos.placement.startsWith('left-') || pos.placement.startsWith('right-')) &&
          pos.placement.endsWith('-end');
        const flippedToTop = flipped && pos.placement.startsWith('top');

        Object.assign(floatingEl.style, {
          left: `${roundByDpr(floatingEl, pos.x)}px`,
          top: `${roundByDpr(floatingEl, pos.y)}px`,
          justifyContent: flippedToLREnd || flippedToTop ? 'flex-end' : 'flex-start',
        });
      }
      options.onPositionChange?.(pos);
    });
  }

  if (floating) {
    run(floating);
  } else {
    void loadFloating().then(run);
  }
}

function toReferenceElement(anchor: Anchor): ReferenceElement {
  const referenceElement: ReferenceElement =
    anchor instanceof HTMLElement
      ? anchor
      : {
          getBoundingClientRect: () => ({
            x: anchor.x,
            y: anchor.y,
            width: 1,
            height: 1,
            top: anchor.y,
            right: anchor.x + 1,
            bottom: anchor.y + 1,
            left: anchor.x,
          }),
        };
  return referenceElement;
}

export function autoPositionElement(
  anchor: Anchor,
  floatingEl: HTMLElement,
  options: PositioningOptions = {}
): AutoPositioningHandle {
  options = mergeWithDefaults(options);

  // Prefetch the floating-ui chunk as soon as a tooltip/popover directive instantiates
  // so the first open does not flash. This is a download trigger only — it does not start.
  void loadFloating();

  let cleanup: (() => void) | undefined;
  let started = false; // intent: should be running
  const destroyRef = options.injector?.get(DestroyRef) ?? inject(DestroyRef);

  function startAutoUpdate(fui: FloatingUi) {
    // Defensive: a previous start may have already assigned a live cleanup
    // (e.g. two rapid start() calls sharing the cached load promise).
    cleanup?.();
    cleanup = fui.autoUpdate(toReferenceElement(anchor), floatingEl, () => {
      positionElement(anchor, floatingEl, options);
    });
  }

  destroyRef.onDestroy(() => {
    started = false;
    cleanup?.();
    cleanup = undefined;
  });
  return {
    start: () => {
      started = true;
      if (floating) {
        // Atomic teardown+reinstall, matching the original synchronous behavior.
        startAutoUpdate(floating);
      } else {
        cleanup?.();
        cleanup = undefined;
        void loadFloating().then(fui => {
          if (!started) {
            return; // a stop()/destroy landed during load — bail, no leak
          }
          startAutoUpdate(fui);
        });
      }
    },
    stop: () => {
      started = false;
      cleanup?.();
      cleanup = undefined;
    },
    isRunning: () => started,
  };
}

export function splitPlacement(placement: Placement): [Side, Alignment | undefined] {
  return placement.split('-') as [Side, Alignment | undefined];
}
