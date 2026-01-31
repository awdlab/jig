import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { MenuItem, NgnMenu } from '@ngneers/controls/menu';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnMenu, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnMenu', component: component() }]">
      <ngn-menu #ref [items]="items()" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsMenuPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnMenu });
  protected readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ]);
}
