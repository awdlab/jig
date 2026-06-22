import { Component, input } from '@angular/core';
import { provideSelf, ValueControlBase, NgnPt } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { toggleButtonControlTemplate } from '@ngneers/controls-themes/templates/toggle-button';

import type { IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-toggle-button',
  providers: [provideSelf(NgnToggleButton)],

  imports: [NgnPt, NgnIcon],
  templateUrl: './toggle-button.html',
})
export class NgnToggleButton extends ValueControlBase<'toggleButton', boolean> {
  protected readonly theme = this.injectThemeTemplate(toggleButtonControlTemplate, {
    root: true,
    active: () => this.value(),
    invalid: () => this.invalid(),
  });

  /**
   * Optional labels for on and off states.
   * If not provided, the {@link label} input will be used.
   */
  public readonly labelOn = input<string>();
  /**
   * Optional labels for on and off states.
   * If not provided, the {@link label} input will be used.
   */
  public readonly labelOff = input<string>();
  /**
   * Optional icon for the button. Can be used instead of the label or in combination with it.
   * If {@link iconOn} and {@link iconOff} are provided, they will take precedence over this input for their respective states.
   */
  public readonly icon = input<IconType>();
  /**
   * Optional icons for on and off states.
   * If not provided, the {@link icon} input will be used.
   */
  public readonly iconOn = input<IconType>();
  /**
   * Optional icons for on and off states.
   * If not provided, the {@link icon} input will be used.
   */
  public readonly iconOff = input<IconType>();
  /**
   * If true, the button will always have the width of the longest possible content.
   * @default false
   */
  public readonly fixedWidth = input<boolean>(false);

  public toggle() {
    if (this.disabled() || this.readonly()) {
      return;
    }
    this.value.update(v => !v);
  }
}
