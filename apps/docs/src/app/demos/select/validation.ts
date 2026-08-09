import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

import type { NgnItemsValue } from '@awdlab/jig/api';

@Component({
  selector: 'awd-demo-select-validation',
  imports: [NgnErrors, NgnHint, NgnInputField, NgnSelect],
  template: `
    <awd-input-field [label]="'Assignee'" [labelKind]="'on'" class="w-64">
      <awd-select
        [options]="options"
        [value]="value()"
        (valueChange)="value.set($event)"
        [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="assigneeHint"
      />
    </awd-input-field>
    <awd-hint #assigneeHint />
  `,
})
export class Demo_Select_Validation {
  protected readonly options = exampleData.items.flatPreformatted;
  protected readonly value = signal<NgnItemsValue<typeof this.options> | null>(null);
  protected readonly errors = computed(() =>
    this.value() ? null : { required: 'Select an assignee' }
  );
}
