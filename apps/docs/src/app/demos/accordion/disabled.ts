import { Component, signal } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@awdlab/jig/accordion';
import { NgnButton } from '@awdlab/jig/button';

import { exampleData } from '../../helper/data';

@Component({
  selector: 'awd-demo-accordion-disabled',
  imports: [NgnAccordion, NgnButton, NgnAccordionPanel],
  template: `<awd-accordion [multiple]="true">
      <awd-accordion-panel [header]="'Panel 1'">
        <ng-template #content> {{ loremIpsum1 }} </ng-template>
      </awd-accordion-panel>
      <awd-accordion-panel [header]="'Panel 2'">
        <ng-template #content> {{ loremIpsum2 }} </ng-template>
      </awd-accordion-panel>
      <awd-accordion-panel [header]="'Panel 3'" [disabled]="isDisabled()">
        <ng-template #content> {{ loremIpsum3 }} </ng-template>
      </awd-accordion-panel>
    </awd-accordion>
    <button ngnButton (click)="toggleDisabled()">Toggle Disabled</button> `,
})
export class Demo_Accordion_Disabled {
  protected readonly loremIpsum1 = exampleData.loremIpsum.full.split(' ').slice(0, 100).join(' ');
  protected readonly loremIpsum2 = exampleData.loremIpsum.full.split(' ').slice(100, 200).join(' ');
  protected readonly loremIpsum3 = exampleData.loremIpsum.full.split(' ').slice(200, 300).join(' ');

  protected readonly isDisabled = signal(true);

  protected toggleDisabled() {
    this.isDisabled.set(!this.isDisabled());
  }
}
