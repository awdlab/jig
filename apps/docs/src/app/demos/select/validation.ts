import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

import type { NgnItemsValue } from '@ngneers/controls/api';

@Component({
  selector: 'ngn-demo-select-validation',
  imports: [NgnErrors, NgnHint, NgnInputField, NgnSelect],
  template: `
    <ngn-input-field [label]="'Assignee'" [labelKind]="'on'" class="w-64">
      <ngn-select
        [options]="options"
        [value]="value()"
        (valueChange)="value.set($event)"
        [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="assigneeHint"
      />
    </ngn-input-field>
    <ngn-hint #assigneeHint />
  `,
})
export class Demo_Select_Validation {
  protected readonly options = exampleData.items.flatPreformatted;
  protected readonly value = signal<NgnItemsValue<typeof this.options> | null>(null);
  protected readonly errors = computed(() =>
    this.value() ? null : { required: 'Select an assignee' }
  );
}
