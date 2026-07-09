import {
  ComponentRef,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { domEventHandler } from '@ngneers/controls/api/ng';

import { NgnMenu } from './menu';
import { openMenuAt } from './open-menu-at';

import type { MenuItem } from './types';

@Directive({ selector: '[ngnContextMenu]' })
export class NgnContextMenu implements OnDestroy {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _vcr = inject(ViewContainerRef);
  private _menu?: ComponentRef<NgnMenu>;

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
    this.openMenu(event);
    return false;
  }

  private openMenu(event: PointerEvent) {
    const anchor = { x: event.clientX, y: event.clientY };

    if (this._menu) {
      // Reopen the cached menu: openMenuAt only auto-shows the first instance,
      // so a right-click after it was closed must update the anchor and re-show.
      this._menu.setInput('anchor', anchor);
      this._menu.instance.show();
    } else {
      this._menu = openMenuAt(this._vcr, this.ngnContextMenu(), anchor);
    }
  }
}
