import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnInplace } from '@ngneers/controls/inplace';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInplace, NgnTemplate, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnInplace', component: component() }]">
      <ngn-inplace #ref>
        <ng-template #display>Show Details</ng-template>
        <ng-template #content [ngnTemplate]="component().templateTypes.content">
          <div>Content details here</div>
        </ng-template>
      </ngn-inplace>
    </ngn-docs-playground>
  `,
})
export class NgnDocsInplacePlayground {
  protected readonly component = viewChild.required('ref', { read: NgnInplace });
}
