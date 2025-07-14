import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  DestroyRef,
  EnvironmentInjector,
  inject,
  Injector,
} from '@angular/core';
import { IconType } from '@ngneers/controls/custom-types';

import { NgnIcon } from './icon';

const icons = new Map<symbol, ComponentRef<NgnIcon>>();

type IconComponentOptions = {
  /**
   * The ID of the icon component. This is used to manage the lifecycle of the icon component.
   * If an icon with the same ID already exists, it will be destroyed before creating a new one.
   * This is useful for dynamically changing icons in components like buttons.
   */
  iconId?: symbol;
  /**
   * The injector to use for the icon component. If not provided, the default injector will be used.
   */
  injector?: Injector;
  /**
   * The element to which the icon component will be attached. If not provided, the icon will not be attached to any element.
   */
  attachTo?: Element;
};

/**
 * Creates an icon component.
 * @param icon The icon to display.
 * @param options Options for creating the icon component.
 * @returns The created icon component.
 */
export function createIconComponent(
  icon: IconType,
  options: IconComponentOptions = {}
): ComponentRef<NgnIcon> {
  const injector = options.injector || inject(Injector);
  const componentRef = createComponent(NgnIcon, {
    environmentInjector: injector.get(EnvironmentInjector),
    elementInjector: injector,
  });
  componentRef.setInput('icon', icon);
  injector.get(DestroyRef).onDestroy(() => {
    componentRef.destroy();
  });
  if (options.attachTo) {
    injector.get(ApplicationRef).attachView(componentRef.hostView);
    options.attachTo.appendChild(componentRef.location.nativeElement);
  }
  if (options.iconId) {
    if (icons.has(options.iconId)) {
      const existingIcon = icons.get(options.iconId);
      if (existingIcon) {
        existingIcon.destroy();
      }
    }
    icons.set(options.iconId, componentRef);
  }
  return componentRef;
}

/**
 * Destroys an icon component by its ID.
 * This is useful for cleaning up dynamically created icons
 * @param iconId The ID of the icon component to destroy.
 */
export function destroyIconComponent(iconId: symbol): void {
  const iconComponent = icons.get(iconId);
  if (iconComponent) {
    iconComponent.destroy();
    icons.delete(iconId);
  }
}
