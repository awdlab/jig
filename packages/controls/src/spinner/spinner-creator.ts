import { DestroyRef, ElementRef, inject, ViewContainerRef } from '@angular/core';
import { setComponentInput } from '@ngneers/controls/api/ng';
import { CustomColor } from '@ngneers/controls-custom-types';

import { NgnSpinner } from './spinner';

export function injectSpinnerCreator() {
  return new NgnSpinnerCreator();
}

export type SpinnerRef = {
  hide: () => void;
};

export type SpinnerTarget = HTMLElement | ElementRef<HTMLElement> | string;
export type SpinnerOptions = {
  color?: CustomColor;
  size?: number;
  thickness?: string;
  centered?: boolean;
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
      delete hideCb.hide;
    };

    hideCb.hide = () => {
      doHide();
      unregisterOnDestroy();
    };
    element.appendChild(componentRef.location.nativeElement);
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
