import { Component } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@awdlab/jig/accordion';

import { exampleData } from '../../helper/data';
import { DummyLoremIpsumComponent1, DummyLoremIpsumComponent2 } from '../dummies/lorem-ipsum';

@Component({
  selector: 'demo-3',
  template: `{{ loremIpsum3 }}`,
})
export class Demo3Component {
  protected readonly loremIpsum3 = exampleData.loremIpsum.full.split(' ').slice(200, 300).join(' ');
  constructor() {
    console.log('Demo3Component initialized');
  }
}

@Component({
  selector: 'awd-demo-accordion-lazy',
  imports: [
    NgnAccordion,
    NgnAccordionPanel,
    DummyLoremIpsumComponent1,
    DummyLoremIpsumComponent2,
    Demo3Component,
  ],
  template: `<awd-accordion [lazy]="true">
    <awd-accordion-panel [header]="'Panel 1'">
      <ng-template #content>
        <dummy-lorem-ipsum-1 />
      </ng-template>
    </awd-accordion-panel>
    <awd-accordion-panel [header]="'Panel 2'" [lazy]="false">
      <ng-template #content>
        <dummy-lorem-ipsum-2 />
      </ng-template>
    </awd-accordion-panel>
    <awd-accordion-panel [header]="'Panel 3'" [cache]="true">
      <ng-template #content>
        <demo-3 />
      </ng-template>
    </awd-accordion-panel>
  </awd-accordion>`,
})
export class Demo_Accordion_Lazy {}
