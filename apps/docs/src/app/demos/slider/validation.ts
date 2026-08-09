import { Component, computed, signal } from '@angular/core';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';
import { AwdSlider } from '@awdlab/jig/slider';

@Component({
  selector: 'jig-demo-slider-validation',
  imports: [AwdErrors, AwdHint, AwdSlider],
  template: `
    <div class="flex flex-col gap-2">
      <jig-slider
        [value]="value()"
        (valueChange)="value.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="sliderHint"
      />
    </div>
    <jig-hint #sliderHint />
  `,
  host: { class: 'block w-80 max-w-full' },
})
export class Demo_Slider_Validation {
  protected readonly value = signal(25);
  protected readonly errors = computed(() =>
    this.value() >= 50 ? null : { min: { min: 50, actual: this.value() } }
  );
}
