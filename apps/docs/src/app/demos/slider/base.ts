import { Component, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

@Component({
  selector: 'ngn-demo-slider-base',
  imports: [NgnSlider],
  template: `
    <ngn-slider [value]="value()" (valueChange)="value.set($event)" />
    <br />
    {{ value() }}
  `,
  host: { class: 'flex-1 max-w-100' },
})
export class Demo_Slider_Base {
  protected readonly value = signal(50);
}
