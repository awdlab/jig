import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import {
  injectThemeTemplate,
  ValueControlBase,
  valueControlBaseProvider,
} from '@ngneers/controls/api';
import { Inputfield } from '@ngneers/controls/input-field';
import { textFieldControlTemplate } from '@ngneers/controls-themes/templates/text-field';

import { MaskHelper } from './features/mask/helper';
import { TextFieldMaskCfg } from './features/mask/types';

@Component({
  selector: 'ngn-text-field',
  templateUrl: './text-field.html',
  imports: [NgClass, Inputfield],
  providers: [valueControlBaseProvider(TextField)],
})
export class TextField extends ValueControlBase<string> {
  private readonly _maskHelper = new MaskHelper({
    updateValue: (e, v, i) => this._updateValue(e, v, i),
  });

  protected readonly theme = injectThemeTemplate(textFieldControlTemplate);
  protected onInput(event: Event) {
    // Update the current input value
    this.currentInputValue.set((event.target as HTMLInputElement).value);
    this.onChange((event.target as HTMLInputElement).value);
  }

  protected readonly currentInputValue = signal<string>('');

  public readonly mask = input<'time' | TextFieldMaskCfg | string | null>(null);
  private readonly _mask = computed(() => this._maskHelper.ensureMask(this.mask()));

  protected readonly maskWatermark = computed(() => {
    const mask = this._mask();
    if (!mask) return null;
    const maskString = mask
      .map(entry => {
        if (typeof entry === 'string') return entry;
        return entry.placeholder;
      })
      .join('');
    return maskString.substring(this.currentInputValue().length, maskString.length);
  });

  protected onKeyDown(event: KeyboardEvent) {
    const mask = this._mask();
    if (!mask) return;
    this._maskHelper.handleKeyDown(event, mask);
  }

  protected onTextInput(event: Event) {
    const mask = this._mask();
    if (!mask) return;
    this._maskHelper.handleInput(event as InputEvent, mask);
  }

  private _updateValue(el: HTMLInputElement, newValue: string, cursorPosition: number): void {
    el.value = newValue;
    this.currentInputValue.set(newValue);
    this.onChange(newValue);
    setTimeout(() => {
      // Ensure the cursor position is set after the value update for android compatibility
      el.setSelectionRange(cursorPosition, cursorPosition);
    });
  }
}
