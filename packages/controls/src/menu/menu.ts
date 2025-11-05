import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Placement } from '@floating-ui/dom';
import { NgnAutofocus, NgnTemplate, Platform } from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { IconType } from '@ngneers/controls/custom-types';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnPopover } from '@ngneers/controls/popover';
import { afterRenderComputed, generateElementId } from '@ngneers/controls/utils-ng';
import { menuControlTemplate } from '@ngneers/controls-themes/templates/menu';

import { MenuTemplates } from './menu-templates';
import { MenuItem } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-menu',
  imports: [NgClass, NgTemplateOutlet, NgnTemplate, NgnAutofocus, NgnPopover, NgnIcon, RouterLink],
  templateUrl: './menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideSelf(NgnMenu)],
  host: {
    '[class]': 'isSubMenu() ? theme.class("submenu") : ""',
  },
})
export class NgnMenu extends MenuTemplates {
  protected readonly theme = this.injectThemeTemplate(menuControlTemplate);
  protected readonly elementId = input(generateElementId());
  public readonly anchor = input.required<HTMLElement>();
  public readonly items = input.required<MenuItem[]>();
  public readonly popover = input<boolean>();
  public readonly placement = input<Placement>('bottom-start');
  public readonly iconChildrenIndicator = input<IconType>();
  public readonly isSubMenu = input<boolean>(false);
  public readonly openSubmenuOnHover = input<boolean>(true);

  public readonly closed = output<void>();
  public readonly closeAll = output<void>();
  public readonly isOpen = afterRenderComputed(() => this._popover().isOpen(), false);

  private readonly _isTouchDevice = inject(Platform).isTouchDevice;
  private readonly _popover = viewChild.required(NgnPopover);
  private readonly _menuItems = viewChildren<ElementRef<HTMLElement>>('menuItem');
  private readonly _childMenus = viewChildren(NgnMenu);
  protected readonly autofocus = signal(false);

  public open(focus = true) {
    this._popover().open();
    this.autofocus.set(focus);
  }

  public close(emitCloseEvent = true) {
    this._popover().close(emitCloseEvent);
  }

  protected handleKeydown(event: KeyboardEvent, subMenu?: NgnMenu) {
    let currentIndex = this._menuItems()
      .map(x => x.nativeElement)
      .indexOf(event.target as HTMLElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (event.key === 'ArrowDown') {
        currentIndex++;
      } else if (event.key === 'ArrowUp') {
        currentIndex--;
      }
      if (currentIndex < 0) {
        currentIndex = this._menuItems().length - 1;
      } else if (currentIndex >= this._menuItems().length) {
        currentIndex = 0;
      }
      this._menuItems()[currentIndex].nativeElement.focus();
    } else if (event.key === 'ArrowRight' && subMenu) {
      this.openChildMenu(subMenu, null, 'arrow');
    } else if (event.key === 'ArrowLeft' && this.isSubMenu()) {
      this._popover().close();
    }
  }

  protected doCloseAll() {
    this.close();
    // Delay the closing of the parents to ensure the children close first (for animation purposes)
    requestAnimationFrame(() => {
      this.closeAll.emit();
    });
  }

  protected itemClicked(item: MenuItem) {
    this.doCloseAll();
    if ('callback' in item) {
      item.callback?.();
    }
  }

  protected closeChildMenus(
    closeBy: 'hover' | 'click' | 'arrow',
    menuItem: HTMLButtonElement | null
  ) {
    if (closeBy === 'hover') {
      if (this._isTouchDevice() || !this.openSubmenuOnHover()) {
        return;
      }
      if (this.openSubmenuOnHover()) {
        menuItem?.focus();
      }
    }
    this._childMenus().forEach(menu => {
      menu.close(false);
    });
  }

  protected openChildMenu(
    childMenu: NgnMenu,
    menuItem: HTMLButtonElement | null,
    openBy: 'hover' | 'click' | 'arrow'
  ) {
    if (openBy === 'hover') {
      if (this._isTouchDevice() || !this.openSubmenuOnHover()) {
        return;
      }
    }
    if (childMenu.isOpen()) {
      menuItem?.focus();
      return;
    }
    this.closeChildMenus(openBy, menuItem);
    setTimeout(() => {
      childMenu.open(openBy === 'arrow');
    });
  }

  protected popoverClosed() {
    this.closed.emit();
  }
}
