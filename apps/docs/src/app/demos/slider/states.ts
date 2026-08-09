import { Component, signal } from '@angular/core';
import { AwdSlider } from '@awdlab/jig/slider';

@Component({
  selector: 'jig-demo-slider-states',
  imports: [AwdSlider],
  template: `
    Default:
    <jig-slider [value]="value()" (valueChange)="value.set($event)" />
    Readonly:
    <jig-slider [value]="value()" readonly />
    Disabled:
    <jig-slider [value]="value()" disabled />
    Invalid:
    <jig-slider
      [value]="value()"
      [invalidOn]="'immediate'"
      invalid
      (valueChange)="value.set($event)"
    />
    Invalid + Readonly:
    <jig-slider [value]="value()" [invalidOn]="'immediate'" invalid readonly />
    Invalid + Disabled:
    <jig-slider [value]="value()" [invalidOn]="'immediate'" invalid disabled />
  `,
  host: { class: 'flex-1 max-w-100' },
})
export class Demo_Slider_States {
  protected readonly value = signal(50);
}
