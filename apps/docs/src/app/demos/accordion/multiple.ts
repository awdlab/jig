import { Component } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@awdlab/jig/accordion';

import { exampleData } from '../../helper/data';

@Component({
  selector: 'awd-demo-accordion-multiple',
  imports: [NgnAccordion, NgnAccordionPanel],
  template: `<awd-accordion [multiple]="true">
    <awd-accordion-panel [header]="'Panel 1'">
      <ng-template #content> {{ loremIpsum1 }} </ng-template>
    </awd-accordion-panel>
    <awd-accordion-panel [header]="'Panel 2'">
      <ng-template #content> {{ loremIpsum2 }} </ng-template>
    </awd-accordion-panel>
    <awd-accordion-panel [header]="'Panel 3'">
      <ng-template #content> {{ loremIpsum3 }} </ng-template>
    </awd-accordion-panel>
  </awd-accordion>`,
})
export class Demo_Accordion_Multiple {
  protected readonly loremIpsum1 = exampleData.loremIpsum.full.split(' ').slice(0, 100).join(' ');
  protected readonly loremIpsum2 = exampleData.loremIpsum.full.split(' ').slice(100, 200).join(' ');
  protected readonly loremIpsum3 = exampleData.loremIpsum.full.split(' ').slice(200, 300).join(' ');
}
