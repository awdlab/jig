import { Component, signal, viewChild } from '@angular/core';
import { AwdProgress } from '@awdlab/jig/progress';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-progress-playground',
  imports: [AwdProgress, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdProgress', component: component() }]">
      <jig-progress class="flex-1" #ref [value]="value()" />
    </jig-docs-playground>
  `,
})
export class AwdDocsProgressPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdProgress });
  protected readonly value = signal(50);
}
