import { Component } from '@angular/core';
import { AwdAccordion, AwdAccordionPanel } from '@awdlab/jig/accordion';

import { exampleData } from '../../helper/data';

@Component({
  selector: 'jig-demo-accordion-base',
  imports: [AwdAccordion, AwdAccordionPanel],
  template: `<jig-accordion>
    <jig-accordion-panel [header]="'Panel 1'">
      <ng-template #content> {{ loremIpsum1 }} </ng-template>
    </jig-accordion-panel>
    <jig-accordion-panel [header]="'Panel 2'">
      <ng-template #content> {{ loremIpsum2 }} </ng-template>
    </jig-accordion-panel>
    <jig-accordion-panel [header]="'Panel 3'">
      <ng-template #content> {{ loremIpsum3 }} </ng-template>
    </jig-accordion-panel>
  </jig-accordion>`,
})
export class Demo_Accordion_Base {
  protected readonly loremIpsum1 = exampleData.loremIpsum.full.split(' ').slice(0, 100).join(' ');
  protected readonly loremIpsum2 = exampleData.loremIpsum.full.split(' ').slice(100, 200).join(' ');
  protected readonly loremIpsum3 = exampleData.loremIpsum.full.split(' ').slice(200, 300).join(' ');
}
