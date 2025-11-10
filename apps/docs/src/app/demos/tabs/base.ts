import { Component } from '@angular/core';
import { NgnTabs, NgnTab } from '@ngneers/controls/tabs';

import { DummyLoremIpsumComponent1, DummyLoremIpsumComponent2 } from '../dummies/lorem-ipsum';

@Component({
  imports: [NgnTabs, NgnTab, DummyLoremIpsumComponent1, DummyLoremIpsumComponent2],
  selector: 'ngn-demo-tabs-base',
  template: `
    <ngn-tabs>
      <ngn-tab tabId="tab1">
        <ng-template #header> Tab 1 </ng-template>
        <ng-template #content>
          <dummy-lorem-ipsum-1 />
        </ng-template>
      </ngn-tab>

      <ngn-tab tabId="tab2">
        <ng-template #header> Tab 2 </ng-template>
        <ng-template #content>
          <dummy-lorem-ipsum-2 />
        </ng-template>
      </ngn-tab>
    </ngn-tabs>
  `,
})
export class Demo_Tabs_Base {}
