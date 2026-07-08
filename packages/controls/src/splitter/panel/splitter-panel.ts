import { Component, computed, input, model } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

import type { SplitterPanelSize, SplitterPanelSizeLimit } from '../types';

/**
 * @category control
 */
@Component({
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

  /**
   * The name of the panel, used to identify it in the persisted splitter state and in {@link NgnSplitter.panelOrder}.
   * If nullish, a generated fallback name is used.
   */
  public readonly name = input<string | null>();
  /**
   * The size of the panel along the splitter's layout axis. Accepts `fr` or `px` units.
   * @default 1fr
   */
  public readonly size = model<SplitterPanelSize>('1fr');
  /**
   * The minimum size the panel can be resized to.
   * @default 0px
   */
  public readonly minSize = model<SplitterPanelSizeLimit>('0px');
  /**
   * The maximum size the panel can be resized to.
   * @default 100%
   */
  public readonly maxSize = model<SplitterPanelSizeLimit>('100%');

  /**
   * Sets the `aria-label` for the panel region.
   */
  public readonly ariaLabel = input<string | null>();
  /**
   * Sets the `aria-labelledby` for the panel region.
   */
  public readonly ariaLabelledBy = input<string | null>();

  protected readonly gridArea = computed(() => this.name() ?? this._fallbackAreaName);
}
