import { Component, viewChild } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdPopover } from '@awdlab/jig/popover';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-popover-playground',
  imports: [AwdPopover, AwdButton, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdPopover', component: component() }]">
      <button ngnButton #anchor (click)="component().show()">Open Popover</button>
      <jig-popover #ref [anchor]="anchor">Popover Content</jig-popover>
    </jig-docs-playground>
  `,
})
export class AwdDocsPopoverPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdPopover });
}
