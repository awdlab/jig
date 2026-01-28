import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSlider, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnSlider" [component]="component()">
      <ngn-slider #ref [value]="value()" (valueChange)="value.set($event)" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsSliderPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSlider });
  protected readonly value = signal(50);
}
