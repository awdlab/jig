import { Component, viewChild } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigPopover } from '@awdlab/jig/popover';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-popover-playground',
  imports: [JigPopover, JigButton, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigPopover', component: component() }]">
      <button jigButton #anchor (click)="component().show()">Open Popover</button>
      <jig-popover #ref [anchor]="anchor">Popover Content</jig-popover>
    </jig-docs-playground>
  `,
})
export class JigDocsPopoverPlayground {
  protected readonly component = viewChild.required('ref', { read: JigPopover });
}
