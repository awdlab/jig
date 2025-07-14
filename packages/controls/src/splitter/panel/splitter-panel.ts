import { Component, computed, input, model } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { NgnBase } from '@ngneers/controls/base';
import { generateElementId } from '@ngneers/controls/utils';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

import { SplitterPanelSize, SplitterPanelSizeLimit } from '../types';

@Component({
  selector: 'ngn-splitter-panel',
  templateUrl: './splitter-panel.html',
  host: {
    role: 'region',
    '[class]': `theme.class('panel')`,
    '[style.grid-area]': 'gridArea()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
  },
})
export class NgnSplitterPanel extends NgnBase {
  protected readonly theme = injectThemeTemplate(splitterControlTemplate);
  private readonly _fallbackAreaName = generateElementId();

  public readonly name = input<string | null>();
  public readonly size = model<SplitterPanelSize>('1fr');
  public readonly minSize = model<SplitterPanelSizeLimit>('0px');
  public readonly maxSize = model<SplitterPanelSizeLimit>('100%');

  public readonly ariaLabel = input<string | null>();
  public readonly ariaLabelledBy = input<string | null>();

  protected readonly gridArea = computed(() => this.name() ?? this._fallbackAreaName);
}
