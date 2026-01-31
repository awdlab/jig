import {
  afterRenderEffect,
  Component,
  computed,
  contentChild,
  input,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { domEventHandler } from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnInput } from '@ngneers/controls/input';
import { inputMaskControlTemplate } from '@ngneers/controls-themes/templates/input-mask';

import { MaskHelper } from './helper';
import { InputMaskCfg } from './types';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-input-mask',
  templateUrl: './input-mask.html',
  imports: [NgnPt],
  providers: [provideSelf(NgnInputMask)],
})
export class NgnInputMask extends NgnBase<'inputMask'> {
  protected readonly theme = this.injectThemeTemplate(inputMaskControlTemplate);
  /**
   * The mask to apply to the input. Can be a predefined mask key, a custom mask configuration, or a string pattern.
   */
  public readonly mask = input<'time' | InputMaskCfg | string | null>(null);

  private readonly _ngnInput = contentChild.required<NgnInput>(NgnInput);
  private readonly _inputElement = computed(
    () => this._ngnInput().element.nativeElement as HTMLInputElement
  );

  constructor() {
    super();
    domEventHandler(this._inputElement, 'keydown', event => this.onKeyDown(event));
    domEventHandler(this._inputElement, 'beforeinput', event => this.onBeforeInput(event));

    afterRenderEffect(() => {
      if (this._ngnInput().value() !== this.currentInputValue()) {
        this.currentInputValue.set(this._ngnInput().value() ?? '');
      }
    });
  }

  private readonly _maskHelper = new MaskHelper({
    updateValue: (e, v, i) => this._updateValue(e, v, i),
  });

  protected onInput(event: Event) {
    // Update the current input value
    this.currentInputValue.set((event.target as HTMLInputElement).value);
  }

  protected readonly currentInputValue = signal<string>('');

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
