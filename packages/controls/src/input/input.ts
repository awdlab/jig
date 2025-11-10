import {
  AfterViewInit,
  Directive,
  effect,
  input,
  model,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { domEventSignal } from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

/**
 * @category control
 */
@Directive({
  selector: 'input[ngnInput], textarea[ngnInput]',
  host: {
    '[class]':
      'theme.classes({"": true, invalid: invalid(), empty: !value()}) + (hasParentInputfield() ? "" : ` ${inputFieldTheme.class()}`)',
  },
  providers: [provideSelf(NgnInput)],
})
export class NgnInput extends NgnBase<'input'> implements AfterViewInit {
  protected readonly hasParentInputfield = signal(false);

  protected readonly theme = this.injectThemeTemplate(inputControlTemplate);
  protected readonly inputFieldTheme = this.injectThemeTemplate(inputFieldControlTemplate, true);
  /**
   * Explicitly apply invalid state styling
   * @default false
   */
  public readonly invalid = input<boolean>(false);

  public readonly value = model<string | null>('');

  private readonly _input = this.element.nativeElement as HTMLInputElement;

  public ngAfterViewInit() {
    this.hasParentInputfield.set(!!this.element.nativeElement.closest('ngn-input-field'));
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
