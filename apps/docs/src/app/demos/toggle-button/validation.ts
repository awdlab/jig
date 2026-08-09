import { Component, computed, signal } from '@angular/core';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'jig-demo-toggle-button-validation',
  imports: [JigErrors, JigHint, JigToggleButton],
  template: `
    <div class="flex flex-col items-start gap-2">
      <jig-toggle-button
        label="Confirmed"
        [value]="confirmed()"
        (valueChange)="confirmed.set($event)"
        jigErrors
        jigErrorsShowOn="always"
        [jigErrorsCustom]="errors()"
        [jigErrorsHint]="confirmHint"
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
