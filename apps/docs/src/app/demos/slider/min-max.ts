import { Component, signal } from '@angular/core';
import { JigSlider } from '@awdlab/jig/slider';

@Component({
  selector: 'jig-demo-slider-min-max',
  imports: [JigSlider],
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
