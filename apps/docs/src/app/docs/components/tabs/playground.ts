import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { AwdTabs, AwdTab } from '@awdlab/jig/tabs';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-tabs-playground',
  imports: [AwdTabs, AwdTab, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdTabs', component: component() }]">
      <jig-tabs class="flex-1" #ref>
        <jig-tab #ref2 tabId="tab1">
          <ng-template #header>Tab 1</ng-template>
          <ng-template #content>Content 1</ng-template>
        </jig-tab>
        <jig-tab #ref2 tabId="tab2">
          <ng-template #header>Tab 2</ng-template>
          <ng-template #content>Content 2</ng-template>
        </jig-tab>
        <jig-tab #ref2 tabId="tab3">
          <ng-template #header>Tab 3</ng-template>
          <ng-template #content>Content 3</ng-template>
        </jig-tab>
      </jig-tabs>
    </jig-docs-playground>
  `,
})
export class AwdDocsTabsPlayground {
  private readonly _componentTabs = viewChild.required('ref', { read: AwdTabs });
  private readonly _componentTab = viewChildren('ref2', { read: AwdTab });
  protected readonly component = computed(() => [this._componentTabs(), ...this._componentTab()]);
}
