import { DestroyRef, inject } from '@angular/core';

import { NgnBase } from './base';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyNgnBase = NgnBase<any>;

const NGN_INSTANCE_KEY = '__ngneers_control_instance__';

function elementWithInstance(
  element: HTMLElement
): HTMLElement & { [NGN_INSTANCE_KEY]?: AnyNgnBase } {
  return element as HTMLElement & { [NGN_INSTANCE_KEY]?: AnyNgnBase };
}

export function setNgnInstance(element: HTMLElement, instance: AnyNgnBase): void {
  elementWithInstance(element)[NGN_INSTANCE_KEY] = instance;
  inject(DestroyRef).onDestroy(() => {
    delete elementWithInstance(element)[NGN_INSTANCE_KEY];
  });
}

export function getNgnInstance(element: HTMLElement): AnyNgnBase {
  return elementWithInstance(element)[NGN_INSTANCE_KEY] as AnyNgnBase;
}

export function getNearestNgnInstance(element: HTMLElement): AnyNgnBase | null {
  let current: HTMLElement | null = element;
  while (current) {
    const instance = elementWithInstance(current)[NGN_INSTANCE_KEY] as AnyNgnBase | undefined;
    if (instance) {
      return instance;
    }
    current = current.parentElement;
  }
  return null;
}
