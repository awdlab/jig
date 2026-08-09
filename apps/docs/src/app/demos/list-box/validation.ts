import { Component, computed, signal } from '@angular/core';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigListBox } from '@awdlab/jig/list-box';

import { exampleData } from '../../helper/data';

import type { JigItemsValue } from '@awdlab/jig/api';

@Component({
  selector: 'jig-demo-list-box-validation',
  imports: [JigErrors, JigHint, JigListBox],
  template: `
    <div class="flex flex-col gap-2">
      <jig-list-box
        [items]="items"
        [selectable]="true"
        [value]="value()"
        (valueChange)="value.set($event)"
        style="display: block; height: 260px;"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="listHint"
      />
    </div>
    <jig-hint #listHint />
  `,
})
export class Demo_ListBox_Validation {
  protected readonly items = exampleData.items.flatPreformatted;
  protected readonly value = signal<JigItemsValue<typeof this.items> | null>(null);
  protected readonly errors = computed(() =>
    this.value() ? null : { required: 'Select one item' }
  );
}
