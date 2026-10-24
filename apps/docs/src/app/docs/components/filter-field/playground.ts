import { Component, viewChild } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigFilterField } from '@awdlab/jig/filter-field';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-filter-playground',
  imports: [JigFilterField, JigButton, JigDocsPlayground],
  template: `
    <jig-docs-playground
      #playground
      [controls]="[{ componentName: 'JigFilterField', component: component() }]"
    >
      <button
        [style.display]="playground.values().JigFilterField?.mode === 'headless' ? null : 'none'"
        jigButton
        #anchor
        (click)="ref.show()"
      >
        Open filter
      </button>
      <jig-filter-field #ref [anchor]="anchor" [data]="data" />
    </jig-docs-playground>
  `,
})
export class JigDocsFilterFieldPlayground {
  protected readonly component = viewChild.required('ref', { read: JigFilterField });
  protected readonly data: readonly string[] = ['Germany', 'France', 'Italy', 'Spain', 'Sweden'];
}
