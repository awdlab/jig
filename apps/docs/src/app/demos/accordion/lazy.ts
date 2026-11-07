import { Component } from '@angular/core';
import { JigAccordion, JigAccordionPanel } from '@awdlab/jig/accordion';

import { exampleData } from '../../utils/sample-data/data';
import {
  Demo_Dummies_LoremIpsum_1,
  Demo_Dummies_LoremIpsum_2,
} from '../_shared/dummies/lorem-ipsum';

@Component({
  selector: 'jig-demo-accordion-lazy-content',
  template: `{{ loremIpsum3 }}`,
})
export class Demo_Accordion_Lazy_Content {
  protected readonly loremIpsum3 = exampleData.loremIpsum.full.split(' ').slice(200, 300).join(' ');
  constructor() {
    console.log('Demo_Accordion_Lazy_Content initialized');
  }
}

@Component({
  selector: 'jig-demo-accordion-lazy',
  imports: [
    JigAccordion,
    JigAccordionPanel,
    Demo_Dummies_LoremIpsum_1,
    Demo_Dummies_LoremIpsum_2,
    Demo_Accordion_Lazy_Content,
  ],
  template: `<jig-accordion [lazy]="true">
    <jig-accordion-panel [header]="'Panel 1'">
      <ng-template #content>
        <jig-demo-dummies-lorem-ipsum-1 />
      </ng-template>
    </jig-accordion-panel>
    <jig-accordion-panel [header]="'Panel 2'" [lazy]="false">
      <ng-template #content>
        <jig-demo-dummies-lorem-ipsum-2 />
      </ng-template>
    </jig-accordion-panel>
    <jig-accordion-panel [header]="'Panel 3'" [cache]="true">
      <ng-template #content>
        <jig-demo-accordion-lazy-content />
      </ng-template>
    </jig-accordion-panel>
  </jig-accordion>`,
})
export class Demo_Accordion_Lazy {}
