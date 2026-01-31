import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnPopover } from '@ngneers/controls/popover';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnPopover, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnPopover', component: component() }]">
      <button #anchor (click)="component().show()">Open Popover</button>
      <ngn-popover #ref [anchor]="anchor">Popover Content</ngn-popover>
    </ngn-docs-playground>
  `,
})
export class NgnDocsPopoverPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnPopover });
}
