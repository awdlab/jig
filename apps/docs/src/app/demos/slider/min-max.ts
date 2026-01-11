import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-slider-min-max',
  imports: [NgnSlider],
  template: `
    <ngn-slider [value]="value()" (valueChange)="value.set($event)" [min]="0" [max]="5" />
    <br />
    {{ value() }}
  `,
})
export class Demo_Slider_MinMax {
  protected readonly value = signal(1);
}
