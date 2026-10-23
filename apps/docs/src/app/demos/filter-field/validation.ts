import { Component, computed, signal } from '@angular/core';
import { JigErrors } from '@awdlab/jig/errors';
import { JigFilterField, type JigFilterConfig } from '@awdlab/jig/filter-field';
import { JigHint } from '@awdlab/jig/hint';

@Component({
  selector: 'jig-demo-filter-validation',
  imports: [JigErrors, JigFilterField, JigHint],
  template: `
    <div class="flex flex-col gap-2">
      <jig-filter
        [data]="data"
        (filterChange)="filter.set($event)"
        jigErrors
        jigErrorsShowOn="always"
        [jigErrorsCustom]="errors()"
        [jigErrorsHint]="filterHint"
      />
    </div>
    <jig-hint #filterHint />
  `,
})
export class Demo_FilterField_Validation {
  protected readonly data = ['Germany', 'France', 'Italy', 'Spain'];
  protected readonly filter = signal<JigFilterConfig | null>(null);
  protected readonly errors = computed(() =>
    this.filter() ? null : { required: 'Add at least one filter rule' }
  );
}
