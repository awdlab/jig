import { booleanAttribute, ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { IconType } from '@ngneers/controls-custom-types';
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
  providers: [
    provideSelf(NgnAccordion),
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
export class NgnAccordion extends NgnBase<'accordion'> {
  protected readonly theme = this.injectThemeTemplate(accordionControlTemplate, 'root');
  public readonly cache = input(false, { transform: booleanAttribute });
  public readonly lazy = input(false, { transform: booleanAttribute });

  /**
   * Whether multiple panels can be expanded at once.
   */
  public readonly iconExpanded = input<IconType>();
  public readonly iconCollapsed = input<IconType>();
  public readonly multiple = input(false, { transform: booleanAttribute });
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
