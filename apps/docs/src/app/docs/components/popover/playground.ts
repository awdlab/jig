import { Component, viewChild } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnPopover } from '@awdlab/jig/popover';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-popover-playground',
  imports: [NgnPopover, NgnButton, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnPopover', component: component() }]">
      <button ngnButton #anchor (click)="component().show()">Open Popover</button>
      <awd-popover #ref [anchor]="anchor">Popover Content</awd-popover>
    </awd-docs-playground>
  `,
})
export class NgnDocsPopoverPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnPopover });
}
