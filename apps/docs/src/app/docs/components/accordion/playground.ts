import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@ngneers/controls/accordion';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnAccordion, NgnAccordionPanel, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnAccordion" [component]="component()">
      <ngn-accordion #ref>
        <ngn-accordion-panel [header]="'Panel 1'">
          <ng-template #content>Content 1</ng-template>
        </ngn-accordion-panel>
        <ngn-accordion-panel [header]="'Panel 2'">
          <ng-template #content>Content 2</ng-template>
        </ngn-accordion-panel>
        <ngn-accordion-panel [header]="'Panel 3'">
          <ng-template #content>Content 3</ng-template>
        </ngn-accordion-panel>
      </ngn-accordion>
    </ngn-docs-playground>
  `,
})
export class NgnDocsAccordionPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnAccordion });
}
