import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@ngneers/controls/accordion';

import { exampleData } from '../../helper/data';
import { DummyLoremIpsumComponent1, DummyLoremIpsumComponent2 } from '../dummies/lorem-ipsum';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-accordion-lazy',
  imports: [
    NgnAccordion,
    NgnAccordionPanel,
    DummyLoremIpsumComponent1,
    DummyLoremIpsumComponent2,
    Demo3Component,
  ],
  template: `<ngn-accordion [lazy]="true">
    <ngn-accordion-panel [header]="'Panel 1'">
      <ng-template #content>
        <dummy-lorem-ipsum-1 />
      </ng-template>
    </ngn-accordion-panel>
    <ngn-accordion-panel [header]="'Panel 2'" [lazy]="false">
      <ng-template #content>
        <dummy-lorem-ipsum-2 />
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
