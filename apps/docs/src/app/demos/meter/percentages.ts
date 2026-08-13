import { Component } from '@angular/core';
import { JigMeter } from '@awdlab/jig/meter';

import type { MeterItem } from '@awdlab/jig/meter';

@Component({
  selector: 'jig-demo-meter-percentages',
  imports: [JigMeter],
  template: `<jig-meter label="Ticket queue" [items]="queue" [showPercentage]="false" />`,
  host: { class: 'w-full max-w-140' },
})
export class Demo_Meter_Percentages {
  protected readonly queue: MeterItem[] = [
    { label: 'Open', value: 42 },
    { label: 'In progress', value: 18 },
    { label: 'Waiting on customer', value: 9 },
  ];
}
