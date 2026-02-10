import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NgnPt, provideSelf, ValueControlBase } from '@ngneers/controls/base';
import { NgnButtonGroup } from '@ngneers/controls/button-group';
import { NgnToggleButton } from '@ngneers/controls/toggle-button';
import { maybeCallback } from '@ngneers/controls/utils';
import { selectButtonControlTemplate } from '@ngneers/controls-themes/templates/select-button';

import type { NgnActionItemFlat, NgnItem } from '@ngneers/controls/api';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-select-button',
  templateUrl: './select-button.html',
  imports: [NgnPt, NgnButtonGroup, NgnToggleButton],
  providers: [provideSelf(NgnSelectButton)],
})
export class NgnSelectButton<V> extends ValueControlBase<'selectButton', V> {
  protected readonly theme = this.injectThemeTemplate(selectButtonControlTemplate, {
    root: true,
    invalid: () => this.invalid(),
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
  public readonly options = input.required<readonly NgnActionItemFlat<NgnItem<unknown, V>>[]>();
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
  }
}
