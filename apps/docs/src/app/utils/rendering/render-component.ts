import { ApplicationRef, createComponent, EnvironmentInjector, untracked } from '@angular/core';

import type { DestroyRef, Type, ViewContainerRef } from '@angular/core';

export function renderComponent(
  toRender: Type<unknown>,
  vcr: ViewContainerRef,
  destroyRef: DestroyRef,
  options?: {
    element?: HTMLElement;
  }
) {
  return untracked(() => {
    function create() {
      if (options?.element) {
        const ref = createComponent(toRender, {
          hostElement: options.element,
          environmentInjector: vcr.injector.get(EnvironmentInjector),
          elementInjector: vcr.injector,
        });
        const appRef = vcr.injector.get(ApplicationRef);
        appRef.attachView(ref.hostView);
        destroyRef.onDestroy(() => {
          appRef.detachView(componentRef.hostView);
        });
        return ref;
      } else {
        return vcr.createComponent(toRender);
      }
    }

    const componentRef = create();

    destroyRef.onDestroy(() => {
      componentRef.destroy();
    });

    return componentRef;
  });
}
