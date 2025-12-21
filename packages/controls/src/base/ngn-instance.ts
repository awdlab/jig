import { DestroyRef, inject, Type } from '@angular/core';

import { AnyNgnBase } from './base';

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

export function getNearestNgnInstance<T extends Type<Omit<AnyNgnBase, 'kind'>>>(
  element: HTMLElement,
  kind?: T
): InstanceType<T> | null {
  let current: HTMLElement | null = element;
  while (current) {
    const instance = elementWithInstance(current)[NGN_INSTANCE_KEY] as AnyNgnBase | undefined;
    if (instance && (!kind || instance instanceof kind)) {
      return instance as InstanceType<T>;
    }
    current = current.parentElement;
  }
  return null;
}
