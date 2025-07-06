import { Component, HostBinding, input, model } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { BaseDirective } from '@ngneers/controls/base';
import { generateElementId } from '@ngneers/controls/utils';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

import { SplitterPanelSize, SplitterPanelSizeLimit } from '../types';

@Component({
  selector: 'ngn-splitter-panel',
  templateUrl: './splitter-panel.html',
})
export class SplitterPanel extends BaseDirective {
  protected readonly theme = injectThemeTemplate(splitterControlTemplate);
  private readonly _fallbackAreaName = generateElementId();

  public readonly name = input<string | null>();
  public readonly size = model<SplitterPanelSize>('1fr');
  public readonly minSize = model<SplitterPanelSizeLimit>('0px');
  public readonly maxSize = model<SplitterPanelSizeLimit>('100%');

  @HostBinding('class')
  protected readonly hostClass: string = this.theme.class('panel');

  @HostBinding('style.grid-area')
  protected get gridArea(): string {
    return this.name() ?? this._fallbackAreaName;
  }
}
