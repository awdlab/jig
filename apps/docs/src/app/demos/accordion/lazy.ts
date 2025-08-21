import { Component } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@ngneers/controls/accordion';

import { exampleData } from '../../helper/data';

@Component({
  selector: 'demo-1',
  template: `{{ loremIpsum1 }}`,
})
export class Demo1Component {
  protected readonly loremIpsum1 = exampleData.loremIpsum.full.split(' ').slice(0, 100).join(' ');
  constructor() {
    console.log('Demo1Component initialized');
  }
}

@Component({
  selector: 'demo-2',
  template: `{{ loremIpsum2 }}`,
})
export class Demo2Component {
  protected readonly loremIpsum2 = exampleData.loremIpsum.full.split(' ').slice(100, 200).join(' ');
  constructor() {
    console.log('Demo2Component initialized');
  }
}

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
  imports: [NgnAccordion, NgnAccordionPanel, Demo1Component, Demo2Component, Demo3Component],
  template: `<ngn-accordion [lazy]="true">
    <ngn-accordion-panel [header]="'Panel 1'">
      <ng-template #content>
        <demo-1 />
      </ng-template>
    </ngn-accordion-panel>
    <ngn-accordion-panel [header]="'Panel 2'" [lazy]="false">
      <ng-template #content>
        <demo-2 />
      </ng-template>
    </ngn-accordion-panel>
    <ngn-accordion-panel [header]="'Panel 3'" [cache]="true">
      <ng-template #content>
        <demo-3 />
      </ng-template>
    </ngn-accordion-panel>
  </ngn-accordion>`,
})
export class Demo_Accordion_Lazy {}
