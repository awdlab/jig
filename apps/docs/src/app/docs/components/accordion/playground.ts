import { Component, viewChild, viewChildren } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@ngneers/controls/accordion';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  imports: [NgnAccordion, NgnAccordionPanel, NgnDocsPlayground],
  template: `
    <ngn-docs-playground
      [controls]="[
        { componentName: 'NgnAccordion', component: componentAccordion() },
        { componentName: 'NgnAccordionPanel', component: componentPanels() },
      ]"
    >
      <ngn-accordion #ref class="flex-1">
        <ngn-accordion-panel #ref2 [header]="'Panel 1'">
          <ng-template #content>Content 1</ng-template>
        </ngn-accordion-panel>
        <ngn-accordion-panel #ref2 [header]="'Panel 2'">
          <ng-template #content>Content 2</ng-template>
        </ngn-accordion-panel>
        <ngn-accordion-panel #ref2 [header]="'Panel 3'">
          <ng-template #content>Content 3</ng-template>
        </ngn-accordion-panel>
      </ngn-accordion>
    </ngn-docs-playground>
  `,
})
export class NgnDocsAccordionPlayground {
  protected readonly componentAccordion = viewChild.required('ref', { read: NgnAccordion });
  protected readonly componentPanels = viewChildren('ref2', { read: NgnAccordionPanel });
}
