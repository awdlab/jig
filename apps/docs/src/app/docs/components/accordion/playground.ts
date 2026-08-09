import { Component, viewChild, viewChildren } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@awdlab/jig/accordion';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-accordion-playground',
  imports: [NgnAccordion, NgnAccordionPanel, NgnDocsPlayground],
  template: `
    <awd-docs-playground
      [controls]="[
        { componentName: 'NgnAccordion', component: componentAccordion() },
        { componentName: 'NgnAccordionPanel', component: componentPanels() },
      ]"
    >
      <awd-accordion #ref class="flex-1">
        <awd-accordion-panel #ref2 [header]="'Panel 1'">
          <ng-template #content>Content 1</ng-template>
        </awd-accordion-panel>
        <awd-accordion-panel #ref2 [header]="'Panel 2'">
          <ng-template #content>Content 2</ng-template>
        </awd-accordion-panel>
        <awd-accordion-panel #ref2 [header]="'Panel 3'">
          <ng-template #content>Content 3</ng-template>
        </awd-accordion-panel>
      </awd-accordion>
    </awd-docs-playground>
  `,
})
export class NgnDocsAccordionPlayground {
  protected readonly componentAccordion = viewChild.required('ref', { read: NgnAccordion });
  protected readonly componentPanels = viewChildren('ref2', { read: NgnAccordionPanel });
}
