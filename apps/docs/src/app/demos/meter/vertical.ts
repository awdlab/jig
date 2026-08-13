import { Component } from '@angular/core';
import { JigMeter } from '@awdlab/jig/meter';

import type { MeterItem } from '@awdlab/jig/meter';

@Component({
  selector: 'jig-demo-meter-vertical',
  imports: [JigMeter],
  // The height belongs on the meter itself — a vertical track sizes against its own host.
  template: `<jig-meter
    class="h-52"
    vertical
    label="Cluster memory"
    [items]="workloads"
    [total]="64"
  />`,
})
export class Demo_Meter_Vertical {
  /** 64 GiB of node memory, 47 of them claimed by running workloads. */
  protected readonly workloads: MeterItem[] = [
    { label: 'Databases', value: 21 },
    { label: 'API pods', value: 14 },
    { label: 'Workers', value: 8 },
    { label: 'System', value: 4 },
  ];
}
