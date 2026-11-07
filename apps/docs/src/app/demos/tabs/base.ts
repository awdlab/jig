import { Component } from '@angular/core';
import { JigTabs, JigTab } from '@awdlab/jig/tabs';

import {
  Demo_Dummies_LoremIpsum_1,
  Demo_Dummies_LoremIpsum_2,
} from '../_shared/dummies/lorem-ipsum';

@Component({
  imports: [JigTabs, JigTab, Demo_Dummies_LoremIpsum_1, Demo_Dummies_LoremIpsum_2],
  selector: 'jig-demo-tabs-base',
  template: `
    <jig-tabs>
      <jig-tab tabId="tab1">
        <ng-template #header> Tab 1 </ng-template>
        <ng-template #content>
          <jig-demo-dummies-lorem-ipsum-1 />
        </ng-template>
      </jig-tab>

      <jig-tab tabId="tab2">
        <ng-template #header> Tab 2 </ng-template>
        <ng-template #content>
          <jig-demo-dummies-lorem-ipsum-2 />
        </ng-template>
      </jig-tab>
    </jig-tabs>
  `,
})
export class Demo_Tabs_Base {}
