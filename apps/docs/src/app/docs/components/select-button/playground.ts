import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnSelectButton } from '@ngneers/controls/select-button';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelectButton, NgnDocsPlayground],
  template: `
    <ngn-docs-playground
      [controls]="[{ componentName: 'NgnSelectButton', component: component() }]"
    >
      <ngn-select-button #ref [options]="options" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsSelectButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSelectButton });
  protected readonly options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ] as const;
}
