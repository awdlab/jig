import {
  ComponentRef,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { domEventHandler } from '@awdlab/jig/api/ng';

import { JigMenu } from './menu';
import { openMenuAt } from './open-menu-at';

import type { MenuItem } from './types';

/**
 * Opens an {@link JigMenu} at the pointer on right-click, replacing the native
 * browser context menu for its host element.
 *
 * The menu is created lazily on first use and reused afterwards; right-clicking
 * again while it is open is ignored rather than reopening it.
 *
 * @category directive
 */
@Directive({ selector: '[ngnContextMenu]' })
export class JigContextMenu implements OnDestroy {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _vcr = inject(ViewContainerRef);
  private _menu?: ComponentRef<JigMenu>;

  /**
   * The menu items to display in the context menu opened on right-click.
   */
  public readonly ngnContextMenu = input.required<MenuItem[]>();

  constructor() {
    domEventHandler(this._elementRef, 'contextmenu', this.handleClick.bind(this));
  }

  public ngOnDestroy(): void {
    this._menu?.destroy();
  }

  private handleClick(event: PointerEvent) {
    if (event.button !== 2) {
      return;
    }
    if (this._menu?.instance.open()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this._menu = openMenuAt(this._vcr, this._menu, this.ngnContextMenu(), {
      x: event.clientX,
      y: event.clientY,
    });
    return false;
  }
}
