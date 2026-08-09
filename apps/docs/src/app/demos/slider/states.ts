import { Component, signal } from '@angular/core';
import { NgnSlider } from '@awdlab/jig/slider';

@Component({
  selector: 'awd-demo-slider-states',
  imports: [NgnSlider],
  template: `
    Default:
    <awd-slider [value]="value()" (valueChange)="value.set($event)" />
    Readonly:
    <awd-slider [value]="value()" readonly />
    Disabled:
    <awd-slider [value]="value()" disabled />
    Invalid:
    <awd-slider
      [value]="value()"
      [invalidOn]="'immediate'"
      invalid
      (valueChange)="value.set($event)"
    />
    Invalid + Readonly:
    <awd-slider [value]="value()" [invalidOn]="'immediate'" invalid readonly />
    Invalid + Disabled:
    <awd-slider [value]="value()" [invalidOn]="'immediate'" invalid disabled />
  `,
  host: { class: 'flex-1 max-w-100' },
})
export class Demo_Slider_States {
  protected readonly value = signal(50);
}
