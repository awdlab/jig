import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
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
import { type Anchor, AwdTemplate, type Openable, Platform } from '@awdlab/jig/api/ng';
import { AwdPt, provideSelf } from '@awdlab/jig/base';
import { AwdAutofocus } from '@awdlab/jig/directives';
import { AwdIcon } from '@awdlab/jig/icon';
import { AwdPopover } from '@awdlab/jig/popover';
import { maybeCallback, AwdError } from '@awdlab/jig/utils';
import { effectWithPrevious, explicitEffect, generateElementId } from '@awdlab/jig/utils-ng';
import { menuControlTemplate } from '@awdlab/jig-themes/templates/menu';

import { MenuTemplates } from './menu-templates';

import type { MenuItem } from './types';
import type { Placement } from '@floating-ui/dom';
import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'jig-menu',
  imports: [AwdPt, NgTemplateOutlet, AwdTemplate, AwdAutofocus, AwdPopover, AwdIcon, RouterLink],
  templateUrl: './menu.html',

  providers: [provideSelf(AwdMenu)],
})
export class AwdMenu extends MenuTemplates implements Openable {
  protected readonly theme = this.injectThemeTemplate(menuControlTemplate, {
    submenu: () => this.isSubMenu(),
  });
  protected readonly elementId = input(generateElementId());
  /**
   * The element to which the menu is anchored. Required if {@link popover} is `true`.
   */
  public readonly anchor = input<Anchor>();
  /**
   * The menu items to display.
   */
  public readonly items = input.required<MenuItem[]>();
  /**
   * Whether to automatically set ARIA attributes on the anchor element.
   * @default true if anchor is an HTMLButtonElement, false otherwise.
   */
  public readonly autoAnchorAria = input<boolean>();
  /**
   * Whether the menu is a popover. Requires {@link anchor} to be set.
   * @default false
   */
  public readonly popover = input(false, { transform: booleanAttribute });
  /**
   * The placement of the menu relative to the anchor element. Only used when {@link popover} is `true`.
   * @default bottom-start
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
  public readonly isSubMenu = input(false, { transform: booleanAttribute });
  /**
   * Whether to open submenus on hover. Defaults to true in popover mode.
   * @default popover()
   */
  public readonly openSubmenuOnHover = input(false, { transform: booleanAttribute });

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

  protected readonly maybeCallback = maybeCallback;

  /**
   * Roving focus: exactly one item is a tab stop, the arrow keys move focus between them.
   * Defaults to the first enabled item and follows the focused one from there.
   */
  protected readonly focusedIndex = signal<number | null>(null);
  protected readonly tabStopIndex = computed(
    () =>
      this.focusedIndex() ??
      this.items().findIndex(item => !('separator' in item) && !item.disabled)
  );

  private readonly _isTouchDevice = inject(Platform).isTouchDevice;
  private readonly _popover = viewChild(AwdPopover);
  private readonly _menuItems = viewChildren<ElementRef<HTMLElement>>('menuItem');
  private readonly _childMenus = viewChildren(AwdMenu);
  private readonly _openSubmenuOnHover = computed(
    () => this.openSubmenuOnHover() ?? this.popover()
  );
  protected readonly autofocus = signal(false);
  private _destroyed = false;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => (this._destroyed = true));
    effect(() => {
      if (this.popover() && !this.anchor()) {
        throw new AwdError(
          'AwdMenu',
          'When using popover mode, the anchor input must be provided.'
        );
      }
    });

    const autoAriaEnabled = computed(() => {
      if (this.autoAnchorAria() !== undefined) {
        return this.autoAnchorAria();
      }
      return this.anchor() instanceof HTMLButtonElement;
    });

    effectWithPrevious(this.anchor, (current, previous) => {
      if (previous instanceof HTMLElement && autoAriaEnabled()) {
        previous.removeAttribute('aria-controls');
        previous.removeAttribute('aria-expanded');
        previous.removeAttribute('aria-haspopup');
      }
      if (current instanceof HTMLElement && autoAriaEnabled()) {
        current.setAttribute('aria-controls', `${this.elementId()}_menu`);
        current.setAttribute('aria-haspopup', 'menu');
      }
    });

    effect(() => {
      const anchor = this.anchor();
      if (anchor instanceof HTMLElement && autoAriaEnabled()) {
        anchor.setAttribute('aria-expanded', this.open() ? 'true' : 'false');
      }
    });

    explicitEffect([this.open], ([open]) => {
      if (!open) {
        if (this._popover()?.open()) {
          this.hide();
        }
      }
      if (open) {
        if (!this._popover()?.open()) {
          this.show(this.autofocus());
        }
      }
    });
  }

  /**
   * Shows the menu.
   * @param focus Whether to focus the menu after showing it. Defaults to `true`.
   */
  public show(focus = true) {
    if (!this.popover()) {
      throw new AwdError(
        'AwdMenu',
        'The show() method can only be used when popover mode is enabled.'
      );
    }
    this._popover()?.show();
    this.autofocus.set(focus);
  }

  /**
   * Hides the menu.
   * @param emitCloseEvent Whether to emit the close event. Defaults to `true`.
   */
  public hide(emitCloseEvent = true) {
    if (!this.popover()) {
      throw new AwdError(
        'AwdMenu',
        'The hide() method can only be used when popover mode is enabled.'
      );
    }
    this._popover()?.hide(emitCloseEvent);
  }

  /**
   * Toggles the menu open or closed.
   */
  public toggle() {
    if (!this.popover()) {
      throw new AwdError(
        'AwdMenu',
        'The toggle() method can only be used when popover mode is enabled.'
      );
    }
    const popoverEl = this._popover();
    if (!popoverEl) {
      throw new AwdError('AwdMenu', 'Popover element is not available.');
    }
    if (popoverEl.open()) {
      popoverEl.hide();
    } else {
      popoverEl.open();
    }
  }

  protected handleKeydown(event: KeyboardEvent, subMenu?: AwdMenu) {
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
      this._menuItems()[currentIndex]?.nativeElement.focus();
    } else if (event.key === 'ArrowRight' && subMenu) {
      this.openChildMenu(subMenu, null, 'arrow');
    } else if (event.key === 'ArrowLeft' && this.isSubMenu()) {
      this._popover()?.hide();
    }
  }

  protected doCloseAll() {
    this.hide();
    // Delay the closing of the parents to ensure the children close first (for animation purposes)
    requestAnimationFrame(() => {
      // An item callback may have destroyed this menu (e.g. removing the row it lives in).
      if (this._destroyed) {
        return;
      }
      this.closeAll.emit();
    });
  }

  protected itemClicked(item: MenuItem) {
    if (this.popover()) {
      this.doCloseAll();
    }
    if ('callback' in item) {
      item.callback?.();
    }
  }

  protected closeChildMenus(
    closeBy: 'hover' | 'click' | 'arrow',
    menuItem: HTMLButtonElement | null
  ) {
    if (closeBy === 'hover') {
      if (this._isTouchDevice() || !this._openSubmenuOnHover()) {
        return;
      }
      if (this._openSubmenuOnHover()) {
        menuItem?.focus();
      }
    }
    this._childMenus().forEach(menu => {
      menu.hide(false);
    });
  }

  protected openChildMenu(
    childMenu: AwdMenu,
    menuItem: HTMLButtonElement | null,
    openBy: 'hover' | 'click' | 'arrow'
  ) {
    if (openBy === 'hover') {
      if (this._isTouchDevice() || !this._openSubmenuOnHover()) {
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
