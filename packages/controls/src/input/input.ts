import { Directive, input } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { BaseDirective } from '@ngneers/controls/base';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

@Directive({
  selector: 'input[ngnInput]',
  host: {
    '[class]': 'theme.class() + (invalid() ? theme.class("invalid") : "")',
  },
})
export class NgnInput extends BaseDirective {
  protected readonly theme = injectThemeTemplate(inputControlTemplate);
  public readonly invalid = input<boolean>(false);
}
