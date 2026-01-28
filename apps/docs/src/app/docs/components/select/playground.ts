import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnItem } from '@ngneers/controls/api';
import { NgnSelect } from '@ngneers/controls/select';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelect, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnSelect" [component]="component()">
      <ngn-select #ref [options]="options" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsSelectPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSelect });
  protected readonly options: NgnItem[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];
}
