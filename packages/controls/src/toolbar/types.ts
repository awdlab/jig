import { InjectionToken } from '@angular/core';

import type { Signal, TemplateRef } from '@angular/core';

export type ToolbarOrientation = 'horizontal' | 'vertical';
export type ToolbarOverflow = 'wrap' | 'popover';
export type ToolbarPlacement = 'start' | 'center' | 'end';

/** The part of a region the toolbar needs to lay it out. */
export interface ToolbarRegionRef {
  readonly placement: Signal<ToolbarPlacement>;
  readonly priority: Signal<number>;
  readonly itemTemplates: Signal<readonly TemplateRef<unknown>[]>;
  readonly itemElements: Signal<readonly HTMLElement[]>;
}

/** The part of the toolbar a region needs to render itself. */
export interface ToolbarControl {
  readonly orientation: Signal<ToolbarOrientation>;
  readonly overflow: Signal<ToolbarOverflow>;
  isItemOverflowed(region: ToolbarRegionRef, itemIndex: number): boolean;
}

export const TOOLBAR_CONTROL = new InjectionToken<ToolbarControl>('TOOLBAR_CONTROL');
