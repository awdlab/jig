import { setComponentInput, type Anchor } from '@awdlab/jig/api/ng';

import { JigMenu } from './menu';

import type { MenuItem } from './types';
import type { ComponentRef, ViewContainerRef } from '@angular/core';
import type { Placement } from '@floating-ui/dom';

/**
 * Lazily creates (or reuses) a `jigMenu` popover and shows it anchored either
 * at a viewport point (context-menu style) or to an element. Returns the
 * `ComponentRef` so callers can keep it for reuse and destroy it on teardown.
 */
export function openMenuAt(
  vcr: ViewContainerRef,
  existing: ComponentRef<JigMenu> | undefined,
  items: MenuItem[],
  anchor: Anchor,
  placement?: Placement
): ComponentRef<JigMenu> {
  const menu = existing ?? vcr.createComponent(JigMenu);
  setComponentInput(menu, 'items', items);
  setComponentInput(menu, 'anchor', anchor);
  setComponentInput(menu, 'popover', true);
  if (placement) {
    setComponentInput(menu, 'placement', placement);
  }
  // Renders and shows synchronously, so open latency does not depend on macrotask scheduling under load.
  if (!menu.hostView.destroyed) {
    menu.changeDetectorRef.detectChanges();
    menu.instance.show();
  }
  return menu;
}
