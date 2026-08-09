import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnSwitch } from '@awdlab/jig/switch';

@Component({
  selector: 'awd-demo-switch-validation',
  imports: [NgnErrors, NgnHint, NgnSwitch],
  template: `
    <div class="flex flex-col gap-2">
      <awd-switch
        [value]="enabled()"
        (valueChange)="enabled.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="switchHint"
      />
      <awd-hint #switchHint />
    </div>
  `,
})
export class Demo_Switch_Validation {
  protected readonly enabled = signal(false);
  protected readonly errors = computed(() =>
    this.enabled() ? null : { required: 'Enable this setting before saving' }
  );
}
