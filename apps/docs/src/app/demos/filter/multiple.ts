import { Component, computed, signal } from '@angular/core';
import { AwdFilter, type AwdFilterConfig } from '@awdlab/jig/filter';

@Component({
  selector: 'jig-demo-filter-multiple',
  imports: [AwdFilter],
  template: `
    <div class="flex flex-col gap-2">
      <jig-filter
        mode="inline"
        [allowMultiple]="true"
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
export class Demo_Filter_Multiple {
  protected readonly data: readonly string[] = [
    'Apple',
    'Apricot',
    'Banana',
    'Blueberry',
    'Cherry',
    'Grapes',
    'Lemon',
    'Orange',
    'Strawberry',
  ];

  protected readonly output = signal<AwdFilterConfig | null>(null);
  protected readonly filteredData = signal<readonly string[] | null>(null);
  protected readonly filtered = computed(() => this.filteredData() ?? this.data);
}
