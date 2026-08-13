import { Component } from '@angular/core';
import { JigMeter } from '@awdlab/jig/meter';

import type { MeterItem } from '@awdlab/jig/meter';

@Component({
  selector: 'jig-demo-meter-base',
  imports: [JigMeter],
  template: `<jig-meter label="Traffic sources" [items]="sources" />`,
  host: { class: 'w-full max-w-140' },
})
export class Demo_Meter_Base {
  protected readonly sources: MeterItem[] = [
    { label: 'Organic search', value: 4820 },
    { label: 'Direct', value: 2140 },
    { label: 'Social', value: 1360 },
    { label: 'Referral', value: 780 },
  ];
}
