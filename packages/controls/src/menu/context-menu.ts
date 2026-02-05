import {
  ComponentRef,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { domEventHandler, setComponentInput } from '@ngneers/controls/api/ng';

import { NgnMenu } from './menu';

import type { MenuItem } from './types';

@Directive({ selector: '[ngnContextMenu]' })
export class NgnContextMenu implements OnDestroy {
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _vcr = inject(ViewContainerRef);
  private _menu?: ComponentRef<NgnMenu>;

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

  private createMenu() {
    if (!this._menu) {
      this._menu = this._vcr.createComponent(NgnMenu);
    }
    return this._menu;
  }

  private openMenu(event: PointerEvent) {
    const menu = this.createMenu();

    setComponentInput(menu, 'items', this.ngnContextMenu());
    setComponentInput(menu, 'anchor', { x: event.clientX, y: event.clientY });
    setComponentInput(menu, 'popover', true);
    setTimeout(() => {
      menu.instance.show();
    });
  }
}
