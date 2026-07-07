import { Component, computed, signal } from '@angular/core';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnFilter, type NgnFilterConfig } from '@ngneers/controls/filter';
import { NgnHint } from '@ngneers/controls/hint';

@Component({
  selector: 'ngn-demo-filter-validation',
  imports: [NgnErrors, NgnFilter, NgnHint],
  template: `
    <div class="flex flex-col gap-2">
      <ngn-filter
        [data]="data"
        (filterChange)="filter.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="filterHint"
      />
    </div>
    <ngn-hint #filterHint />
  `,
})
export class Demo_Filter_Validation {
  protected readonly data = ['Germany', 'France', 'Italy', 'Spain'];
  protected readonly filter = signal<NgnFilterConfig | null>(null);
  protected readonly errors = computed(() =>
    this.filter() ? null : { required: 'Add at least one filter rule' }
  );
}
