import { Component, computed, signal } from '@angular/core';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdFilter, type AwdFilterConfig } from '@awdlab/jig/filter';
import { AwdHint } from '@awdlab/jig/hint';

@Component({
  selector: 'jig-demo-filter-validation',
  imports: [AwdErrors, AwdFilter, AwdHint],
  template: `
    <div class="flex flex-col gap-2">
      <jig-filter
        [data]="data"
        (filterChange)="filter.set($event)"
        ngnErrors
        ngnErrorsShowOn="always"
        [ngnErrorsCustom]="errors()"
        [ngnErrorsHint]="filterHint"
      />
    </div>
    <jig-hint #filterHint />
  `,
})
export class Demo_Filter_Validation {
  protected readonly data = ['Germany', 'France', 'Italy', 'Spain'];
  protected readonly filter = signal<AwdFilterConfig | null>(null);
  protected readonly errors = computed(() =>
    this.filter() ? null : { required: 'Add at least one filter rule' }
  );
}
