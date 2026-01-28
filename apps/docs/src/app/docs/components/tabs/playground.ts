import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnTabs, NgnTab } from '@ngneers/controls/tabs';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnTabs, NgnTab, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnTabs" [component]="component()">
      <ngn-tabs #ref>
        <ngn-tab tabId="tab1">
          <ng-template #header>Tab 1</ng-template>
          <ng-template #content>Content 1</ng-template>
        </ngn-tab>
        <ngn-tab tabId="tab2">
          <ng-template #header>Tab 2</ng-template>
          <ng-template #content>Content 2</ng-template>
        </ngn-tab>
        <ngn-tab tabId="tab3">
          <ng-template #header>Tab 3</ng-template>
          <ng-template #content>Content 3</ng-template>
        </ngn-tab>
      </ngn-tabs>
    </ngn-docs-playground>
  `,
})
export class NgnDocsTabsPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnTabs });
}
