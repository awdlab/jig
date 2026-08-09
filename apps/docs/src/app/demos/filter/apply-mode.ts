import { Component, computed, signal } from '@angular/core';
import { NgnFilter, type NgnFilterConfig } from '@awdlab/jig/filter';

@Component({
  selector: 'awd-demo-filter-apply-mode',
  imports: [NgnFilter],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <div class="text-sm font-medium">Manual Apply (inline)</div>
        <awd-filter
          mode="inline"
          [autoApply]="false"
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

      <div class="flex flex-col gap-2">
        <div class="text-sm font-medium">Manual Apply (popover)</div>
        <awd-filter
          [autoApply]="false"
          [data]="data"
          (filterChange)="output2.set($event)"
          (filterResultChange)="filteredData2.set($event)"
        />
        <div class="text-sm opacity-70">Filtered: {{ filtered2().length }}/{{ data.length }}</div>
        <ul class="list-disc pl-5">
          @for (item of filtered2(); track item) {
            <li>{{ item }}</li>
          }
        </ul>
      </div>
    </div>
  `,
})
export class Demo_Filter_ApplyMode {
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

  protected readonly output = signal<NgnFilterConfig | null>(null);
  protected readonly filteredData = signal<readonly string[] | null>(null);
  protected readonly filtered = computed(() => this.filteredData() ?? this.data);

  protected readonly output2 = signal<NgnFilterConfig | null>(null);
  protected readonly filteredData2 = signal<readonly string[] | null>(null);
  protected readonly filtered2 = computed(() => this.filteredData2() ?? this.data);
}
