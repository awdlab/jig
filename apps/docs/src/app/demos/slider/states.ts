import { Component, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

@Component({
  selector: 'ngn-demo-slider-states',
  imports: [NgnSlider],
  template: `
    Default:
    <ngn-slider [value]="value()" (valueChange)="value.set($event)" />
    Readonly:
    <ngn-slider [value]="value()" readonly />
    Disabled:
    <ngn-slider [value]="value()" disabled />
    Invalid:
    <ngn-slider
      [value]="value()"
      [invalidOn]="'immediate'"
      invalid
      (valueChange)="value.set($event)"
    />
    Invalid + Readonly:
    <ngn-slider [value]="value()" [invalidOn]="'immediate'" invalid readonly />
    Invalid + Disabled:
    <ngn-slider [value]="value()" [invalidOn]="'immediate'" invalid disabled />
  `,
  host: { class: 'flex-1 max-w-100' },
})
export class Demo_Slider_States {
  protected readonly value = signal(50);
}
