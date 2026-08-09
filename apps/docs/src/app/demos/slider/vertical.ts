import { Component, signal } from '@angular/core';
import { AwdSlider } from '@awdlab/jig/slider';

@Component({
  selector: 'jig-demo-slider-vertical',
  imports: [AwdSlider],
  template: `
    <jig-slider
      class="h-34"
      [vertical]="true"
      [value]="value()"
      (valueChange)="value.set($event)"
    />
    <br />
    <div class="flex w-10 justify-center">
      {{ value() }}
    </div>
  `,
  host: { class: 'flex flex-col items-center' },
})
export class Demo_Slider_Vertical {
  protected readonly value = signal(50);
}
