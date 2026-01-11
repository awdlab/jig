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
    <ngn-slider [value]="value()" [readonly]="true" />
    Disabled:
    <ngn-slider [value]="value()" [disabled]="true" />
  `,
})
export class Demo_Slider_States {
  protected readonly value = signal(50);
}
