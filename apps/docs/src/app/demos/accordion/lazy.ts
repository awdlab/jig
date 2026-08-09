import { Component } from '@angular/core';
import { JigAccordion, JigAccordionPanel } from '@awdlab/jig/accordion';

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
  selector: 'jig-demo-accordion-lazy',
  imports: [
    JigAccordion,
    JigAccordionPanel,
    DummyLoremIpsumComponent1,
    DummyLoremIpsumComponent2,
    Demo3Component,
  ],
  template: `<jig-accordion [lazy]="true">
    <jig-accordion-panel [header]="'Panel 1'">
      <ng-template #content>
        <dummy-lorem-ipsum-1 />
      </ng-template>
    </jig-accordion-panel>
    <jig-accordion-panel [header]="'Panel 2'" [lazy]="false">
      <ng-template #content>
        <dummy-lorem-ipsum-2 />
      </ng-template>
    </jig-accordion-panel>
    <jig-accordion-panel [header]="'Panel 3'" [cache]="true">
      <ng-template #content>
        <demo-3 />
      </ng-template>
    </jig-accordion-panel>
  </jig-accordion>`,
})
export class Demo_Accordion_Lazy {}
