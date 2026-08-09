import { afterNextRender, DestroyRef, inject, signal, type Signal, Type } from '@angular/core';

import type { AnyJigBase, FullAnyJigBase } from './base';

const JIG_INSTANCE_KEY = '__jig_control_instance__';

function elementWithInstance(
  element: HTMLElement
): HTMLElement & { [JIG_INSTANCE_KEY]?: AnyJigBase } {
  return element as HTMLElement & { [JIG_INSTANCE_KEY]?: FullAnyJigBase };
}

export function setJigInstance(element: HTMLElement, instance: AnyJigBase): void {
  elementWithInstance(element)[JIG_INSTANCE_KEY] = instance;
  inject(DestroyRef).onDestroy(() => {
    delete elementWithInstance(element)[JIG_INSTANCE_KEY];
  });
}

export function getJigInstance(element: HTMLElement): FullAnyJigBase {
  return elementWithInstance(element)[JIG_INSTANCE_KEY] as FullAnyJigBase;
}

export function getNearestJigInstance<T extends Type<Omit<AnyJigBase, 'kind'>>>(
  element: HTMLElement,
  kind?: T
): InstanceType<T> | null {
  let current: HTMLElement | null = element;
  while (current) {
    const instance = elementWithInstance(current)[JIG_INSTANCE_KEY] as FullAnyJigBase | undefined;
    if (instance && (!kind || instance instanceof kind)) {
      return instance as InstanceType<T>;
    }
    current = current.parentElement;
  }
  return null;
}

export function getNearestJigInstanceSig<T extends Type<AnyJigBase>>(
  element: HTMLElement,
  kind?: T
): Signal<InstanceType<T> | null> {
  const sig = signal<InstanceType<T> | null>(null);
  afterNextRender(() => {
    sig.set(getNearestJigInstance(element, kind));
  });
  return sig;
}
