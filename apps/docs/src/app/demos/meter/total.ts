import { Component } from '@angular/core';
import { JigMeter } from '@awdlab/jig/meter';

import type { MeterItem } from '@awdlab/jig/meter';

@Component({
  selector: 'jig-demo-meter-total',
  imports: [JigMeter],
  template: `<jig-meter label="Sprint capacity" [items]="booked" [total]="80" />`,
  host: { class: 'w-full max-w-140' },
})
export class Demo_Meter_Total {
  /** 54 of the sprint's 80 hours are booked — the rest stays empty track. */
  protected readonly booked: MeterItem[] = [
    { label: 'Feature work', value: 28 },
    { label: 'Bug fixing', value: 14 },
    { label: 'Reviews', value: 12 },
  ];
}
