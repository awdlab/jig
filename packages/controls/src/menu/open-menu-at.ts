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
  // Render the menu's own view synchronously so its `popover` viewChild
  // resolves, then show it immediately. Deferring the show to a macrotask
  // (setTimeout) makes the open latency depend on macrotask scheduling — under
  // a busy host (e.g. a large table running frequent change detection) that
  // callback is delayed noticeably, so the menu appears to open slowly. A
  // synchronous change-detection + show opens deterministically regardless of
  // host load. Guard against the host being torn down mid-call.
  if (!menu.hostView.destroyed) {
    menu.changeDetectorRef.detectChanges();
    menu.instance.show();
  }
  return menu;
}
