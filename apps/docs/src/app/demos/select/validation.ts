import { Component, computed, signal } from '@angular/core';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

import type { JigItemsValue } from '@awdlab/jig/api';

@Component({
  selector: 'jig-demo-select-validation',
  imports: [AwdErrors, AwdHint, AwdInputField, AwdSelect],
  template: `
    <jig-input-field [label]="'Assignee'" [labelKind]="'on'" class="w-64">
      <jig-select
        [options]="options"
        [value]="value()"
        (valueChange)="value.set($event)"
        [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="assigneeHint"
      />
    </jig-input-field>
    <jig-hint #assigneeHint />
  `,
})
export class Demo_Select_Validation {
  protected readonly options = exampleData.items.flatPreformatted;
  protected readonly value = signal<JigItemsValue<typeof this.options> | null>(null);
  protected readonly errors = computed(() =>
    this.value() ? null : { required: 'Select an assignee' }
  );
}
