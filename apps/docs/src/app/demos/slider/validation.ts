import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnSlider } from '@ngneers/controls/slider';

@Component({
  selector: 'ngn-demo-slider-validation',
  imports: [NgnErrors, NgnHint, NgnSlider],
  template: `
    <div class="flex flex-col gap-2">
      <ngn-slider
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="sliderHint"
      />
    </div>
    <ngn-hint #sliderHint />
  `,
  host: { class: 'block w-80 max-w-full' },
})
export class Demo_Slider_Validation {
  protected readonly value = signal(25);
  protected readonly errors = computed(() =>
    this.value() >= 50 ? null : { min: { min: 50, actual: this.value() } }
  );
}
