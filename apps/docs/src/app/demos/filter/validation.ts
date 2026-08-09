import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnFilter, type NgnFilterConfig } from '@awdlab/jig/filter';
import { NgnHint } from '@awdlab/jig/hint';

@Component({
  selector: 'awd-demo-filter-validation',
  imports: [NgnErrors, NgnFilter, NgnHint],
  template: `
    <div class="flex flex-col gap-2">
      <awd-filter
        [data]="data"
        (filterChange)="filter.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="filterHint"
      />
    </div>
    <awd-hint #filterHint />
  `,
})
export class Demo_Filter_Validation {
  protected readonly data = ['Germany', 'France', 'Italy', 'Spain'];
  protected readonly filter = signal<NgnFilterConfig | null>(null);
  protected readonly errors = computed(() =>
    this.filter() ? null : { required: 'Add at least one filter rule' }
  );
}
