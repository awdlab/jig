import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnInputField } from '@awdlab/jig/input-field';
import { DATE_TIME_MASKS, NgnMaskInput, type MaskInputCfg } from '@awdlab/jig/mask-input';

@Component({
  selector: 'awd-demo-mask-input-validation',
  imports: [NgnErrors, NgnHint, NgnInputField, NgnMaskInput],
  template: `
    <awd-input-field [label]="'Start time'" [labelKind]="'on'" class="w-56">
      <awd-mask-input
        [mask]="mask"
        [value]="value()"
        (valueChange)="value.set($event ?? '')"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="timeHint"
      />
    </awd-input-field>
    <awd-hint #timeHint />
  `,
})
export class Demo_MaskInput_Validation {
  protected readonly value = signal('');
  protected readonly mask: MaskInputCfg = DATE_TIME_MASKS.time;
  protected readonly errors = computed(() =>
    /^\d{2}:\d{2}$/.test(this.value()) ? null : { required: 'Enter a complete time' }
  );
}
