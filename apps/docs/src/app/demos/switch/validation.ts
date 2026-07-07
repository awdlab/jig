import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnSwitch } from '@ngneers/controls/switch';

@Component({
  selector: 'ngn-demo-switch-validation',
  imports: [NgnErrors, NgnHint, NgnSwitch],
  template: `
    <div class="flex flex-col gap-2">
      <ngn-switch
        [value]="enabled()"
        (valueChange)="enabled.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="switchHint"
      />
      <ngn-hint #switchHint />
    </div>
  `,
})
export class Demo_Switch_Validation {
  protected readonly enabled = signal(false);
  protected readonly errors = computed(() =>
    this.enabled() ? null : { required: 'Enable this setting before saving' }
  );
}
