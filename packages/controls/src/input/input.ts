import {
  type AfterViewInit,
  booleanAttribute,
  Directive,
  effect,
  input,
  model,
  runInInjectionContext,
} from '@angular/core';
import { domEventSignal } from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

/**
 * @category control
 */
@Directive({
  selector: 'input[ngnInput], textarea[ngnInput]',
  providers: [provideSelf(NgnInput)],
  exportAs: 'ngnInput',
})
export class NgnInput extends NgnBase<'input'> implements AfterViewInit {
  public override readonly isFieldControl = true;
  protected readonly theme = this.injectThemeTemplate(inputControlTemplate, {
    root: true,
    invalid: () => this.invalid(),
    empty: () => !this.value(),
  });
  /**
   * Explicitly apply invalid state styling
   * @default false
   */
  public readonly invalid = input(false, { transform: booleanAttribute });

  /**
   * The current value of the input, kept in sync with the native element in both directions.
   * @default ''
   */
  public readonly value = model<string | null>('');

  private readonly _input = this.element.nativeElement as HTMLInputElement;

  public ngAfterViewInit() {
    const changeEvent = domEventSignal(
      this.element.nativeElement as HTMLInputElement,
      'change',
      this.injector
    );
    const inputEvent = domEventSignal(
      this.element.nativeElement as HTMLInputElement,
      'input',
      this.injector
    );

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const _changeEvent = changeEvent();
        const _inputEvent = inputEvent();
        if (!_changeEvent && !_inputEvent) {
          return;
        }
        const val = this._input.value;
        this.value.set(val ?? '');
      });
    });
  }

  constructor() {
    super();
    effect(() => {
      if (this._input.value !== this.value()) {
        this._input.value = this.value() || '';
      }
    });
  }
}
