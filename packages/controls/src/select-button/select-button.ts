import { Component, input } from '@angular/core';
import { AwdPt, provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { AwdButtonGroup } from '@awdlab/jig/button-group';
import { AwdToggleButton } from '@awdlab/jig/toggle-button';
import { maybeCallback } from '@awdlab/jig/utils';
import { selectButtonControlTemplate } from '@awdlab/jig-themes/templates/select-button';

import type { JigActionItemFlat, JigItem } from '@awdlab/jig/api';

/**
 * @category control
 */
@Component({
  selector: 'jig-select-button',
  templateUrl: './select-button.html',
  imports: [AwdPt, AwdButtonGroup, AwdToggleButton],
  providers: [provideSelf(AwdSelectButton)],
})
export class AwdSelectButton<V> extends ValueControlBase<'selectButton', V> {
  protected readonly theme = this.injectThemeTemplate(selectButtonControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
  });

  /**
   * Defines the orientation of the select buttons.
   * - 'auto' - The orientation is determined based on the available space.
   * - 'horizontal' - The buttons are arranged horizontally. (Default for `auto` if enough space)
   * - 'vertical' - The buttons are arranged vertically.
   * @default 'auto'
   */
  public readonly orientation = input<'auto' | 'horizontal' | 'vertical'>('auto');
  /**
   * Defines the options for the select button.
   */
  public readonly options = input.required<readonly JigActionItemFlat<JigItem<unknown, V>>[]>();
  /**
   * When `true`, allows unselecting the currently selected option by clicking on it again.
   * If `false`, clicking on the selected option will not change the selection.
   * @default false
   */
  public readonly allowUnselect = input<boolean>(false);

  protected readonly maybeCallback = maybeCallback;

  protected valueChange(value: V) {
    if (this.value() === value && !this.allowUnselect()) {
      return;
    }
    this.value.set(value);
    this.markTouched();
  }
}
