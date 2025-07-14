import { AfterViewInit, Directive, input, signal } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { NgnBase } from '@ngneers/controls/base';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

@Directive({
  selector: 'input[ngnInput]',
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

  public ngAfterViewInit() {
    this.hasParentInputfield.set(!!this.element.nativeElement.closest('ngn-input-field'));
  }
}
