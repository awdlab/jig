import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-slider-base',
  imports: [NgnSlider],
  template: `
    <ngn-slider [value]="value()" (valueChange)="value.set($event)" />
    <br />
    {{ value() }}
  `,
})
export class Demo_Slider_Base {
  protected readonly value = signal(50);
}
