import { Component, HostBinding, model } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { BaseDirective } from '@ngneers/controls/base';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

@Component({
  selector: 'ngn-splitter-panel',
  templateUrl: './splitter-panel.html',
})
export class SplitterPanel extends BaseDirective {
  protected readonly theme = injectThemeTemplate(splitterControlTemplate);

  public readonly size = model<`${number}${'px' | 'fr'}`>('1fr');

  @HostBinding('class')
  protected readonly hostClass: string = this.theme.class('panel');
}
