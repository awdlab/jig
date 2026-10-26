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
      @if (playground.values().JigFilterField?.mode === 'headless') {
        <button jigButton #anchor (click)="ref.show()">Open filter</button>
        <jig-filter-field #ref [anchor]="anchor" [data]="data" />
      } @else {
        <jig-filter-field #ref [data]="data" />
      }
    </jig-docs-playground>
  `,
})
export class JigDocsFilterFieldPlayground {
  protected readonly component = viewChild('ref', { read: JigFilterField });
  protected readonly data: readonly string[] = ['Germany', 'France', 'Italy', 'Spain', 'Sweden'];
}
