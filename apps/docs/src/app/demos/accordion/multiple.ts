import { Component } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@ngneers/controls/accordion';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnAccordion, NgnAccordionPanel],
  template: `<ngn-accordion [multiple]="true">
    <ngn-accordion-panel [header]="'Panel 1'">
      <ng-template #content>
        <span>{{ loremIpsum1 }}</span>
      </ng-template>
    </ngn-accordion-panel>
    <ngn-accordion-panel [header]="'Panel 2'">
      <ng-template #content>
        <span>{{ loremIpsum2 }}</span>
      </ng-template>
    </ngn-accordion-panel>
    <ngn-accordion-panel [header]="'Panel 3'">
      <ng-template #content>
        <span>{{ loremIpsum3 }}</span>
      </ng-template>
    </ngn-accordion-panel>
  </ngn-accordion>`,
})
export class Demo_Accordion_Multiple {
  protected readonly loremIpsum1 = exampleData.loremIpsum.full.split(' ').slice(0, 100).join(' ');
  protected readonly loremIpsum2 = exampleData.loremIpsum.full.split(' ').slice(100, 200).join(' ');
  protected readonly loremIpsum3 = exampleData.loremIpsum.full.split(' ').slice(200, 300).join(' ');
}
