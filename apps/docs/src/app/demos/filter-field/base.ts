import { Component, computed, signal } from '@angular/core';
import { JigFilterField, type JigFilterConfig } from '@awdlab/jig/filter-field';

@Component({
  selector: 'jig-demo-filter-base',
  imports: [JigFilterField],
  template: `
    <div class="flex flex-col gap-2">
      <jig-filter-field
        [data]="data"
        (filterChange)="output.set($event)"
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
export class Demo_FilterField_Base {
  protected readonly data: readonly string[] = [
    'Germany',
    'France',
    'Italy',
    'Spain',
    'Sweden',
    'Switzerland',
    'Greece',
  ];

  protected readonly output = signal<JigFilterConfig | null>(null);
  protected readonly filteredData = signal<readonly string[] | null>(null);
  protected readonly filtered = computed(() => this.filteredData() ?? this.data);
}
