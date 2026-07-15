import { Component, signal, viewChild } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-slider-playground',
  imports: [NgnSlider, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnSlider', component: component() }]">
      <ngn-slider
        class="flex-1"
        [class.h-[400px]]="component().vertical()"
        #ref
        [value]="value()"
        (valueChange)="value.set($event)"
      />
    </ngn-docs-playground>
  `,
})
export class NgnDocsSliderPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSlider });
  protected readonly value = signal(50);
}
