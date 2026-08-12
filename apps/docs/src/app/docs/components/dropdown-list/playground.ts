import { Component, viewChild } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigDropdownList } from '@awdlab/jig/dropdown-list';

import { JigDocsPlayground } from '../../../utils/playground/playground';

import type { JigItem } from '@awdlab/jig/api';

@Component({
  selector: 'jig-docs-dropdown-list-playground',
  imports: [JigButton, JigDropdownList, JigDocsPlayground],
  template: `
    <jig-docs-playground
      [controls]="[{ componentName: 'JigDropdownList', component: component() }]"
    >
      <button type="button" jigButton #trigger (click)="component().toggle()">Open the list</button>
      <jig-dropdown-list #ref [anchor]="trigger" label="Options" [items]="options" />
    </jig-docs-playground>
  `,
})
export class JigDocsDropdownListPlayground {
  protected readonly component = viewChild.required('ref', { read: JigDropdownList });
  protected readonly options: JigItem[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];
}
