import { Directive, input } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { BaseDirective } from '@ngneers/controls/base';
import { ButtonKindType } from '@ngneers/controls/custom-types';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

@Directive()
export abstract class ButtonBase extends BaseDirective {
  protected readonly theme = injectThemeTemplate(buttonControlTemplate);

  public readonly kind = input<ButtonKindType | null>();
}
