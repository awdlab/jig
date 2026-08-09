import { Component } from '@angular/core';
import { AwdTabs, AwdTab } from '@awdlab/jig/tabs';

import { DummyLoremIpsumComponent1, DummyLoremIpsumComponent2 } from '../dummies/lorem-ipsum';

@Component({
  imports: [AwdTabs, AwdTab, DummyLoremIpsumComponent1, DummyLoremIpsumComponent2],
  selector: 'jig-demo-tabs-base',
  template: `
    <jig-tabs>
      <jig-tab tabId="tab1">
        <ng-template #header> Tab 1 </ng-template>
        <ng-template #content>
          <dummy-lorem-ipsum-1 />
        </ng-template>
      </jig-tab>

      <jig-tab tabId="tab2">
        <ng-template #header> Tab 2 </ng-template>
        <ng-template #content>
          <dummy-lorem-ipsum-2 />
        </ng-template>
      </jig-tab>
    </jig-tabs>
  `,
})
export class Demo_Tabs_Base {}
