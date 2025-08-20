import { Component } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@ngneers/controls/accordion';

@Component({
  imports: [NgnAccordion, NgnAccordionPanel],
  template: `<ngn-accordion>
    <ngn-accordion-panel [header]="'Panel 1'">
      <ng-template #content> Content for Panel 1 </ng-template>
    </ngn-accordion-panel>
    <ngn-accordion-panel [header]="'Panel 2'">
      <ng-template #content> Content for Panel 2 </ng-template>
    </ngn-accordion-panel>
  </ngn-accordion>`,
})
export class Demo_Accordion_Base {}
