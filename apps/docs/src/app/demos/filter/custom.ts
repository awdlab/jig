import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { executeFilter } from '@ngneers/controls/api';
import { NgnFilter, NgnFilterConfig } from '@ngneers/controls/filter';

type Country = {
  name: string;
  code: string;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-filter-custom',
  imports: [NgnFilter],
  template: `
    <div class="flex flex-col gap-2">
      <ngn-filter
        mode="inline"
        dataType="custom"
        [filterLocally]="false"
        [data]="data"
        (filterChange)="config.set($event)"
      />

      <div class="text-sm opacity-70">Filtered: {{ filtered().length }}/{{ data.length }}</div>

      <ul class="list-disc pl-5">
        @for (item of filtered(); track item.code) {
          <li>{{ item.name }} ({{ item.code }})</li>
        }
      </ul>
    </div>
  `,
})
export class Demo_Filter_Custom {
  protected readonly data: readonly Country[] = [
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'ES' },
    { name: 'Sweden', code: 'SE' },
  ];

  protected readonly config = signal<NgnFilterConfig | null>(null);

  protected readonly filtered = computed(() => {
    const cfg = this.config();
    if (!cfg) {
      return this.data;
    }
    return executeFilter(this.data, cfg, item => item.name);
  });
}
