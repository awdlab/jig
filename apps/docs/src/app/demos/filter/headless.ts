import { Component, computed, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigFilter, type JigFilterConfig } from '@awdlab/jig/filter';

@Component({
  selector: 'jig-demo-filter-headless',
  imports: [JigButton, JigFilter],
  template: `
    <div class="flex flex-col gap-2">
      <button type="button" ngnButton #btn (click)="filter.show()">Open filter</button>

      <jig-filter
        #filter
        mode="headless"
        [anchor]="btn"
        [data]="data"
        (filterChange)="output.set($event)"
        (filterResultChange)="filteredData.set($event)"
      />

      <div class="text-sm opacity-70">Filtered: {{ filtered().length }}/{{ data.length }}</div>

      <ul class="list-disc pl-5">
        @for (item of filtered(); track item) {
          <li>{{ item }}</li>
        }
      </ul>
    </div>
  `,
})
export class Demo_Filter_Headless {
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
