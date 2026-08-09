import { Component, computed, signal } from '@angular/core';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigSwitch } from '@awdlab/jig/switch';

@Component({
  selector: 'jig-demo-switch-validation',
  imports: [JigErrors, JigHint, JigSwitch],
  template: `
    <div class="flex flex-col gap-2">
      <jig-switch
        [value]="enabled()"
        (valueChange)="enabled.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="switchHint"
      />
      <jig-hint #switchHint />
    </div>
  `,
})
export class Demo_Switch_Validation {
  protected readonly enabled = signal(false);
  protected readonly errors = computed(() =>
    this.enabled() ? null : { required: 'Enable this setting before saving' }
  );
}
