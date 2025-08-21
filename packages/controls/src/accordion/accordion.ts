import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';
import { IconType } from '@ngneers/controls/custom-types';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

import { ACCORDION_CONTROL, AccordionControl } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-accordion',
  imports: [],
  templateUrl: './accordion.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'theme.class()',
  },
  providers: [
    {
      provide: ACCORDION_CONTROL,
      deps: [NgnAccordion],
      useFactory: (accordion: NgnAccordion) =>
        <AccordionControl>{
          expandedPanels: accordion.expandedPanels,
          togglePanel: accordion.togglePanel.bind(accordion),
          lazy: accordion.lazy,
          cache: accordion.cache,
          iconExpanded: accordion.iconExpanded,
          iconCollapsed: accordion.iconCollapsed,
        },
    },
  ],
})
export class NgnAccordion extends NgnBase {
  protected readonly theme = injectThemeTemplate(accordionControlTemplate);
  public readonly cache = input(false);
  public readonly lazy = input(false);

  /**
   * Whether multiple panels can be expanded at once.
   */
  public readonly iconExpanded = input<IconType>();
  public readonly iconCollapsed = input<IconType>();
  public readonly multiple = input<boolean>(false);
  public readonly expandedPanels = model<string[]>([]);

  public togglePanel(panelId: string) {
    if (!this.multiple()) {
      if (this.expandedPanels().includes(panelId)) {
        this.expandedPanels.set([]);
        return;
      }
      this.expandedPanels.set([panelId]);
      return;
    }
    if (this.expandedPanels().includes(panelId)) {
      this.expandedPanels.update(panels => panels.filter(id => id !== panelId));
    } else {
      this.expandedPanels.update(panels => [...panels, panelId]);
    }
  }

  constructor() {
    super();
  }
}
