import { NgClass } from '@angular/common';
import { afterRenderEffect, Component, computed, contentChild, input, signal } from '@angular/core';
import { domEventObservable, injectThemeTemplate } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { inputMaskControlTemplate } from '@ngneers/controls-themes/templates/input-mask';

import { MaskHelper } from './helper';
import { TextFieldMaskCfg } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-input-mask',
  templateUrl: './input-mask.html',
  imports: [NgClass, NgnInputField],
})
export class NgnInputMask extends NgnBase {
  protected readonly theme = injectThemeTemplate(inputMaskControlTemplate);
  public readonly label = input<string | null>(null);
  public readonly inputId = input<string | null>(null);

  private readonly _ngnInput = contentChild.required<NgnInput>(NgnInput);
  private readonly _inputElement = computed(
    () => this._ngnInput().element.nativeElement as HTMLInputElement
  );

  private readonly _keydownEvent = domEventObservable(this._inputElement, 'keydown');
  private readonly _beforeInputEvent = domEventObservable(this._inputElement, 'beforeinput');

  constructor() {
    super();
    this._keydownEvent.subscribe(e => this.onKeyDown(e));
    this._beforeInputEvent.subscribe(e => this.onBeforeInput(e));
    afterRenderEffect(() => {
      if (this._ngnInput().value() !== this.currentInputValue()) {
        this.currentInputValue.set(this._ngnInput().value() ?? '');
      }
    });
  }

  private readonly _maskHelper = new MaskHelper({
    updateValue: (e, v, i) => this._updateValue(e, v, i),
  });

  public readonly preventOpen = input<boolean | 'onDesktop'>('onDesktop');
  protected onInput(event: Event) {
    // Update the current input value
    this.currentInputValue.set((event.target as HTMLInputElement).value);
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

  protected onBeforeInput(event: Event) {
    const mask = this._mask();
    if (!mask) return;
    this._maskHelper.handleBeforeInput(event as InputEvent, mask);
  }

  private _updateValue(el: HTMLInputElement, newValue: string, cursorPosition: number): void {
    el.value = newValue;
    this.currentInputValue.set(newValue);
    setTimeout(() => {
      // Ensure the cursor position is set after the value update for android compatibility
      el.setSelectionRange(cursorPosition, cursorPosition);
    });
    this._inputElement().dispatchEvent(new Event('input', { bubbles: true }));
  }
}
