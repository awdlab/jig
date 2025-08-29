import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { Placement } from '@floating-ui/dom';
import { injectThemeTemplate, NgnTemplate } from '@ngneers/controls/api/ng';
import { menuControlTemplate } from '@ngneers/controls-themes/templates/menu';

import { MenuTemplates } from './menu-templates';
import { NgnPopover } from '../popover';
import { MenuItem } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-menu',
  imports: [NgClass, NgTemplateOutlet, NgnTemplate, NgnPopover],
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
  public readonly placement = input<Placement>('bottom');
  /**
   * @internal
   */
  public readonly isSubMenu = input<boolean>(false);

  private readonly _popover = viewChild.required(NgnPopover);

  public open() {
    this._popover().open();
  }
}
