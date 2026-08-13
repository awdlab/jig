import { Component } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigMeter } from '@awdlab/jig/meter';

import type { MeterItem } from '@awdlab/jig/meter';

@Component({
  selector: 'jig-demo-meter-templates',
  imports: [JigMeter, JigTemplate],
  template: `
    <jig-meter #meter label="Backup storage" [items]="buckets" [total]="500">
      <ng-template
        #label
        let-item
        let-percentage="percentage"
        [jigTemplate]="meter.templateTypes.label"
      >
        <span class="font-medium">{{ item.label }}</span>
        <span class="text-[var(--jig-color-surface-600)]">
          {{ item.value }} GB · {{ percentage.toFixed(1) }}%
        </span>
      </ng-template>
    </jig-meter>
  `,
  host: { class: 'w-full max-w-140' },
})
export class Demo_Meter_Templates {
  protected readonly buckets: MeterItem[] = [
    { label: 'Snapshots', value: 186 },
    { label: 'Archives', value: 97 },
    { label: 'Logs', value: 43 },
  ];
}
