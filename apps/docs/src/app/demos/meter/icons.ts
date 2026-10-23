import { Component } from '@angular/core';
import { JigMeter } from '@awdlab/jig/meter';
import tablerBolt from '@iconify/icons-tabler/bolt.js';
import tablerDroplet from '@iconify/icons-tabler/droplet.js';
import tablerFlame from '@iconify/icons-tabler/flame.js';
import tablerSun from '@iconify/icons-tabler/sun.js';
import tablerWindmill from '@iconify/icons-tabler/windmill.js';

import type { MeterItem } from '@awdlab/jig/meter';

@Component({
  selector: 'jig-demo-meter-icons',
  imports: [JigMeter],
  template: `<jig-meter label="Energy mix" [items]="mix" />`,
  host: { class: 'w-full max-w-140' },
})
export class Demo_Meter_Icons {
  protected readonly mix: MeterItem[] = [
    { label: 'Wind', value: 34, icon: tablerWindmill },
    { label: 'Solar', value: 22, icon: tablerSun },
    { label: 'Hydro', value: 17, icon: tablerDroplet },
    { label: 'Nuclear', value: 15, icon: tablerBolt },
    { label: 'Gas', value: 12, icon: tablerFlame },
  ];
}
