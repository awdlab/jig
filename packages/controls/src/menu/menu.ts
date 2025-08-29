import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Placement } from '@floating-ui/dom';
import { injectThemeTemplate, NgnAutofocus, NgnTemplate } from '@ngneers/controls/api/ng';
import { IconType } from '@ngneers/controls/custom-types';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnPopover } from '@ngneers/controls/popover';
import { menuControlTemplate } from '@ngneers/controls-themes/templates/menu';

import { MenuTemplates } from './menu-templates';
import { MenuItem } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-menu',
  imports: [NgClass, NgTemplateOutlet, NgnTemplate, NgnAutofocus, NgnPopover, NgnIcon],
  templateUrl: './menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'isSubMenu() ? theme.class("submenu") : ""',
  },
})
export class NgnMenu extends MenuTemplates {
  protected readonly theme = injectThemeTemplate(menuControlTemplate);
  public readonly anchor = input.required<HTMLElement>();
  public readonly items = input.required<MenuItem[]>();
  public readonly popover = input<boolean>();
  public readonly placement = input<Placement>('bottom-start');
  public readonly iconChildren = input<IconType>();
  /**
   * @internal
   */
  public readonly isSubMenu = input<boolean>(false);

  public readonly popoverClosed = output<void>();

  private readonly _popover = viewChild.required(NgnPopover);
  private readonly _menuItems = viewChildren<ElementRef<HTMLElement>>('menuItem');

  public open() {
    this._popover().open();
  }

  protected handleKeydown(event: KeyboardEvent, hasSubMenu: boolean) {
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
    } else if (event.key === 'ArrowRight' && hasSubMenu) {
      this._menuItems()[currentIndex].nativeElement.click();
    } else if (event.key === 'ArrowLeft' && this.isSubMenu()) {
      this._popover().close();
    }
  }
}
