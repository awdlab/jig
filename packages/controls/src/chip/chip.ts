import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';
import { ChipKindType, IconType } from '@ngneers/controls/custom-types';
import { NgnIcon } from '@ngneers/controls/icon';
import { chipControlTemplate } from '@ngneers/controls-themes/templates/chip';

/**
 * @category control
 */
@Component({
  selector: 'ngn-chip',
  templateUrl: './chip.html',
  imports: [NgClass, NgnIcon, NgTemplateOutlet],
  host: {
    '[class]': 'hostClass()',
  },
})
export class NgnChip extends NgnBase {
  protected readonly theme = injectThemeTemplate(chipControlTemplate);

  /**
   * Set the kind of the chip (for styling purposes).
   */
  public readonly kind = input<ChipKindType | null | undefined>();
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
