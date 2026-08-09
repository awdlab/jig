import { Component, signal } from '@angular/core';
import { JigTabs, JigTab } from '@awdlab/jig/tabs';

@Component({
  imports: [JigTabs, JigTab],
  selector: 'jig-demo-tabs-navigation',
  template: `
    <!-- Contentless tabs act as a navigation bar. Drive selection off the URL
         via [activeTab] and react to clicks via (activeTabChange). In a real app
         you'd bind (activeTabChange) to router.navigate() and place a
         <router-outlet /> below instead of the panel here. -->
    <jig-tabs [activeTab]="active()" (activeTabChange)="active.set($event)">
      <jig-tab tabId="overview">
        <ng-template #header> Overview </ng-template>
      </jig-tab>
      <jig-tab tabId="settings">
        <ng-template #header> Settings </ng-template>
      </jig-tab>
      <jig-tab tabId="billing">
        <ng-template #header> Billing </ng-template>
      </jig-tab>
    </jig-tabs>

    <p>
      Active route: <code>/{{ active() }}</code>
    </p>
  `,
})
export class Demo_Tabs_Navigation {
  protected readonly active = signal('overview');
}
