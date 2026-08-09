import { afterNextRender, DestroyRef, inject, signal, type Signal, Type } from '@angular/core';

import type { AnyNgnBase, FullAnyNgnBase } from './base';

const NGN_INSTANCE_KEY = '__ngneers_control_instance__';

function elementWithInstance(
  element: HTMLElement
): HTMLElement & { [NGN_INSTANCE_KEY]?: AnyNgnBase } {
  return element as HTMLElement & { [NGN_INSTANCE_KEY]?: FullAnyNgnBase };
}

export function setNgnInstance(element: HTMLElement, instance: AnyNgnBase): void {
  elementWithInstance(element)[NGN_INSTANCE_KEY] = instance;
  inject(DestroyRef).onDestroy(() => {
    delete elementWithInstance(element)[NGN_INSTANCE_KEY];
  });
}

export function getNgnInstance(element: HTMLElement): FullAnyNgnBase {
  return elementWithInstance(element)[NGN_INSTANCE_KEY] as FullAnyNgnBase;
}

export function getNearestNgnInstance<T extends Type<Omit<AnyNgnBase, 'kind'>>>(
  element: HTMLElement,
  kind?: T
): InstanceType<T> | null {
  let current: HTMLElement | null = element;
  while (current) {
    const instance = elementWithInstance(current)[NGN_INSTANCE_KEY] as FullAnyNgnBase | undefined;
    if (instance && (!kind || instance instanceof kind)) {
      return instance as InstanceType<T>;
    }
    current = current.parentElement;
  }
  return null;
}

export function getNearestNgnInstanceSig<T extends Type<AnyNgnBase>>(
  element: HTMLElement,
  kind?: T
): Signal<InstanceType<T> | null> {
  const sig = signal<InstanceType<T> | null>(null);
  afterNextRender(() => {
    sig.set(getNearestNgnInstance(element, kind));
  });
  return sig;
}
