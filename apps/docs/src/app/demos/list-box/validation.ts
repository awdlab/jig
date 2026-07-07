import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

import type { NgnItemsValue } from '@ngneers/controls/api';

@Component({
  selector: 'ngn-demo-list-box-validation',
  imports: [NgnErrors, NgnHint, NgnListBox],
  template: `
    <div class="flex flex-col gap-2">
      <ngn-list-box
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
    <ngn-hint #listHint />
  `,
})
export class Demo_ListBox_Validation {
  protected readonly items = exampleData.items.flatPreformatted;
  protected readonly value = signal<NgnItemsValue<typeof this.items> | null>(null);
  protected readonly errors = computed(() =>
    this.value() ? null : { required: 'Select one item' }
  );
}
