import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-slider-vertical',
  imports: [NgnSlider],
  template: `
    <ngn-slider
      class="h-34"
      [vertical]="true"
      [value]="value()"
      (valueChange)="value.set($event)"
    />
    <br />
    {{ value() }}
  `,
})
export class Demo_Slider_Vertical {
  protected readonly value = signal(50);
}
