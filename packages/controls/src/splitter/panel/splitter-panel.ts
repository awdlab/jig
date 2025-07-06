import { Component, HostBinding, input, model } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { BaseDirective } from '@ngneers/controls/base';
import { generateElementId } from '@ngneers/controls/utils';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

@Component({
  selector: 'ngn-splitter-panel',
  templateUrl: './splitter-panel.html',
})
export class SplitterPanel extends BaseDirective {
  protected readonly theme = injectThemeTemplate(splitterControlTemplate);
  private readonly _fallbackAreaName = generateElementId();

  public readonly name = input<string | null>();
  public readonly size = model<`${number}${'px' | 'fr'}`>('1fr');

  @HostBinding('class')
  protected readonly hostClass: string = this.theme.class('panel');

  @HostBinding('style.grid-area')
  protected get gridArea(): string {
    return this.name() ?? this._fallbackAreaName;
  }
}
