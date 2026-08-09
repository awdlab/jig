import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'awd-demo-toggle-button-validation',
  imports: [NgnErrors, NgnHint, NgnToggleButton],
  template: `
    <div class="flex flex-col items-start gap-2">
      <awd-toggle-button
        label="Confirmed"
        [value]="confirmed()"
        (valueChange)="confirmed.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="confirmHint"
      />
      <awd-hint #confirmHint />
    </div>
  `,
})
export class Demo_ToggleButton_Validation {
  protected readonly confirmed = signal(false);
  protected readonly errors = computed(() =>
    this.confirmed() ? null : { required: 'Confirm this choice' }
  );
}
