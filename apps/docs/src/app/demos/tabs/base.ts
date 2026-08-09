import { Component } from '@angular/core';
import { NgnTabs, NgnTab } from '@awdlab/jig/tabs';

import { DummyLoremIpsumComponent1, DummyLoremIpsumComponent2 } from '../dummies/lorem-ipsum';

@Component({
  imports: [NgnTabs, NgnTab, DummyLoremIpsumComponent1, DummyLoremIpsumComponent2],
  selector: 'awd-demo-tabs-base',
  template: `
    <awd-tabs>
      <awd-tab tabId="tab1">
        <ng-template #header> Tab 1 </ng-template>
        <ng-template #content>
          <dummy-lorem-ipsum-1 />
        </ng-template>
      </awd-tab>

      <awd-tab tabId="tab2">
        <ng-template #header> Tab 2 </ng-template>
        <ng-template #content>
          <dummy-lorem-ipsum-2 />
        </ng-template>
      </awd-tab>
    </awd-tabs>
  `,
})
export class Demo_Tabs_Base {}
