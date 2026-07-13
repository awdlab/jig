import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, inject, input, output } from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { chipControlTemplate } from '@ngneers/controls-themes/templates/chip';

import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-chip',
  templateUrl: './chip.html',
  imports: [NgnPt, NgnIcon, NgTemplateOutlet],
  providers: [provideSelf(NgnChip)],
})
export class NgnChip extends NgnBase<'chip'> {
  protected readonly theme = this.injectThemeTemplate(chipControlTemplate, {
    root: true,
    closable: () => this.closable(),
    actionable: () => this.actionable(),
  });
  protected readonly i18n = inject(I18n).translations;

  /**
   * Set whether the chip can be closed (removed).
   * @default false
   */
  public readonly closable = input(false, { transform: booleanAttribute });
  /**
   * Set whether the chip is actionable (can be clicked).
   * @default false
   */
  public readonly actionable = input(false, { transform: booleanAttribute });
  /**
   * Set a custom icon for the close button.
   */
  public readonly iconClose = input<IconType>();
  /**
   * Emitted when the chip is closed (removed).
   */
  public readonly closed = output<Event>();
  /**
   * Emitted when the chip is clicked.
   */
  public readonly clicked = output<Event>();
}
