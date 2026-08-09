import { booleanAttribute, Component, input } from '@angular/core';
import { provideSelf, ValueControlBase, JigPt } from '@awdlab/jig/base';
import { JigIcon } from '@awdlab/jig/icon';
import { toggleButtonControlTemplate } from '@awdlab/jig-themes/templates/toggle-button';

import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'jig-toggle-button',
  providers: [provideSelf(JigToggleButton)],

  imports: [JigPt, JigIcon],
  templateUrl: './toggle-button.html',
})
export class JigToggleButton extends ValueControlBase<'toggleButton', boolean> {
  protected readonly theme = this.injectThemeTemplate(toggleButtonControlTemplate, {
    root: true,
    active: () => this.value(),
    invalid: () => this.invalidState(),
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
  public readonly fixedWidth = input(false, { transform: booleanAttribute });

  public toggle() {
    if (this.disabled() || this.readonly()) {
      return;
    }
    this.value.update(v => !v);
  }
}
