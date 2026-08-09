import { Component, signal, viewChild } from '@angular/core';
import { NgnProgress } from '@awdlab/jig/progress';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-progress-playground',
  imports: [NgnProgress, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnProgress', component: component() }]">
      <awd-progress class="flex-1" #ref [value]="value()" />
    </awd-docs-playground>
  `,
})
export class NgnDocsProgressPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnProgress });
  protected readonly value = signal(50);
}
