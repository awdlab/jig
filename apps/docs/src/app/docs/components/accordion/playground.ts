import { Component, viewChild, viewChildren } from '@angular/core';
import { JigAccordion, JigAccordionPanel } from '@awdlab/jig/accordion';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-accordion-playground',
  imports: [JigAccordion, JigAccordionPanel, JigDocsPlayground],
  template: `
    <jig-docs-playground
      [controls]="[
        { componentName: 'JigAccordion', component: componentAccordion() },
        { componentName: 'JigAccordionPanel', component: componentPanels() },
      ]"
    >
      <jig-accordion #ref class="flex-1">
        <jig-accordion-panel #ref2 [header]="'Panel 1'">
          <ng-template #content>Content 1</ng-template>
        </jig-accordion-panel>
        <jig-accordion-panel #ref2 [header]="'Panel 2'">
          <ng-template #content>Content 2</ng-template>
        </jig-accordion-panel>
        <jig-accordion-panel #ref2 [header]="'Panel 3'">
          <ng-template #content>Content 3</ng-template>
        </jig-accordion-panel>
      </jig-accordion>
    </jig-docs-playground>
  `,
})
export class JigDocsAccordionPlayground {
  protected readonly componentAccordion = viewChild.required('ref', { read: JigAccordion });
  protected readonly componentPanels = viewChildren('ref2', { read: JigAccordionPanel });
}
