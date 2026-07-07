import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnToggleButton } from '@ngneers/controls/toggle-button';

@Component({
  selector: 'ngn-demo-toggle-button-validation',
  imports: [NgnErrors, NgnHint, NgnToggleButton],
  template: `
    <div class="flex flex-col items-start gap-2">
      <ngn-toggle-button
        label="Confirmed"
        [value]="confirmed()"
        (valueChange)="confirmed.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="confirmHint"
      />
      <ngn-hint #confirmHint />
    </div>
  `,
})
export class Demo_ToggleButton_Validation {
  protected readonly confirmed = signal(false);
  protected readonly errors = computed(() =>
    this.confirmed() ? null : { required: 'Confirm this choice' }
  );
}
