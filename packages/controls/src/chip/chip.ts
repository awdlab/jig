import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { IconType } from '@ngneers/controls-custom-types';
import { chipControlTemplate } from '@ngneers/controls-themes/templates/chip';

/**
 * @category control
 */
@Component({
  selector: 'ngn-chip',
  templateUrl: './chip.html',
  imports: [NgClass, NgnIcon, NgTemplateOutlet],
  providers: [provideSelf(NgnChip)],
  host: {
    '[class]': 'hostClass()',
  },
})
export class NgnChip extends NgnBase<'chip'> {
  protected readonly theme = this.injectThemeTemplate(chipControlTemplate);

  /**
   * Set whether the chip can be closed (removed).
   * @default false
   */
  public readonly closable = input<boolean>(false);
  /**
   * Set whether the chip is actionable (can be clicked).
   * @default false
   */
  public readonly actionable = input<boolean>(false);
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

  protected readonly hostClass = computed(() =>
    this.theme.classes({
      '': true,
      [`kind-${this.kind()}`]: !!this.kind(),
      closable: this.closable(),
      actionable: this.actionable(),
    })
  );
}
