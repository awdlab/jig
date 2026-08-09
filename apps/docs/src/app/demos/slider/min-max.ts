import { Component, signal } from '@angular/core';
import { AwdSlider } from '@awdlab/jig/slider';

@Component({
  selector: 'jig-demo-slider-min-max',
  imports: [AwdSlider],
  template: `
    <jig-slider [value]="value()" (valueChange)="value.set($event)" [min]="0" [max]="5" />
    <br />
    {{ value() }}
  `,
  host: { class: 'flex-1 max-w-100' },
})
export class Demo_Slider_MinMax {
  protected readonly value = signal(1);
}
