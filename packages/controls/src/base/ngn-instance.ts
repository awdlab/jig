import { afterNextRender, DestroyRef, inject, signal, type Signal, Type } from '@angular/core';

import type { AnyAwdBase, FullAnyAwdBase } from './base';

const NGN_INSTANCE_KEY = '__ngneers_control_instance__';

function elementWithInstance(
  element: HTMLElement
): HTMLElement & { [NGN_INSTANCE_KEY]?: AnyAwdBase } {
  return element as HTMLElement & { [NGN_INSTANCE_KEY]?: FullAnyAwdBase };
}

export function setAwdInstance(element: HTMLElement, instance: AnyAwdBase): void {
  elementWithInstance(element)[NGN_INSTANCE_KEY] = instance;
  inject(DestroyRef).onDestroy(() => {
    delete elementWithInstance(element)[NGN_INSTANCE_KEY];
  });
}

export function getAwdInstance(element: HTMLElement): FullAnyAwdBase {
  return elementWithInstance(element)[NGN_INSTANCE_KEY] as FullAnyAwdBase;
}

export function getNearestAwdInstance<T extends Type<Omit<AnyAwdBase, 'kind'>>>(
  element: HTMLElement,
  kind?: T
): InstanceType<T> | null {
  let current: HTMLElement | null = element;
  while (current) {
    const instance = elementWithInstance(current)[NGN_INSTANCE_KEY] as FullAnyAwdBase | undefined;
    if (instance && (!kind || instance instanceof kind)) {
      return instance as InstanceType<T>;
    }
    current = current.parentElement;
  }
  return null;
}

export function getNearestAwdInstanceSig<T extends Type<AnyAwdBase>>(
  element: HTMLElement,
  kind?: T
): Signal<InstanceType<T> | null> {
  const sig = signal<InstanceType<T> | null>(null);
  afterNextRender(() => {
    sig.set(getNearestAwdInstance(element, kind));
  });
  return sig;
}
