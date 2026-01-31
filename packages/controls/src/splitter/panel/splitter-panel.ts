import { Component, computed, input, model, ChangeDetectionStrategy } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

import { SplitterPanelSize, SplitterPanelSizeLimit } from '../types';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-splitter-panel',
  templateUrl: './splitter-panel.html',
  providers: [provideSelf(NgnSplitterPanel)],
  host: {
    role: 'region',
    '[style.grid-area]': 'gridArea()',
    '[aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
  },
})
export class NgnSplitterPanel extends NgnBase<'splitter'> {
  protected readonly theme = this.injectThemeTemplate(splitterControlTemplate, 'panel');
  private readonly _fallbackAreaName = generateElementId();

  public readonly name = input<string | null>();
  public readonly size = model<SplitterPanelSize>('1fr');
  public readonly minSize = model<SplitterPanelSizeLimit>('0px');
  public readonly maxSize = model<SplitterPanelSizeLimit>('100%');

  public readonly ariaLabel = input<string | null>();
  public readonly ariaLabelledBy = input<string | null>();

  protected readonly gridArea = computed(() => this.name() ?? this._fallbackAreaName);
}
