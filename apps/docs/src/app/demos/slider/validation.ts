import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnSlider } from '@awdlab/jig/slider';

@Component({
  selector: 'awd-demo-slider-validation',
  imports: [NgnErrors, NgnHint, NgnSlider],
  template: `
    <div class="flex flex-col gap-2">
      <awd-slider
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="sliderHint"
      />
    </div>
    <awd-hint #sliderHint />
  `,
  host: { class: 'block w-80 max-w-full' },
})
export class Demo_Slider_Validation {
  protected readonly value = signal(25);
  protected readonly errors = computed(() =>
    this.value() >= 50 ? null : { min: { min: 50, actual: this.value() } }
  );
}
