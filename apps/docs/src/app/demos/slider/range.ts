import { Component, signal } from '@angular/core';
import { JigSlider } from '@awdlab/jig/slider';

@Component({
  selector: 'jig-demo-slider-range',
  imports: [JigSlider],
  template: `
    <jig-slider
      [range]="true"
      [minRangeDistance]="10"
      [value]="value()"
      (valueChange)="value.set($event)"
    />
    <br />
    {{ value()[0] }} – {{ value()[1] }}
  `,
  host: { class: 'flex-1 max-w-100' },
})
export class Demo_Slider_Range {
  protected readonly value = signal<[number, number]>([20, 60]);
}
