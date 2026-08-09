import { booleanAttribute, Component, input, model } from '@angular/core';
import { AwdBase, provideSelf } from '@awdlab/jig/base';
import { accordionControlTemplate } from '@awdlab/jig-themes/templates/accordion';

import { ACCORDION_CONTROL, type AccordionControl } from './types';

import type { IconType } from '@awdlab/jig-custom-types';

/**
 * @category control
 */
@Component({
  selector: 'jig-accordion',
  imports: [],
  templateUrl: './accordion.html',

  providers: [
    provideSelf(AwdAccordion),
    {
      provide: ACCORDION_CONTROL,
      deps: [AwdAccordion],
      useFactory: (accordion: AwdAccordion) =>
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
export class AwdAccordion extends AwdBase<'accordion'> {
  protected readonly theme = this.injectThemeTemplate(accordionControlTemplate, 'root');
  /**
   * Whether to keep lazily-loaded panel content in the DOM after the panel closes.
   * Applies as the default for every panel; individual panels can override it.
   * @default false
   */
  public readonly cache = input(false, { transform: booleanAttribute });
  /**
   * Whether to defer rendering each panel's content until it is first expanded.
   * Applies as the default for every panel; individual panels can override it.
   * @default false
   */
  public readonly lazy = input(false, { transform: booleanAttribute });

  /**
   * Icon shown on a panel header when the panel is expanded.
   */
  public readonly iconExpanded = input<IconType>();
  /**
   * Icon shown on a panel header when the panel is collapsed.
   */
  public readonly iconCollapsed = input<IconType>();
  /**
   * Whether multiple panels can be expanded at once. When `false`, expanding a
   * panel collapses any other open panel.
   * @default false
   */
  public readonly multiple = input(false, { transform: booleanAttribute });
  /**
   * The ids of the currently expanded panels. Two-way bindable to control or
   * observe which panels are open.
   * @default []
   */
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
