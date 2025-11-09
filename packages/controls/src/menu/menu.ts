import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Placement } from '@floating-ui/dom';
import { NgnTemplate, Openable, Platform } from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { NgnAutofocus } from '@ngneers/controls/directives';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnPopover } from '@ngneers/controls/popover';
import { NgnError } from '@ngneers/controls/utils';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { IconType } from '@ngneers/controls-custom-types';
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
export class NgnMenu extends MenuTemplates implements Openable {
  protected readonly theme = this.injectThemeTemplate(menuControlTemplate);
  protected readonly elementId = input(generateElementId());
  /**
   * The element to which the menu is anchored. Required if `popover` is true.
   */
  public readonly anchor = input<HTMLElement>();
  /**
   * The menu items to display.
   */
  public readonly items = input.required<MenuItem[]>();
  /**
   * Whether the menu is a popover. Requires `anchor` to be set.
   */
  public readonly popover = input<boolean>();
  /**
   * The placement of the menu relative to the anchor element. Only used if `popover` is true.
   * @default 'bottom-start'
   */
  public readonly placement = input<Placement>('bottom-start');
  /**
   * Icon type for children indicator (submenu indicator). If not set, a default icon will be used.
   */
  public readonly iconSubmenuIndicator = input<IconType>();
  /**
   * Whether this menu is a submenu. Used internally.
   * @internal
   */
  public readonly isSubMenu = input<boolean>(false);
  /**
   * Whether to open submenus on hover.
   * @default true
   */
  public readonly openSubmenuOnHover = input<boolean>(true);

  /**
   * Emitted when the menu is fully closed.
   */
  public readonly closed = output<void>();
  /**
   * Emitted when the menu is about to close.
   */
  public readonly closing = output<void>();
  /**
   * Emitted when all menus should be closed (including parent menus). Used internally.
   * @internal
   */
  public readonly closeAll = output<void>();
  /**
   * Shows or hides the menu.
   *
   * You probably want to react to openChange events from outside to update your variable accordingly.
   */
  public readonly open = model(false);

  private readonly _isTouchDevice = inject(Platform).isTouchDevice;
  private readonly _popover = viewChild.required(NgnPopover);
  private readonly _menuItems = viewChildren<ElementRef<HTMLElement>>('menuItem');
  private readonly _childMenus = viewChildren(NgnMenu);
  protected readonly autofocus = signal(false);

  constructor() {
    super();
    effect(() => {
      if (this.popover() && !this.anchor()) {
        throw new NgnError(
          'NgnMenu',
          'When using popover mode, the anchor input must be provided.'
        );
      }
    });
  }

  /**
   * Shows the menu.
   * @param focus Whether to focus the menu after showing it. Defaults to `true`.
   */
  public show(focus = true) {
    this._popover().show();
    this.autofocus.set(focus);
  }

  /**
   * Hides the menu.
   * @param emitCloseEvent Whether to emit the close event. Defaults to `true`.
   */
  public hide(emitCloseEvent = true) {
    this._popover().hide(emitCloseEvent);
  }

  /**
   * Toggles the menu open or closed.
   */
  public toggle() {
    this._popover().toggle();
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
      this._popover().hide();
    }
  }

  protected doCloseAll() {
    this.hide();
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
      menu.hide(false);
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
    if (childMenu.open()) {
      menuItem?.focus();
      return;
    }
    this.closeChildMenus(openBy, menuItem);
    setTimeout(() => {
      childMenu.show(openBy === 'arrow');
    });
  }

  protected popoverOpenChange(newState: boolean) {
    this.open.set(newState);
  }

  protected popoverClosed() {
    this.closed.emit();
  }
}
