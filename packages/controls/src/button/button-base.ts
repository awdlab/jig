import { Directive } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { BaseDirective } from '@ngneers/controls/base';
import { buttonTemplate } from '@ngneers/controls-themes/templates/button';

@Directive()
export abstract class ButtonBase extends BaseDirective {
  protected readonly theme = injectThemeTemplate(buttonTemplate);
}
