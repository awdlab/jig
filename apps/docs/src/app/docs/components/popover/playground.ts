import { Component, viewChild } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnPopover } from '@ngneers/controls/popover';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-popover-playground',
  imports: [NgnPopover, NgnButton, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnPopover', component: component() }]">
      <button ngnButton #anchor (click)="component().show()">Open Popover</button>
      <ngn-popover #ref [anchor]="anchor">Popover Content</ngn-popover>
    </ngn-docs-playground>
  `,
})
export class NgnDocsPopoverPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnPopover });
}
