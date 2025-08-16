import { Component } from '@angular/core';
import { NgnTabs, NgnTab } from '@ngneers/controls/tabs';

@Component({
  selector: 'demo-1',
  template: `Content 1`,
})
export class Demo1Component {
  constructor() {
    console.log('Demo1Component initialized');
  }
}

@Component({
  selector: 'demo-2',
  template: `Content 2`,
})
export class Demo2Component {
  constructor() {
    console.log('Demo2Component initialized');
  }
}

@Component({
  imports: [NgnTabs, NgnTab, Demo1Component, Demo2Component],
  selector: 'ngn-tabs-base',
  template: `
    <ngn-tabs>
      <ngn-tab tabId="tab1">
        <ng-template #header> Tab 1 </ng-template>
        <ng-template #content>
          <demo-1 />
        </ng-template>
      </ngn-tab>

      <ngn-tab tabId="tab2">
        <ng-template #header> Tab 2 </ng-template>
        <ng-template #content>
          <demo-2 />
        </ng-template>
      </ngn-tab>
    </ngn-tabs>
  `,
})
export class Demo_Tabs_Base {}
