import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnFilter, type NgnFilterConfig } from '@ngneers/controls/filter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-filter-headless',
  imports: [NgnButton, NgnFilter],
  template: `
    <div class="flex flex-col gap-2">
      <button type="button" ngnButton #btn (click)="filter.show()">Open filter</button>

      <ngn-filter
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

  protected readonly output = signal<NgnFilterConfig | null>(null);
  protected readonly filteredData = signal<readonly string[] | null>(null);
  protected readonly filtered = computed(() => this.filteredData() ?? this.data);
}
