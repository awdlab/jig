import { Component, computed, viewChild, viewChildren } from '@angular/core';
import { NgnTabs, NgnTab } from '@awdlab/jig/tabs';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-tabs-playground',
  imports: [NgnTabs, NgnTab, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnTabs', component: component() }]">
      <awd-tabs class="flex-1" #ref>
        <awd-tab #ref2 tabId="tab1">
          <ng-template #header>Tab 1</ng-template>
          <ng-template #content>Content 1</ng-template>
        </awd-tab>
        <awd-tab #ref2 tabId="tab2">
          <ng-template #header>Tab 2</ng-template>
          <ng-template #content>Content 2</ng-template>
        </awd-tab>
        <awd-tab #ref2 tabId="tab3">
          <ng-template #header>Tab 3</ng-template>
          <ng-template #content>Content 3</ng-template>
        </awd-tab>
      </awd-tabs>
    </awd-docs-playground>
  `,
})
export class NgnDocsTabsPlayground {
  private readonly _componentTabs = viewChild.required('ref', { read: NgnTabs });
  private readonly _componentTab = viewChildren('ref2', { read: NgnTab });
  protected readonly component = computed(() => [this._componentTabs(), ...this._componentTab()]);
}
