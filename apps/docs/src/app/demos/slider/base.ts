import { Component, signal } from '@angular/core';
import { AwdSlider } from '@awdlab/jig/slider';

@Component({
  selector: 'jig-demo-slider-base',
  imports: [AwdSlider],
  template: `
    <jig-slider [value]="value()" (valueChange)="value.set($event)" />
    <br />
    {{ value() }}
  `,
  host: { class: 'flex-1 max-w-100' },
})
export class Demo_Slider_Base {
  protected readonly value = signal(50);
}
