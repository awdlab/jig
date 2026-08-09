import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, inject, input, output } from '@angular/core';
import { JigBase, provideSelf, JigPt } from '@awdlab/jig/base';
import { I18n } from '@awdlab/jig/i18n';
import { JigIcon } from '@awdlab/jig/icon';
import { chipControlTemplate } from '@awdlab/jig-themes/templates/chip';

import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'jig-chip',
  templateUrl: './chip.html',
  imports: [JigPt, JigIcon, NgTemplateOutlet],
  providers: [provideSelf(JigChip)],
})
export class JigChip extends JigBase<'chip'> {
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
