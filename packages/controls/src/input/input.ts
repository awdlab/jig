import {
  AfterViewInit,
  Directive,
  effect,
  input,
  model,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';
import { fromEventSignal } from '@ngneers/controls/utils-ng';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

/**
 * @category control
 */
@Directive({
  selector: 'input[ngnInput], textarea[ngnInput]',
  host: {
    '[class]':
      'theme.class() + (invalid() ? ` ${theme.class("invalid")}` : "") + (hasParentInputfield() ? "" : ` ${inputFieldTheme.class()}`)',
  },
})
export class NgnInput extends NgnBase implements AfterViewInit {
  protected readonly hasParentInputfield = signal(false);

  protected readonly theme = injectThemeTemplate(inputControlTemplate);
  protected readonly inputFieldTheme = injectThemeTemplate(inputFieldControlTemplate);
  public readonly invalid = input<boolean>(false);

  public readonly value = model<string | null>('');

  public ngAfterViewInit() {
    this.hasParentInputfield.set(!!this.element.nativeElement.closest('ngn-input-field'));
    const changeEvent = fromEventSignal(
      this.element.nativeElement as HTMLInputElement,
      'change',
      this.injector
    );
    const inputEvent = fromEventSignal(
      this.element.nativeElement as HTMLInputElement,
      'input',
      this.injector
    );

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const _changeEvent = changeEvent();
        const _inputEvent = inputEvent();
        const val = (this.element.nativeElement as HTMLInputElement).value;
        this.value.set(val || '');
      });
    });
  }

  constructor() {
    super();
    effect(() => {
      (this.element.nativeElement as HTMLInputElement).value = this.value() || '';
    });
  }
}
