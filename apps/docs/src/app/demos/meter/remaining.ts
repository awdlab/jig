import { Component, computed, signal } from '@angular/core';
import { JigMeter } from '@awdlab/jig/meter';

import type { MeterItem } from '@awdlab/jig/meter';

const CAPACITY = 500;

@Component({
  selector: 'jig-demo-meter-remaining',
  imports: [JigMeter],
  template: `<jig-meter label="Backup storage" [items]="items()" [total]="capacity" />`,
  host: { class: 'w-full max-w-140' },
})
export class Demo_Meter_Remaining {
  protected readonly capacity = CAPACITY;
  protected readonly used = signal<MeterItem[]>([
    { label: 'Snapshots', value: 186 },
    { label: 'Archives', value: 97 },
    { label: 'Logs', value: 43 },
  ]);

  /** The leftover as its own item: named, in the legend, and read out like any other. */
  protected readonly items = computed<MeterItem[]>(() => {
    const used = this.used();
    const free = CAPACITY - used.reduce((sum, item) => sum + item.value, 0);
    return [...used, { label: 'Free', value: free, color: 'var(--jig-color-surface-300)' }];
  });
}
