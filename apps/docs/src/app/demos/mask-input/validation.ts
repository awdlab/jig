import { Component, computed, signal } from '@angular/core';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigInputField } from '@awdlab/jig/input-field';
import { DATE_TIME_MASKS, JigMaskInput, type MaskInputCfg } from '@awdlab/jig/mask-input';

@Component({
  selector: 'jig-demo-mask-input-validation',
  imports: [JigErrors, JigHint, JigInputField, JigMaskInput],
  template: `
    <jig-input-field [label]="'Start time'" [labelKind]="'on'" class="w-56">
      <jig-mask-input
        [mask]="mask"
        [value]="value()"
        (valueChange)="value.set($event ?? '')"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="timeHint"
      />
    </jig-input-field>
    <jig-hint #timeHint />
  `,
})
export class Demo_MaskInput_Validation {
  protected readonly value = signal('');
  protected readonly mask: MaskInputCfg = DATE_TIME_MASKS.time;
  protected readonly errors = computed(() =>
    /^\d{2}:\d{2}$/.test(this.value()) ? null : { required: 'Enter a complete time' }
  );
}
