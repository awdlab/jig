import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    <ngn-slider [value]="value()" invalid (valueChange)="value.set($event)" />
    Invalid + Readonly:
    <ngn-slider [value]="value()" invalid readonly />
    Invalid + Disabled:
    <ngn-slider [value]="value()" invalid disabled />
  `,
})
export class Demo_Slider_States {
  protected readonly value = signal(50);
}
