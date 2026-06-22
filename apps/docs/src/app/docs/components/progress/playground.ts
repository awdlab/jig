import { Component, signal, viewChild } from '@angular/core';
import { NgnProgress } from '@ngneers/controls/progress';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  imports: [NgnProgress, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnProgress', component: component() }]">
      <ngn-progress class="flex-1" #ref [value]="value()" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsProgressPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnProgress });
  protected readonly value = signal(50);
}
