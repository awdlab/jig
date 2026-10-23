import { Component, computed, signal } from '@angular/core';
import { JigFilter, type JigFilterOperatorId } from '@awdlab/jig/filter';

@Component({
  selector: 'jig-demo-filter-operators',
  imports: [JigFilter],
  template: `
    <div class="flex flex-col gap-2">
      <jig-filter
        mode="inline"
        [data]="data"
        [operators]="operators"
        [defaultOperator]="'startsWith'"
        (filterResultChange)="filteredData.set($event)"
      />

      <div class="text-sm opacity-70">Filtered: {{ filtered().length }}/{{ data.length }}</div>

      <ul class="list-disc ps-5">
        @for (item of filtered(); track item) {
          <li>{{ item }}</li>
        }
      </ul>
    </div>
  `,
})
export class Demo_Filter_Operators {
  protected readonly data: readonly string[] = [
    'Germany',
    'France',
    'Italy',
    'Spain',
    'Sweden',
    'Switzerland',
    'Greece',
  ];

  protected readonly operators: readonly JigFilterOperatorId[] = [
    'startsWith',
    'contains',
    'isEqual',
  ];

  protected readonly filteredData = signal<readonly string[] | null>(null);
  protected readonly filtered = computed(() => this.filteredData() ?? this.data);
}
