import { Component, signal, viewChild } from '@angular/core';
import { NgnSlider } from '@awdlab/jig/slider';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-slider-playground',
  imports: [NgnSlider, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnSlider', component: component() }]">
      <awd-slider
        class="flex-1"
        [class.h-[400px]]="component().vertical()"
        #ref
        [value]="value()"
        (valueChange)="value.set($event)"
      />
    </awd-docs-playground>
  `,
})
export class NgnDocsSliderPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSlider });
  protected readonly value = signal(50);
}
