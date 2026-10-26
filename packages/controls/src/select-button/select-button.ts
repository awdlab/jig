import { booleanAttribute, Component, effect, input, viewChild, viewChildren } from '@angular/core';
import { JigPt, provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { JigButtonGroup } from '@awdlab/jig/button-group';
import { JigToggleButton } from '@awdlab/jig/toggle-button';
import { maybeCallback } from '@awdlab/jig/utils';
import { selectButtonControlTemplate } from '@awdlab/jig-themes/templates/select-button';

import type { JigActionItemFlat, JigItem } from '@awdlab/jig/api';

/**
 * @category control
 */
@Component({
  selector: 'jig-select-button',
  templateUrl: './select-button.html',
  imports: [JigPt, JigButtonGroup, JigToggleButton],
  providers: [provideSelf(JigSelectButton)],
})
export class JigSelectButton<V> extends ValueControlBase<'selectButton', V> {
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
  public readonly allowUnselect = input(false, { transform: booleanAttribute });

  protected readonly maybeCallback = maybeCallback;

  private readonly _group = viewChild.required(JigButtonGroup);
  private readonly _toggles = viewChildren(JigToggleButton);

  constructor() {
    super();
    // Keep the tab stop on the selected option so Tab-in lands on it, as in a radio group.
    effect(() => {
      const index = this.options().findIndex(option => option.value === this.value());
      const toggle = this._toggles()[index];
      if (toggle) {
        this._group().syncTabStop(toggle.element.nativeElement);
      }
    });
  }

  protected valueChange(value: V) {
    if (this.value() === value && !this.allowUnselect()) {
      return;
    }
    this.value.set(value);
    this.markTouched();
  }
}
