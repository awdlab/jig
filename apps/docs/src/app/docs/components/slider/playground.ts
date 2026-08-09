import { Component, signal, viewChild } from '@angular/core';
import { AwdSlider } from '@awdlab/jig/slider';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-slider-playground',
  imports: [AwdSlider, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdSlider', component: component() }]">
      <jig-slider
        class="flex-1"
        [class.h-[400px]]="component().vertical()"
        #ref
        [value]="value()"
        (valueChange)="value.set($event)"
      />
    </jig-docs-playground>
  `,
})
export class AwdDocsSliderPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdSlider });
  protected readonly value = signal(50);
}
