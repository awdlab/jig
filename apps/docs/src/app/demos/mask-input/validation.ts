import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInputField } from '@ngneers/controls/input-field';
import { DATE_TIME_MASKS, NgnMaskInput, type MaskInputCfg } from '@ngneers/controls/mask-input';

@Component({
  selector: 'ngn-demo-mask-input-validation',
  imports: [NgnErrors, NgnHint, NgnInputField, NgnMaskInput],
  template: `
    <ngn-input-field [label]="'Start time'" [labelKind]="'on'" class="w-56">
      <ngn-mask-input
        [mask]="mask"
        [value]="value()"
        (valueChange)="value.set($event ?? '')"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="timeHint"
      />
    </ngn-input-field>
    <ngn-hint #timeHint />
  `,
})
export class Demo_MaskInput_Validation {
  protected readonly value = signal('');
  protected readonly mask: MaskInputCfg = DATE_TIME_MASKS.time;
  protected readonly errors = computed(() =>
    /^\d{2}:\d{2}$/.test(this.value()) ? null : { required: 'Enter a complete time' }
  );
}
