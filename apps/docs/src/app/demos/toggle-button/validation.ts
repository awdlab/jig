import { Component, computed, signal } from '@angular/core';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';
import { AwdToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'jig-demo-toggle-button-validation',
  imports: [AwdErrors, AwdHint, AwdToggleButton],
  template: `
    <div class="flex flex-col items-start gap-2">
      <jig-toggle-button
        label="Confirmed"
        [value]="confirmed()"
        (valueChange)="confirmed.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="confirmHint"
      />
      <jig-hint #confirmHint />
    </div>
  `,
})
export class Demo_ToggleButton_Validation {
  protected readonly confirmed = signal(false);
  protected readonly errors = computed(() =>
    this.confirmed() ? null : { required: 'Confirm this choice' }
  );
}
