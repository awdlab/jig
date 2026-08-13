import { Component, viewChild } from '@angular/core';
import { JigMeter } from '@awdlab/jig/meter';

import { JigDocsPlayground } from '../../../utils/playground/playground';

import type { MeterItem } from '@awdlab/jig/meter';

@Component({
  selector: 'jig-docs-meter-playground',
  imports: [JigMeter, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigMeter', component: component() }]">
      <!-- A vertical track sizes against its own host, so the height follows the toggle. -->
      <jig-meter
        #ref
        class="w-full max-w-140"
        [class.h-52]="ref.vertical()"
        label="Disk usage"
        [items]="items"
        [total]="100"
      />
    </jig-docs-playground>
  `,
})
export class JigDocsMeterPlayground {
  protected readonly component = viewChild.required('ref', { read: JigMeter });
  protected readonly items: MeterItem[] = [
    { label: 'Documents', value: 32 },
    { label: 'Media', value: 24 },
    { label: 'Applications', value: 15 },
  ];
}
