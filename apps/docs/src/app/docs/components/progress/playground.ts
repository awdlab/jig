import { Component, signal, viewChild } from '@angular/core';
import { JigProgress } from '@awdlab/jig/progress';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-progress-playground',
  imports: [JigProgress, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigProgress', component: component() }]">
      <jig-progress class="flex-1" #ref [value]="value()" />
    </jig-docs-playground>
  `,
})
export class JigDocsProgressPlayground {
  protected readonly component = viewChild.required('ref', { read: JigProgress });
  protected readonly value = signal(50);
}
