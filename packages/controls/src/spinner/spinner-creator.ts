import {
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  runInInjectionContext,
  type Signal,
  ViewContainerRef,
} from '@angular/core';
import { setComponentInput } from '@awdlab/jig/api/ng';
import { debounceSignal } from '@awdlab/jig/utils-ng';

import { NgnSpinner } from './spinner';

import type { CustomColor } from '@awdlab/jig-custom-types';

/**
 * Creates an instance of the spinner creator.
 *
 * @param injector The injector to use. Defaults to the current injector.
 * @returns The spinner creator.
 */
export function injectSpinnerCreator(injector?: Injector): NgnSpinnerCreator {
  if (injector) {
    return runInInjectionContext(injector, () => injectSpinnerCreator());
  }
  return new NgnSpinnerCreator();
}

/**
 * Creates and manages a conditional spinner based on a visibility signal.
 * @param isVisible Signal that determines whether the spinner is visible.
 * @param options Optional configuration for the spinner.
 */
export function createConditionalSpinner(
  isVisible: Signal<boolean>,
  options?: {
    /**
     * Options for the spinner instance.
     */
    spinnerOptions?: SpinnerOptions;
    /**
     * Debounce time in milliseconds or a boolean indicating whether to debounce (default is 200ms).
     */
    debounce?: number | boolean;
    /**
     * The target element where the spinner will be attached.
     * If a string is provided, it will be used as a selector to find the element.
     * If omitted, the spinner will be attached to the host element of the current injector.
     */
    element?: SpinnerTarget;
    /**
     * The injector to use. If omitted, the current injector will be used.
     */
    injector?: Injector;
  }
) {
  if (options?.injector) {
    runInInjectionContext(options.injector, () =>
      createConditionalSpinner(isVisible, {
        ...options,
        injector: undefined,
      })
    );
    return;
  }

  const debounceMs =
    typeof options?.debounce === 'number'
      ? options.debounce
      : (options?.debounce ?? true)
        ? 200
        : 0;

  const debouncedVisible = debounceMs ? debounceSignal(isVisible, debounceMs) : isVisible;

  const spinnerCreator = injectSpinnerCreator();
  const element = options?.element ?? inject(ElementRef).nativeElement;
  let ref: SpinnerRef | undefined;
  effect(() => {
    const visible = debouncedVisible();
    if (visible && !ref) {
      ref = spinnerCreator.show(element, options?.spinnerOptions);
    } else if (!visible && ref) {
      ref.hide();
      ref = undefined;
    }
  });
}

export type SpinnerRef = {
  /**
   * Hides the spinner.
   */
  hide: () => void;
};

export type SpinnerTarget = HTMLElement | ElementRef<HTMLElement> | string;
export type SpinnerOptions = {
  /**
   * The color of the spinner.
   */
  color?: CustomColor;
  /**
   * The diameter of the spinner in pixels.
   * @default 64
   */
  size?: number;
  /**
   * The thickness of the spinner's stroke. If not provided,
   * a default thickness derived from the size will be used.
   * @default undefined
   */
  thickness?: string;
  /**
   * Whether the spinner should be centered within its container.
   * @default true
   */
  centered?: boolean;
  /**
   * Set aria busy attribute on the reference element while the spinner is visible.
   * @default true
   */
  ariaBusy?: boolean;
};

function getElement(target: SpinnerTarget): HTMLElement | null {
  if (typeof target === 'string') {
    return document.querySelector(target);
  } else if (target instanceof ElementRef) {
    return target.nativeElement;
  } else {
    return target;
  }
}

const DEFAULT_OPTIONS: SpinnerOptions = {
  centered: true,
  ariaBusy: true,
};

class NgnSpinnerCreator {
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _destroyRef = inject(DestroyRef);
  private _destroyed = false;

  constructor() {
    this._destroyRef.onDestroy(() => {
      this._destroyed = true;
    });
  }

  /**
   * Shows a spinner on the specified target element.
   * @param target The target element or selector where the spinner will be attached.
   * If a string is provided, it will be used as a selector to find the element.
   * If the element is not found, the spinner will be retried until it is found.
   * @param options Optional configuration for the spinner.
   * @returns A reference to the spinner instance.
   */
  public show(target: SpinnerTarget, options?: SpinnerOptions): SpinnerRef {
    options = { ...DEFAULT_OPTIONS, ...options };
    const hideCb = {
      hide: () => {},
    };
    this._tryAttach(target, options, hideCb);
    return {
      hide: () => hideCb.hide(),
    };
  }

  private _tryAttach(
    target: SpinnerTarget,
    options: SpinnerOptions,
    hideCb: { hide?: () => void }
  ) {
    if (this._destroyed) {
      return;
    }
    const element = getElement(target);
    if (!element) {
      setTimeout(() => {
        this._tryAttach(target, options, hideCb);
      }, 10);
      return;
    }
    const componentRef = this._vcr.createComponent(NgnSpinner);

    const doHide = () => {
      componentRef.destroy();
      if (options?.ariaBusy) {
        element.removeAttribute('aria-busy');
      }
      delete hideCb.hide;
    };

    hideCb.hide = () => {
      doHide();
      unregisterOnDestroy();
    };
    element.appendChild(componentRef.location.nativeElement);
    if (options.ariaBusy) {
      element.setAttribute('aria-busy', 'true');
    }
    const unregisterOnDestroy = this._destroyRef.onDestroy(() => {
      doHide();
    });
    if (options.color) {
      setComponentInput(componentRef, 'color', options.color);
    }
    if (options.size) {
      setComponentInput(componentRef, 'size', options.size);
    }
    if (options.thickness) {
      setComponentInput(componentRef, 'thickness', options.thickness);
    }
    if (options.centered) {
      setComponentInput(componentRef, 'centered', options.centered);
    }
  }
}
