import { ComponentRef, ViewContainerRef } from '@angular/core';
import { setComponentInput } from '@ngneers/controls/api/ng';

import { NgnMenu } from './menu';

import type { MenuItem } from './types';
import type { Placement } from '@floating-ui/dom';
import type { Anchor } from '@ngneers/controls/api/ng';

export interface MenuAnchorOptions {
  /**
   * Whether the menu is a popover. Defaults to `true`.
   * @default true
   */
  popover?: boolean;
  /**
   * The placement of the menu relative to the anchor element.
   * @default bottom-start
   */
  placement?: Placement;
  /**
   * Whether to automatically set ARIA attributes on the anchor element.
   */
  autoAnchorAria?: boolean;
  /**
   * Whether to automatically show the menu. Defaults to `true`.
   * @default true
   */
  autoShow?: boolean;
}

/**
 * Opens an NgnMenu popover anchored to a point or element.
 *
 * Creates an NgnMenu component, configures it with the provided items and anchor,
 * and displays it. Useful for context menus, dropdown menus, and other anchored popovers.
 *
 * @param vcr The ViewContainerRef to insert the menu component into.
 * @param items The menu items to display.
 * @param anchor The element or point to anchor the menu to.
 * @param options Configuration options for the menu.
 * @returns The created NgnMenu component reference.
 */
export function openMenuAt(
  vcr: ViewContainerRef,
  items: MenuItem[],
  anchor: Anchor,
  options: MenuAnchorOptions = {}
): ComponentRef<NgnMenu> {
  const { popover = true, placement, autoAnchorAria, autoShow = true } = options;

  const menu = vcr.createComponent(NgnMenu);

  setComponentInput(menu, 'items', items);
  setComponentInput(menu, 'anchor', anchor);
  setComponentInput(menu, 'popover', popover);
  if (placement !== undefined) {
    setComponentInput(menu, 'placement', placement);
  }
  if (autoAnchorAria !== undefined) {
    setComponentInput(menu, 'autoAnchorAria', autoAnchorAria);
  }

  if (autoShow) {
    setTimeout(() => {
      menu.instance.show();
    });
  }

  return menu;
}
