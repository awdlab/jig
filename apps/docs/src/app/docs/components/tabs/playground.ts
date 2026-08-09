import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { JigTabs, JigTab } from '@awdlab/jig/tabs';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-tabs-playground',
  imports: [JigTabs, JigTab, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigTabs', component: component() }]">
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
export class JigDocsTabsPlayground {
  private readonly _componentTabs = viewChild.required('ref', { read: JigTabs });
  private readonly _componentTab = viewChildren('ref2', { read: JigTab });
  protected readonly component = computed(() => [this._componentTabs(), ...this._componentTab()]);
}
