import { Component, signal } from '@angular/core';
import { NgnTabs, NgnTab } from '@awdlab/jig/tabs';

@Component({
  imports: [NgnTabs, NgnTab],
  selector: 'awd-demo-tabs-navigation',
  template: `
    <!-- Contentless tabs act as a navigation bar. Drive selection off the URL
         via [activeTab] and react to clicks via (activeTabChange). In a real app
         you'd bind (activeTabChange) to router.navigate() and place a
         <router-outlet /> below instead of the panel here. -->
    <awd-tabs [activeTab]="active()" (activeTabChange)="active.set($event)">
      <awd-tab tabId="overview">
        <ng-template #header> Overview </ng-template>
      </awd-tab>
      <awd-tab tabId="settings">
        <ng-template #header> Settings </ng-template>
      </awd-tab>
      <awd-tab tabId="billing">
        <ng-template #header> Billing </ng-template>
      </awd-tab>
    </awd-tabs>

    <p>
      Active route: <code>/{{ active() }}</code>
    </p>
  `,
})
export class Demo_Tabs_Navigation {
  protected readonly active = signal('overview');
}
