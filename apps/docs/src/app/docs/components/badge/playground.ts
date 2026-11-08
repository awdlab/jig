import { Component, computed, viewChild } from '@angular/core';
import { JigBadge } from '@awdlab/jig/badge';
import { JigButton } from '@awdlab/jig/button';

import { JigDocsPlayground } from '../../../utils/playground/playground';

import type { AnyJigBase } from '@awdlab/jig/base';

@Component({
  selector: 'jig-docs-badge-playground',
  imports: [JigBadge, JigButton, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigBadge', component: component() }]">
      <button #ref jigButton [jigBadge]="8">Inbox</button>
    </jig-docs-playground>
  `,
})
export class JigDocsBadgePlayground {
  private readonly _badge = viewChild.required('ref', { read: JigBadge });
  // JigBadge is a plain directive; the playground only drives its input signals.
  protected readonly component = computed(() => this._badge() as unknown as AnyJigBase);
}
