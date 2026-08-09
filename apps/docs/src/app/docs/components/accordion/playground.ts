import { Component, viewChild, viewChildren } from '@angular/core';
import { AwdAccordion, AwdAccordionPanel } from '@awdlab/jig/accordion';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-accordion-playground',
  imports: [AwdAccordion, AwdAccordionPanel, AwdDocsPlayground],
  template: `
    <jig-docs-playground
      [controls]="[
        { componentName: 'AwdAccordion', component: componentAccordion() },
        { componentName: 'AwdAccordionPanel', component: componentPanels() },
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
export class AwdDocsAccordionPlayground {
  protected readonly componentAccordion = viewChild.required('ref', { read: AwdAccordion });
  protected readonly componentPanels = viewChildren('ref2', { read: AwdAccordionPanel });
}
