import { Component } from '@angular/core';
import { JigMeter } from '@awdlab/jig/meter';

import type { MeterItem } from '@awdlab/jig/meter';

@Component({
  selector: 'jig-demo-meter-colors',
  imports: [JigMeter],
  template: `<jig-meter label="Build outcomes" [items]="outcomes" />`,
  host: { class: 'w-full max-w-140' },
})
export class Demo_Meter_Colors {
  /** Literal colors, so the meaning of each state holds in every theme. */
  protected readonly outcomes: MeterItem[] = [
    { label: 'Passed', value: 214, color: '#16a34a' },
    { label: 'Flaky', value: 26, color: '#d97706' },
    { label: 'Failed', value: 11, color: '#dc2626' },
    { label: 'Skipped', value: 9, color: 'rgb(148 163 184)' },
  ];
}
